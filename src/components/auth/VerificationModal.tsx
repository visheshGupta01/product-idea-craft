import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { API_ENDPOINTS } from "@/config/api";
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
  const [resendSuccess, setResendSuccess] = useState(false);
    const [timer, setTimer] = useState(0); // Timer in seconds

  useEffect(() => {
    let interval: number | undefined;

    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);


  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.RESEND_VERIFICATION, { email });
      setResendSuccess(true);
      toast({
        title: "Success",
        description: "Verification link sent! Please check your email.",
      });
      setTimer(60);
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
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-yellow-500" />
          </div>
          <DialogTitle className="text-2xl text-center">
            Email Not Verified
          </DialogTitle>
          <DialogDescription className="text-center">
            Your email address has not been verified. Please verify your email to create new sessions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Check your inbox for a verification link or click the button below to resend it.
          </p>

          {resendSuccess && (
            <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Verification email sent successfully!</span>
            </div>
          )}

          {timer > 0 && (
            <div className="text-sm text-muted-foreground">
              You can resend in {timer} second{timer > 1 ? "s" : ""}
            </div>
          )}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={handleResendVerification}
              disabled={isResending || timer > 0}
              className="w-full"
            >
              {isResending ? (
                <>
                  <Mail className="mr-2 h-4 w-4 animate-pulse" />
                  Sending...
                </>
              ) : timer > 0 ? (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Wait {timer}s
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend Verification Email
                </>
              )}
            </Button>

            <Button onClick={onClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};