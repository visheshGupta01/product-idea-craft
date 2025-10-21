import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

// Razorpay key
const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_RReeLKTiqG0e3W";

export interface PaymentRequest {
  user_uuid: string;
  price: string;
  plan_name: string;
  credits: number;
  plan_id: number;
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
    //console.log('Creating Razorpay order with data:', paymentData);

    // Create order on backend
    const response = await apiClient.post<RazorpayOrderResponse>(
      "/api/payment/create-order",
      {
        user_id: paymentData.user_uuid,
        amount: parseFloat(paymentData.price),
        currency: "USD",
        credits: paymentData.credits,
        planid: paymentData.plan_id,
      }
    );

    //console.log('Razorpay order response:', response.data);

    if (!response.data.id) {
      throw new Error("Failed to create order");
    }

    // Initialize Razorpay checkout
    const options = {
      key: RAZORPAY_KEY,
      amount: response.data.amount,
      currency: response.data.currency,
      name: "imagine.bo",
      description: `${paymentData.plan_name} Plan`,
      order_id: response.data.id,
      handler: async function (razorpayResponse: any) {
        //console.log('Payment response:', razorpayResponse);

        try {
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

          // alert(verifyRes.data)
          //console.log('Verification response:', verifyRes.data);

          // Redirect to success page
          window.location.href = "/payment-success";
        } catch (err) {
          //console.error("Verification failed:", err);
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
    //console.error("Error creating Razorpay payment:", error);
    throw error;
  }
};

export const getPaymentPlans = async () => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PAYMENT.GET_PRICING);
    return response.data;
  } catch (error) {
    //console.error("Error fetching payment plans:", error);
    throw error;
  }
};
