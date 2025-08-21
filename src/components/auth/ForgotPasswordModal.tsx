import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/context/UserContext';
import { toast } from '@/hooks/use-toast';
import { Mail, ArrowLeft } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onBackToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { forgotPassword } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        setIsEmailSent(true);
        toast({
          title: "Success",
          description: result.message || "Password reset link sent to your email.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to send reset link.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsEmailSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[480px] p-8 text-center bg-white border-0 rounded-3xl shadow-2xl">
        {isEmailSent ? (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L36 24L12 40V8Z" fill="url(#gradient1)" />
                <circle cx="40" cy="8" r="3" fill="#4285F4" />
                <circle cx="42" cy="12" r="2" fill="#EA4335" />
                <circle cx="44" cy="16" r="1.5" fill="#FBBC05" />
                <circle cx="38" cy="6" r="2" fill="#34A853" />
                <circle cx="36" cy="10" r="1" fill="#4285F4" />
                <defs>
                  <linearGradient id="gradient1" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EA4335" />
                    <stop offset="0.5" stopColor="#E91E63" />
                    <stop offset="1" stopColor="#4285F4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-600">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Please check your email and follow the instructions to reset your password.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onBackToLogin}
                  className="flex-1 h-12 rounded-full border-gray-300"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
                <Button onClick={handleClose} className="flex-1 h-12 bg-black text-white hover:bg-gray-800 rounded-full">
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8L36 24L12 40V8Z" fill="url(#gradient1)" />
                <circle cx="40" cy="8" r="3" fill="#4285F4" />
                <circle cx="42" cy="12" r="2" fill="#EA4335" />
                <circle cx="44" cy="16" r="1.5" fill="#FBBC05" />
                <circle cx="38" cy="6" r="2" fill="#34A853" />
                <circle cx="36" cy="10" r="1" fill="#4285F4" />
                <defs>
                  <linearGradient id="gradient1" x1="12" y1="8" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#EA4335" />
                    <stop offset="0.5" stopColor="#E91E63" />
                    <stop offset="1" stopColor="#4285F4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Title and Subtitle */}
            <h1 className="text-3xl font-bold text-black mb-2">Reset your password</h1>
            <p className="text-gray-600 mb-8">Enter the email linked to your account. We'll send you a secure link to reset your password.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-500 rounded-full px-4"
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-full"
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </Button>
            </form>

            {/* Terms and Privacy */}
            <p className="text-xs text-gray-500 mt-6">
              By continuing you agree to our{" "}
              <a href="#" className="text-blue-600 underline hover:text-blue-700">Terms</a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 underline hover:text-blue-700">Privacy Policy</a>.
            </p>

            {/* Back to Login */}
            <p className="text-sm text-gray-600 mt-4">
              Back to login?{" "}
              <button
                onClick={onBackToLogin}
                className="text-blue-600 underline hover:text-blue-700"
              >
                Sign In
              </button>
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
