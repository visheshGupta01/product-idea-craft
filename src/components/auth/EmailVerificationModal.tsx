import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  token,
}) => {
  const { verifyEmail } = useUser();
  const [verificationState, setVerificationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleVerification = async () => {
    if (!token) {
      setVerificationState('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    setVerificationState('loading');
    
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

  const handleClose = () => {
    setVerificationState('idle');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {verificationState === 'idle' && (
              <Mail className="h-16 w-16 text-primary" />
            )}
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
          <DialogTitle className="text-2xl">
            {verificationState === 'idle' && 'Verify Your Email'}
            {verificationState === 'loading' && 'Verifying Email...'}
            {verificationState === 'success' && 'Email Verified!'}
            {verificationState === 'error' && 'Verification Failed'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {verificationState === 'idle' && (
            <p className="text-muted-foreground">
              Click the button below to verify your email address.
            </p>
          )}
          
          {message && (
            <p className="text-muted-foreground">
              {message}
            </p>
          )}
          
          <div className="flex flex-col space-y-3">
            {verificationState === 'idle' && (
              <Button onClick={handleVerification} className="w-full">
                Verify Email
              </Button>
            )}
            
            {verificationState !== 'loading' && verificationState !== 'idle' && (
              <Button onClick={handleClose} className="w-full">
                {verificationState === 'success' ? 'Continue' : 'Close'}
              </Button>
            )}
            
            {verificationState === 'error' && (
              <p className="text-xs text-muted-foreground">
                If you continue to experience issues, please contact support.
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};