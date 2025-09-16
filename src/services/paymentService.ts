import apiClient from '@/lib/apiClient';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51QCJweRSRZcJVhKkVEjYrMxB9TvULchZV9Us1PON1j8xmowuu6Etb5OGZchy8uXTtm9Ce8T0nFptrlA8ABsh7BDE00E8gu1wqN');

export interface PaymentRequest {
  userUUID: string;
  price: string;
  planName: string;
}

export interface PaymentResponse {
  Status: number;
  Message: string;
  StatusCode: number;
  SessionURL: {
    SessionURL: string;
    SessionID: string;
    UserUUID: string;
    PlanName: string;
    Price: string;
    CreatedAt: string;
  };
}


export const createStripeSession = async (paymentData: PaymentRequest): Promise<void> => {
  try {
    console.log('Creating Stripe session with data:', paymentData);
    const response = await apiClient.post<PaymentResponse>(
      "/api/payment/create-session",
      paymentData
    );
    console.log('Stripe session response:', response.data);
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.data.SessionURL.SessionID
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