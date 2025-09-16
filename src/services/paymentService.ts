import apiClient from '@/lib/apiClient';

export interface PaymentRequest {
  userUUID: string;
  price: string;
  planName: string;
}

export interface PaymentResponse {
  status: number;
  message: string;
  status_code: number;
  session_url: {
    session_url: string;
    session_id: string;
    user_uuid: string;
    plan_name: string;
    price: string;
    created_at: string;
  };
}


export const createStripeSession = async (paymentData: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('Creating Stripe session with data:', paymentData);
    const response = await apiClient.post(
      "/api/payment/create-session",
      paymentData
    );
    console.log('Stripe session response:', response.data);
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