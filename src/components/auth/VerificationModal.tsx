import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle } from "lucide-react";

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] text-center">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Mail className="h-16 w-16 text-primary" />
              <CheckCircle className="h-6 w-6 text-green-500 absolute -top-1 -right-1 bg-background rounded-full" />
            </div>
          </div>
          <DialogTitle className="text-2xl text-center">Check Your Email</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            We've sent a verification link to:
          </p>
          <p className="font-semibold text-primary">{email}</p>
          <p className="text-sm text-muted-foreground">
            Please check your email and click the verification link to activate your account. 
            Don't forget to check your spam folder if you don't see it in your inbox.
          </p>
        </div>

        <div className="flex flex-col space-y-3 mt-6">
          <Button onClick={onClose} className="w-full">
            Got it, thanks!
          </Button>
          <p className="text-xs text-muted-foreground">
            You can close this window and return to complete the verification process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};