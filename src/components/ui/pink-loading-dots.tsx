import React from "react";
import { cn } from "@/lib/utils";

interface PinkLoadingDotsProps {
  className?: string;
}

export const PinkLoadingDots: React.FC<PinkLoadingDotsProps> = ({ className }) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div 
        className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
        style={{ animationDelay: "0ms", animationDuration: "1s" }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
        style={{ animationDelay: "150ms", animationDuration: "1s" }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
        style={{ animationDelay: "300ms", animationDuration: "1s" }}
      />
    </div>
  );
};
