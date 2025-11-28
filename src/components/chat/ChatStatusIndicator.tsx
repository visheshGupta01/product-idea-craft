import React from "react";
import { PinkLoadingDots } from "@/components/ui/pink-loading-dots";
import { ChatStatus } from "@/types/websocketEvents";
import { Brain, Code, Wrench, Eye, AlertCircle, Sparkles } from "lucide-react";

interface ChatStatusIndicatorProps {
  status: ChatStatus;
  message?: string;
}

const statusConfig: Record<ChatStatus, { icon: React.ReactNode; defaultMessage: string; bgClass: string }> = {
  idle: {
    icon: null,
    defaultMessage: "",
    bgClass: "",
  },
  thinking: {
    icon: <Brain className="w-4 h-4 text-pink-400" />,
    defaultMessage: "Thinking...",
    bgClass: "border-pink-500/20 bg-pink-500/5",
  },
  generating: {
    icon: <Code className="w-4 h-4 text-blue-400" />,
    defaultMessage: "Generating frontend...",
    bgClass: "border-blue-500/20 bg-blue-500/5",
  },
  streaming: {
    icon: <Sparkles className="w-4 h-4 text-pink-400" />,
    defaultMessage: "AI is responding...",
    bgClass: "border-pink-500/20 bg-muted/50",
  },
  tool_running: {
    icon: <Wrench className="w-4 h-4 text-yellow-400" />,
    defaultMessage: "Running tools...",
    bgClass: "border-yellow-500/20 bg-yellow-500/5",
  },
  preview_generating: {
    icon: <Eye className="w-4 h-4 text-purple-400" />,
    defaultMessage: "Generating preview...",
    bgClass: "border-purple-500/20 bg-purple-500/5",
  },
  error: {
    icon: <AlertCircle className="w-4 h-4 text-red-400" />,
    defaultMessage: "An error occurred",
    bgClass: "border-red-500/20 bg-red-500/5",
  },
};

export const ChatStatusIndicator: React.FC<ChatStatusIndicatorProps> = ({
  status,
  message,
}) => {
  if (status === "idle") return null;

  const config = statusConfig[status];
  const displayMessage = message || config.defaultMessage;

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
        <span className="text-sm">🤖</span>
      </div>
      <div className={`flex items-center gap-2 rounded-lg px-4 py-2 border ${config.bgClass}`}>
        {config.icon}
        <PinkLoadingDots />
        <span className="text-sm text-muted-foreground">
          {displayMessage}
        </span>
      </div>
    </div>
  );
};
