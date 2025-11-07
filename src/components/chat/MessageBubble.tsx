import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MessageBubbleProps {
  message: Message;
  isWelcomeMessage?: boolean;
  isStreaming?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isWelcomeMessage = false,
  isStreaming = false,
}) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = (text: string, messageId: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${messageId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Message has been downloaded as a text file.",
    });
  };

  const isUser = message.type === "user";
  const showLoading = !isUser && isStreaming && message.content.trim() === "";

  return (
    <div className="mb-6 group px-2 sm:px-4">
      {/* Row 1: Avatar + Bubble */}
      <div
        className={`flex items-end ${
          isUser ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {/* Avatar */}
        <Avatar className="w-4 h-4 sm:w-7 sm:h-7 sm:w-8 sm:h-8 flex-shrink-0">
          <AvatarFallback
            className={`text-white ${
              isUser ? "bg-blue-500" : "bg-purple-500"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4" />
            ) : showLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <Bot className="w-4 h-4" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Message Bubble */}
        <div
          className={`ml-2 sm:ml-3 px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm overflow-hidden break-words 
          max-w-[85%] sm:max-w-[75%] min-w-0 ${
            isUser
              ? "bg-blue-300 text-black rounded-br-sm mr-1 sm:mr-2"
              : "bg-[#D9D9D9] text-black rounded-bl-sm"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
              {message.content}
            </div>
          ) : showLoading ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm sm:text-base text-black">
                Thinking...
              </span>
            </div>
          ) : (
            <div className="text-sm sm:text-base leading-relaxed">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Buttons (Copy / Download) */}
      {!isWelcomeMessage && (
        <div
          className={`flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mt-1 
          ml-9 sm:ml-11 ${
            isUser ? "justify-end mr-9 sm:mr-11 ml-0" : "justify-start"
          }`}
        >
          <TooltipProvider delayDuration={150}>
            {/* Copy Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0 bg-gray-200 hover:bg-gray-400 text-black"
                  onClick={() => copyToClipboard(message.content)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                Copy text
              </TooltipContent>
            </Tooltip>

            {/* Download Button (only for bot) */}
            {!isUser && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 p-0 bg-gray-200 hover:bg-gray-400 text-black"
                    onClick={() => downloadAsText(message.content, message.id)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Download as text
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
