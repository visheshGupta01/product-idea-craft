import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const downloadAsText = (text: string, filename: string = "message.txt") => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded!",
      description: `Message saved as ${filename}`,
    });
  };

  const isUser = message.type === "user";

  return (
    <div className={`flex gap-4 p-4 hover:bg-chat-accent-bg/50 transition-colors ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-9 h-9 flex-shrink-0 shadow-sm">
        <AvatarFallback className={isUser ? "bg-primary text-primary-foreground shadow-md" : "bg-accent text-accent-foreground shadow-md"}>
          {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div className="mb-2">
          <span className="text-sm font-semibold text-chat-foreground">
            {isUser ? "You" : "AI Assistant"}
          </span>
        </div>

        <div className="relative group">
          <div
            className={`rounded-2xl p-4 shadow-sm border inline-block max-w-md ${
              isUser
                ? "bg-primary text-primary-foreground border-primary/20"
                : "bg-background text-foreground border-border"
            }`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
          </div>

          {/* Action buttons */}
          {isUser ? (
            <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-6 w-6 p-0 hover:bg-chat-accent-bg border border-border/50 rounded-full"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(message.content)}
                className="h-6 w-6 p-0 hover:bg-chat-accent-bg border border-border/50 rounded-full"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => downloadAsText(message.content)}
                className="h-6 w-6 p-0 hover:bg-chat-accent-bg border border-border/50 rounded-full"
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};