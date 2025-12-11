import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";
import { trackEvent } from "@/utils/metaPixel";

// Razorpay key
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

export interface PaymentRequest {
  user_uuid: string;
  price: string;
  plan_name: string;
  credits: number;
  plan_id: number;
  country: string;
}

export interface RazorpayOrderResponse {
  id: string;
  amount: number;
  currency: string;
  user_id: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const createRazorpayPayment = async (
  paymentData: PaymentRequest
): Promise<void> => {
  try {
    console.log('Creating Razorpay order with data:', paymentData);

    // FIXED: Let the backend decide the currency based on country
    // Remove the hardcoded "USD" currency
    const res = await apiClient.post<RazorpayOrderResponse>(
      "/api/payment/pay",
      {
        user_id: paymentData.user_uuid,
        amount: parseFloat(paymentData.price),
        credits: paymentData.credits,
        plan_id: paymentData.plan_id,
        plan_name: paymentData.plan_name,
        country: paymentData.country,
      }
    );

    const response = res.data;

    console.log('Razorpay order response:', response.data);
    console.log('Razorpay order ID:', response.data.id);
    console.log('Currency from backend:', response.data.currency);

    if (!response.data.id) {
      throw new Error("Failed to create order");
    }

    // Display currency conversion info to user if needed
    const displayCurrency = response.data.currency === 'INR' ? '₹' : '$';
    const displayAmount = response.data.currency === 'INR' 
      ? (response.data.amount / 100).toFixed(2) 
      : paymentData.price;

    // Initialize Razorpay checkout with explicit config
    const options = {
      key: RAZORPAY_KEY,
      amount: response.data.amount, // Amount from backend (in paise/cents)
      currency: response.data.currency, // Currency from backend
      name: "imagine.bo",
      description: `${paymentData.plan_name} Plan - ${displayCurrency}${displayAmount}`,
      order_id: response.data.id,
      // CRITICAL: Explicitly enable all payment methods
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay using',
              instruments: [
                {
                  method: 'card',
                },
                {
                  method: 'netbanking',
                },
                {
                  method: 'wallet',
                },
                {
                  method: 'upi',
                }
              ],
            },
          },
          sequence: ['block.banks'],
          preferences: {
            show_default_blocks: true,
          },
        },
      },
      handler: async function (razorpayResponse: any) {
        try {
          // Mark payment as attempted
          sessionStorage.setItem("payment_attempted", "true");

          console.log('Payment successful, verifying...', razorpayResponse);

          // Verify payment on backend
          const verifyRes = await apiClient.post(
            "/api/payment/verify-payment",
            {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              user_id: paymentData.user_uuid,
              plan_id: paymentData.plan_id,
              credits: paymentData.credits,
            }
          );

          console.log('Payment verified successfully');

          // Track Purchase and Subscribe events after successful payment
          try {
            const numericValue = parseFloat(String(paymentData.price)) || 0;
            
            // Use the actual currency for tracking
            const trackingCurrency = response.data.currency === 'INR' ? 'INR' : 'USD';
            const trackingValue = response.data.currency === 'INR' 
              ? response.data.amount / 100 
              : numericValue;

            trackEvent("Purchase", {
              content_name: paymentData.plan_name,
              value: trackingValue,
              currency: trackingCurrency,
            });
            trackEvent("Subscribe", {
              content_name: paymentData.plan_name,
              value: trackingValue,
              currency: trackingCurrency,
            });
          } catch (fbErr) {
            console.warn('Facebook tracking failed:', fbErr);
          }

          // Mark payment as completed
          sessionStorage.setItem("payment_completed", "true");
          sessionStorage.removeItem("payment_attempted");

          // Redirect to success page
          window.location.href = "/payment-success";
        } catch (err) {
          console.error('Payment verification failed:', err);
          // Verification failed
          sessionStorage.setItem("payment_attempted", "true");
          window.location.href = "/payment-failed";
        }
      },
      modal: {
        ondismiss: function() {
          console.log('Payment modal closed by user');
          // Optional: Track when user closes the payment modal
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

    console.log('Opening Razorpay checkout with options:', {
      amount: options.amount,
      currency: options.currency,
      order_id: options.order_id
    });

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function (response: any) {
      console.error('Payment failed:', response.error);
      sessionStorage.setItem("payment_attempted", "true");
      window.location.href = "/payment-failed";
    });

    rzp.open();
  } catch (error) {
    console.error("Error creating Razorpay payment:", error);
    throw error;
  }
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