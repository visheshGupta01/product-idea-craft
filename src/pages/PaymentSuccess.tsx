import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/context/UserContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { fetchProfile } = useUser();

  useEffect(() => {
    // Check if user came from payment flow
    const paymentCompleted = sessionStorage.getItem('payment_completed');
    
    if (!paymentCompleted) {
      // Redirect to home if accessed directly
      navigate('/');
      return;
    }
    
    // Clear the flag
    sessionStorage.removeItem('payment_completed');
    
    // Refresh user profile to get updated plan information
    fetchProfile();
  }, [fetchProfile, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been processed successfully and your plan has been activated.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            You will receive an email confirmation shortly with your payment details.
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;