import apiClient from '@/lib/apiClient';

export interface PaymentRequest {
  userUUID: string;
  price: string;
  planName: string;
}

export interface PaymentResponse {
  status: number;
  message: string;
  statusCode: number;
  sessionURL: {
    sessionURL: string;
    sessionID: string;
    userUUID: string;
    planName: string;
    price: string;
    createdAt: string;
  };
}

export const createStripeSession = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    const response = await apiClient.post('/payment/create-stripe-session', paymentData);
    return response.data;
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