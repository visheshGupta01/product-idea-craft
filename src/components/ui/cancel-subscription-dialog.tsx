import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CancelSubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  planName: string;
  onConfirm: (userId: string) => Promise<void>;
}

const CancelSubscriptionDialog: React.FC<CancelSubscriptionDialogProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  planName,
  onConfirm
}) => {
  const [confirmUserId, setConfirmUserId] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (confirmUserId !== userId) {
      toast({
        title: "User ID Mismatch",
        description: "Please enter the correct User ID to confirm cancellation",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(userId);
      setShowSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmUserId('');
    setIsConfirmed(false);
    setShowSuccess(false);
    setIsLoading(false);
    onClose();
  };

  const handleUserIdChange = (value: string) => {
    setConfirmUserId(value);
    setIsConfirmed(value === userId);
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8 space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-50 p-3 rounded-full">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Subscription Cancelled</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Subscription for {userName} ({planName}) has been cancelled successfully.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Subscription
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Full Name:</span>
              <span className="font-medium">{userName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plan:</span>
              <span className="font-medium">{planName}</span>
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <div className="text-sm font-medium text-muted-foreground mb-1">User ID:</div>
            <div className="font-mono text-sm bg-background p-2 rounded border">
              {userId}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmUserId">
              To confirm cancellation, copy and paste the User ID below:
            </Label>
            <Input
              id="confirmUserId"
              placeholder="20a53bad-b54d-4541-9f15-ec7ed84ce77d"
              value={confirmUserId}
              onChange={(e) => handleUserIdChange(e.target.value)}
              className={isConfirmed ? "border-green-500" : ""}
            />
            {isConfirmed && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                User ID confirmed
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={!isConfirmed || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;