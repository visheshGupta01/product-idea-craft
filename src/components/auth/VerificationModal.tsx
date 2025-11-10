import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/config/api";
import apiClient from "@/lib/apiClient";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      await apiClient.post(`${API_BASE_URL}/api/auth/resent-verification-link`, { email });
      toast({
        title: "Success",
        description: "Verification link sent! Please check your email.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to resend verification link.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto custom-scroll p-4 sm:p-6 text-center">
        <DialogHeader>
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="relative">
              <Mail className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 absolute -top-1 -right-1 bg-background rounded-full" />
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl text-center">Check Your Email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 sm:space-y-4">
          <p className="text-muted-foreground">
            We've sent a verification link to:
          </p>
          <p className="font-semibold text-primary">{email}</p>
          <p className="text-sm text-muted-foreground">
            Please check your email and click the verification link to activate your account. 
            Don't forget to check your spam folder if you don't see it in your inbox.
          </p>
        </div>

        <div className="flex flex-col space-y-2 sm:space-y-3 mt-4 sm:mt-6">
          <Button onClick={onClose} className="w-full">
            Got it, thanks!
          </Button>
          <Button 
            onClick={handleResendVerification} 
            variant="outline" 
            className="w-full"
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Resending...
              </>
            ) : (
              "Resend Verification Link"
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            You can close this window and return to complete the verification process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};