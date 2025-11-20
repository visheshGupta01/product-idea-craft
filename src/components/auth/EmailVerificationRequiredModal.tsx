import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/config/api";

interface EmailVerificationRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const EmailVerificationRequiredModal: React.FC<
  EmailVerificationRequiredModalProps
> = ({ isOpen, onClose, email }) => {
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
        { email }
      );

      if (response.data.success) {
        toast({
          title: "Verification Email Sent",
          description: "Please check your inbox for the verification link.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Send",
          description: response.data.message || "Please try again later.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to resend verification email",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <Mail className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Email Verification Required</DialogTitle>
          <DialogDescription className="text-center">
            Your email is not verified. Please verify your email to create new sessions
            and access all features.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground text-center">
            We sent a verification link to:
            <br />
            <strong className="text-foreground">{email}</strong>
          </div>
          <Button
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Link
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
