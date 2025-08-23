import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { LoginModal } from './LoginModal';

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
  const [verificationState, setVerificationState] = useState<'idle' | 'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Automatically start verification when modal opens
  useEffect(() => {
    if (isOpen && token) {
      handleVerification();
    }
  }, [isOpen, token]);

  const handleVerification = async () => {
    if (!token) {
      setVerificationState('error');
      setMessage('Invalid verification link. No token found.');
      return;
    }

    setVerificationState('loading');
    
    try {
      const result = await verifyEmail(token);
      console.log(result);
      if (result.success) {
        setVerificationState('success');
        setMessage('Your email has been successfully verified! You can now log in to your account.');
        // Automatically show login modal after short delay
        setTimeout(() => {
          setShowLoginModal(true);
          onClose(); // Close verification modal
        }, 1500);
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

  const handleLoginModalClose = () => {
    setShowLoginModal(false);
  };

  return (
    <>
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
            <DialogTitle className="text-2xl text-center">
              {verificationState === 'idle' && 'Verify Your Email'}
              {verificationState === 'loading' && 'Verifying Email...'}
            {verificationState === 'success' && 'Email Successfully Verified!'}
            {verificationState === 'error' && 'Verification Failed'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {verificationState === 'loading' && (
              <p className="text-muted-foreground">
                Please wait while we verify your email address...
              </p>
            )}
            
            {message && (
              <p className="text-muted-foreground">
                {message}
              </p>
            )}
            
            <div className="flex flex-col space-y-3">
              {verificationState === 'success' && (
                <p className="text-sm text-muted-foreground">
                  Redirecting to login...
                </p>
              )}
              
              {verificationState === 'error' && (
                <>
                  <Button onClick={handleClose} className="w-full">
                    Close
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    If you continue to experience issues, please contact support.
                  </p>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginModalClose}
        onSwitchToSignup={() => {
          // If they want to signup, we just close the login modal
          setShowLoginModal(false);
        }}
      />
    </>
  );
};