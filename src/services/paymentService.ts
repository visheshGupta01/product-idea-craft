import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY || "");

export interface PaymentRequest {
  user_uuid: string;
  price: string;
  plan_name: string;
  credits: number;
}

export interface PaymentResponse {
  status: number;
  message: string;
  status_code: number;
  session_url: {
    user_uuid: string;
    session_url: string;
    session_id: string;
    plan_name: string;
    price: string;
    created_at: string;
  };
}


export const createStripeSession = async (paymentData: PaymentRequest): Promise<void> => {
  try {
    console.log('Creating Stripe session with data:', paymentData);
    const response = await apiClient.post<PaymentResponse>(
      API_ENDPOINTS.PAYMENT.CREATE_SESSION,
      paymentData
    );
    console.log('Stripe session response:', response.data);
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.session_url.session_id
    });

    if (error) {
      console.error('Stripe redirect error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    throw error;
  }
};

export const getPaymentPlans = () => {
  return [
    {
      name: 'Free',
      price: '0',
      planId: 1,
      features: ['Generate up to 3 projects/month', 'Access to core AI prompts']
    },
    {
      name: 'Pro',
      price: '19',
      planId: 2,
      features: ['Unlimited projects', 'Custom domains', 'Full prompt library access']
    },
    {
      name: 'Team',
      price: '49',
      planId: 3,
      features: ['Unlimited projects', 'Custom domains', 'Full prompt library access', 'Export code (HTML/CSS)']
    }
  ];
};