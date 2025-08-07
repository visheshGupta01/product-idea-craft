import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useUser();
  const [verificationState, setVerificationState] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setVerificationState('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    const handleVerification = async () => {
      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setVerificationState('success');
          setMessage('Your email has been successfully verified! You can now log in to your account.');
        } else {
          setVerificationState('error');
          setMessage(result.message || 'Email verification failed. Please try again.');
        }
      } catch (error) {
        setVerificationState('error');
        setMessage('An unexpected error occurred during verification.');
      }
    };

    handleVerification();
  }, [searchParams, verifyEmail]);

  const handleReturnToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {verificationState === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}
            {verificationState === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-500" />
            )}
            {verificationState === 'error' && (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {verificationState === 'loading' && 'Verifying Email...'}
            {verificationState === 'success' && 'Email Verified!'}
            {verificationState === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {message}
          </p>
          
          {verificationState !== 'loading' && (
            <div className="space-y-2">
              <Button onClick={handleReturnToHome} className="w-full">
                {verificationState === 'success' ? 'Go to Login' : 'Back to Home'}
              </Button>
              {verificationState === 'error' && (
                <p className="text-xs text-muted-foreground">
                  If you continue to experience issues, please contact support.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};