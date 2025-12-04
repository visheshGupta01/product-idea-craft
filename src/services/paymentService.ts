// src/services/paymentService.ts

import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { trackEvent } from "@/utils/metaPixel";

// Razorpay key
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export interface PaymentRequest {
  user_id: string;
  amount: string; // display price as string
  plan_name: string;
  credits: number;
  plan_id: number;
  country?: string;
}

/**
 * Payload we send to /api/payment/pay
 * Matches imagine.bo/views/api_request.PaymentRequest (conceptually)
 */
export interface UnifiedPaymentRequest {
  user_id: string;
  amount: number; // in paise/cents
  plan_name: string;
  plan_id: number;
  country: string;
  credits: number;
}

/**
 * Generic ProcessResult wrapper (matches Go: payment.ProcessResult[T])
 */
export interface ProcessResult<T> {
  provider: "razorpay" | "stripe" | string;
  data: T;
}

/**
 * Data returned by RazorpayProvider.Process (wrapped in ProcessResult)
 * From your Go code:
 *   Data: map[string]any{
 *     "subscription_id": subID,
 *     "key_id":          envloader.AppConfig.RazorpaykeyID,
 *     "plan_name":       req.PlanName,
 *   }
 */
export interface RazorpaySubscriptionData {
  subscription_id: string;
  key_id: string;
  plan_name: string;
}

/**
 * Stripe response (views.StripeResponse)
 * Assumed shape based on your earlier TS:
 *   url, session_id
 */
export interface StripeSessionResponse {
  url: string;
  session_id: string;
}

/**
 * Union for /api/payment/pay response
 */
export type PayResponse =
  | ProcessResult<RazorpaySubscriptionData>
  | ProcessResult<StripeSessionResponse>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Get user country from localStorage (KEEP ORIGINAL CASE for backend)
export const getUserCountry = (): string => {
  try {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      const parsed = JSON.parse(userData);
      // don't force lowercase; backend compares with "India"
      return parsed?.country || "";
    }
  } catch (error) {
    console.error("Error getting user country:", error);
  }
  return "";
};

// Optional helper if you need to check on frontend
export const isIndianUser = (): boolean => {
  const country = (getUserCountry() || "")
  return country === "India" || country === "in";
};

// MAIN unified payment function that ALWAYS calls /api/payment/pay
export const createPayment = async (
  paymentData: PaymentRequest
): Promise<void> => {
  const country = getUserCountry();

  const unifiedRequest: UnifiedPaymentRequest = {
    user_id: paymentData.user_id,
    amount: Math.round(parseFloat(paymentData.amount) * 100), // Convert to paise/cents
    plan_name: paymentData.plan_name,
    plan_id: paymentData.plan_id,
    country: country,
    credits: paymentData .credits,
  };

  try {
    const response = await apiClient.post<PayResponse>(
      "/api/payment/pay",
      unifiedRequest
    );

    const data = response.data;
    console.log("Payment provider response:", data);

    if (data.provider === "razorpay") {
      // Indian user → Razorpay subscription flow
      await handleRazorpayFlow(
        data.data as RazorpaySubscriptionData,
        paymentData
      );
    } else if (data.provider === "stripe") {
      // Non-Indian user → Stripe Checkout redirect
      await handleStripeFlow(
        data.data as StripeSessionResponse,
        unifiedRequest
      );
    } else {
      console.error("Unknown payment provider:", data.provider);
      throw new Error("Unknown payment provider in response");
    }
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};

// Handle Razorpay subscription flow (for India)
const handleRazorpayFlow = async (
  rp: RazorpaySubscriptionData,
  originalData: PaymentRequest
): Promise<void> => {
  try {
    const options = {
      key: rp.key_id || RAZORPAY_KEY,
      // Subscription checkout: use subscription_id instead of order_id
      subscription_id: rp.subscription_id,
      name: "imagine.bo",
      description: `${originalData.plan_name} Plan`,
      handler: async function (razorpayResponse: any) {
        try {
          sessionStorage.setItem("payment_attempted", "true");
          // Track events
          try {
            const numericValue = parseFloat(String(originalData.amount)) || 0;
            trackEvent("Purchase", {
              content_name: originalData.plan_name,
              value: numericValue,
              currency: "INR",
            });
            trackEvent("Subscribe", {
              content_name: originalData.plan_name,
              value: numericValue,
              currency: "INR",
            });
          } catch (fbErr) {
            // do not block the payment flow if tracking fails
            console.warn("FB tracking error (Razorpay):", fbErr);
          }

          sessionStorage.setItem("payment_completed", "true");
          sessionStorage.removeItem("payment_attempted");
          window.location.href = "/payment-success";
        } catch (err) {
          console.error("Error verifying Razorpay payment:", err);
          sessionStorage.setItem("payment_attempted", "true");
          window.location.href = "/payment-failed";
        }
      },
      prefill: {
        name: "",
        email: "",
        contact: "",
      },
      theme: {
        color: "#fb02a5",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Error starting Razorpay subscription:", error);
    throw error;
  }
};

// Handle Stripe payment flow (for non-India)
const handleStripeFlow = async (
  stripe: StripeSessionResponse,
  unifiedRequest: UnifiedPaymentRequest
): Promise<void> => {
  try {
    if (!stripe.url) {
      throw new Error("Failed to create Stripe session: URL missing");
    }

    // Track events before redirect
    try {
      const numericValue = unifiedRequest.amount / 100;
      trackEvent("Purchase", {
        content_name: unifiedRequest.plan_name,
        value: numericValue,
        currency: "USD", // adjust if multi-currency later
      });
      trackEvent("Subscribe", {
        content_name: unifiedRequest.plan_name,
        value: numericValue,
        currency: "USD",
      });
    } catch (fbErr) {
      console.warn("FB tracking error (Stripe):", fbErr);
    }

    sessionStorage.setItem("payment_attempted", "true");

    // Redirect to Stripe checkout
    window.location.href = stripe.url;
  } catch (error) {
    console.error("Error creating Stripe payment:", error);
    throw error;
  }
};

/**
 * Legacy function for backward compatibility.
 * Keep the same name/signature, but delegate to the new unified flow.
 */
export const createRazorpayPayment = async (
  paymentData: PaymentRequest
): Promise<void> => {
  return createPayment(paymentData);
};

export const getPaymentPlans = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_PRICING);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment plans:", error);
    throw error;
  }
};
