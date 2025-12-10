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
  //console.log("Rendering MessageBubble for message:", message);
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
    <div className="mb-6 w-full group">
      {/* Center Chat Like Figma */}
      <div className="w-full flex justify-center">
        <div className="w-full max-w-[700px] px-6">
          <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 mb-2`}>
              <Avatar className="w-8 h-8">
                <AvatarFallback
                  className={
                    isUser
                      ? "bg-blue-500 text-white"
                      : "bg-purple-500 text-white"
                  }
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
            </div>

            {/* Bubble - Figma Width */}
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm break-words w-fit max-w-[100%] ${
                isUser
                  ? "bg-[#FFB3E6] text-gray-900 rounded-br-sm"
                  : "bg-[#bfdbff] text-black rounded-bl-sm"
              }`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
              ) : showLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span className="text-sm text-black">Thinking...</span>
                </div>
              ) : (
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
            </div>

            {/* Buttons */}
            {!isWelcomeMessage && (
              <div
                className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mt-2`}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 hover:bg-gray-500 text-white"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      Copy text
                    </TooltipContent>
                  </Tooltip>

                  {!isUser && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-gray-500 text-white"
                          onClick={() =>
                            downloadAsText(message.content, message.id)
                          }
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
        </div>
      </div>
    </div>
  );
};
