import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { EnhancedMarkdownRenderer } from "./EnhancedMarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
  isWelcomeMessage?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isWelcomeMessage = false,
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

  return (
    <div
      data-message-id={message.id}
      className={`group flex items-start space-x-3 ${
        isUser ? "flex-row-reverse space-x-reverse" : ""
      } mb-4`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {message.type === "ai" ? (
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Message bubble */}
      <div className={`max-w-[70%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? "bg-blue-300 text-black rounded-br-md"
              : "bg-[#D9D9D9] text-black rounded-bl-md backdrop-blur-sm"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap text-left">
              {message.content}
            </div>
          ) : (
            <div className="!text-black [&_*]:!text-black">
              <EnhancedMarkdownRenderer content={message.content} />
            </div>
          )}
        </div>

        {/* Copy and Download buttons - only show for non-welcome messages */}
        {!isWelcomeMessage && (
          <div
            className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 mt-2 ${
              isUser ? "justify-start" : "justify-end"
            }`}
          >
            {isUser ? (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                onClick={() => copyToClipboard(message.content)}
              >
                <Copy className="h-3 w-3 text-white" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                  onClick={() => copyToClipboard(message.content)}
                >
                  <Copy className="h-3 w-3 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                  onClick={() => downloadAsText(message.content, message.id)}
                >
                  <Download className="h-3 w-3 text-white" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
