// src/services/paymentService.ts

import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { trackEvent } from "@/utils/metaPixel";

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface PaymentRequest {
  user_id: string;
  amount: string; // display amount (e.g. "499")
  plan_name: string;
  credits: number;
  plan_id: number;
  country?: string;
}

export interface UnifiedPaymentRequest {
  user_id: string;
  amount: number; // paise / cents
  plan_name: string;
  plan_id: number;
  country: string;
  credits: number;
}

export interface ProcessResult<T> {
  provider: "razorpay" | "paypal";
  data: T;
}

/* ------------------------- Razorpay ORDER response ------------------------- */
export interface RazorpayOrderData {
  id: string; // order_id
  amount: number; // paise
  currency: string; // "INR"
  receipt: string;
  status: string;
}

/* --------------------------- PayPal response ------------------------------- */
export interface PaypalSessionResponse {
  id: string;
  approve_link: string;
  status: string;
  amount: number;
  currency_code: string;
}

export interface StripeSessionResponse {
  id: string;
  session_url: object;
  status: string;
  amount: number;
  currency_code: string;
}

export type PayResponse =
  | ProcessResult<RazorpayOrderData>
  | ProcessResult<PaypalSessionResponse>;

declare global {
  interface Window {
    Razorpay: any;
  }
}

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

export const getUserCountry = (): string => {
  try {
    const raw = localStorage.getItem("user_data");
    if (!raw) return "Unknown";
    return JSON.parse(raw)?.country || "Unknown";
  } catch {
    return "Unknown";
  }
};

/* -------------------------------------------------------------------------- */
/*                              MAIN ENTRY POINT                              */
/* -------------------------------------------------------------------------- */

export const createPayment = async (
  paymentData: PaymentRequest
): Promise<void> => {
  const unifiedRequest: UnifiedPaymentRequest = {
    user_id: paymentData.user_id,
    amount: Math.round(parseFloat(paymentData.amount)),
    plan_name: paymentData.plan_name,
    plan_id: paymentData.plan_id,
    country: paymentData.country || getUserCountry() || "Unknown",
    credits: paymentData.credits,
  };

  console.log("Initiating payment with data:", unifiedRequest);

  try {
    const response = await apiClient.post<PayResponse>(
      "/api/payment/pay",
      unifiedRequest
    );

    const result = response.data;

    console.log("Payment provider response:", result);

    if (result.provider === "razorpay") {
      await handleRazorpayOrder(result.data as RazorpayOrderData, paymentData);
      return;
    }

    if (result.provider === "paypal") {
      await handlePaypalFlow(
        result.data as PaypalSessionResponse,
        unifiedRequest
      );
      return;
    }
    if (result.provider === "stripe") {
      await handleStripeFlow(
        result.data as StripeSessionResponse,
        unifiedRequest
      );
      return;
    }

    throw new Error("Unsupported payment provider");
  } catch (error) {
    console.error("Payment initiation failed:", error);
    throw error;
  }
};

/* -------------------------------------------------------------------------- */
/*                           RAZORPAY ORDER FLOW                               */
/* -------------------------------------------------------------------------- */

const handleRazorpayOrder = async (
  order: RazorpayOrderData,
  originalData: PaymentRequest
): Promise<void> => {
  if (!window.Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }

  const displayAmount = order.amount / 100;
  console.log("Opening Razorpay checkout for amount:", displayAmount);

  const options = {
    key: RAZORPAY_KEY,
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
    name: "imagine.bo",
    description: `${originalData.plan_name} Plan`,

    handler: async (response: any) => {
      try {
        sessionStorage.setItem("payment_attempted", "true");

        trackEvent("Purchase", {
          content_name: originalData.plan_name,
          value: displayAmount,
          currency: order.currency,
        });

        trackEvent("Subscribe", {
          content_name: originalData.plan_name,
          value: displayAmount,
          currency: order.currency,
        });

        sessionStorage.setItem("payment_completed", "true");
        window.location.href = "/payment-success";
      } catch (err) {
        console.error("Razorpay success handler error:", err);
        window.location.href = "/payment-failed";
      }
    },

    theme: {
      color: "#fb02a5",
    },

    modal: {
      ondismiss: () => {
        console.log("Razorpay modal closed");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on("payment.failed", () => {
    sessionStorage.setItem("payment_attempted", "true");
    window.location.href = "/payment-failed";
  });
};

/* -------------------------------------------------------------------------- */
/*                              PAYPAL FLOW                                   */
/* -------------------------------------------------------------------------- */

const handlePaypalFlow = async (
  paypal: PaypalSessionResponse,
  unifiedRequest: UnifiedPaymentRequest
): Promise<void> => {
  if (!paypal.approve_link) {
    throw new Error("PayPal approval link missing");
  }

  try {
    trackEvent("Purchase", {
      content_name: unifiedRequest.plan_name,
      value: unifiedRequest.amount / 100,
      currency: paypal.currency_code || "USD",
    });

    trackEvent("Subscribe", {
      content_name: unifiedRequest.plan_name,
      value: unifiedRequest.amount / 100,
      currency: paypal.currency_code || "USD",
    });
  } catch (err) {
    console.warn("Tracking failed (PayPal):", err);
  }

  sessionStorage.setItem("payment_attempted", "true");
  window.location.href = paypal.approve_link;
};

const handleStripeFlow = async (
  stripe: StripeSessionResponse,
  unifiedRequest: UnifiedPaymentRequest
): Promise<void> => {
  if (!stripe.session_url) {
    throw new Error("Stripe session URL missing");
  }

  try {
    trackEvent("Purchase", {
      content_name: unifiedRequest.plan_name,
      value: unifiedRequest.amount / 100,
      currency: stripe.session_url.currency_code || "USD",
    });

    trackEvent("Subscribe", {
      content_name: unifiedRequest.plan_name,
      value: unifiedRequest.amount / 100,
      currency: stripe.session_url.currency_code || "USD",
    });
  } catch (err) {
    console.warn("Tracking failed (Stripe):", err);
  }

  sessionStorage.setItem("payment_attempted", "true");
  window.location.href = stripe.session_url.session_url;
};

/* -------------------------------------------------------------------------- */
/*                           BACKWARD COMPAT                                  */
/* -------------------------------------------------------------------------- */

export const createRazorpayPayment = async (
  paymentData: PaymentRequest
): Promise<void> => {
  return createPayment(paymentData);
};

export const getPaymentPlans = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_PRICING);
  return response.data;
};
