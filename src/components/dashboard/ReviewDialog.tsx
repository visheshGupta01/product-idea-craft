import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { developerService } from "@/services/developerService";
import { useToast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  developerId: string;
  developerName: string;
  onReviewAdded: (review: any) => void; // ✅ NEW
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({
  isOpen,
  onClose,
  developerId,
  developerName,
  onReviewAdded,
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!reviewerName.trim() || !comment.trim() || rating === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide your name, rating, and comment",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await developerService.submitReview({
        developer_id: developerId,
        reviewer_name: reviewerName.trim(),
        rating,
        comment: comment.trim(),
      });
      // 👇 Construct review object (use backend response if available)
      const newReview = {
        reviewer_name: reviewerName.trim(),
        rating,
        comment: comment.trim(),
        created_at: new Date().toISOString(),
        ...res, // if backend returns id, etc.
      };

      onReviewAdded(newReview); // ✅ notify parent

      toast({
        title: "Review Submitted",
        description: "Thank you! Your review has been submitted.",
      });

      handleClose();
    } catch (error) {
      //console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setReviewerName("");
    setComment("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review {developerName}</DialogTitle>
          <DialogDescription>
            Share your experience working with this developer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reviewerName">Your Name *</Label>
            <Input
              id="reviewerName"
              placeholder="Enter your name"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoveredRating || rating) > i
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Your Review *</Label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about working with this developer..."
              className="min-h-32"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !reviewerName.trim() ||
              !comment.trim() ||
              rating === 0
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
