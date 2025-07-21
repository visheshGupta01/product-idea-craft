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

      <div className={`flex-1 space-y-3 ${isUser ? "text-right" : ""}`}>
        <div className={`flex items-center gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
          <span className="text-sm font-semibold text-chat-foreground">
            {isUser ? "You" : "AI Assistant"}
          </span>
          <span className="text-xs text-muted-foreground opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div
          className={`rounded-2xl p-4 max-w-none shadow-sm border ${
            isUser
              ? "bg-primary text-primary-foreground ml-8 border-primary/20"
              : "bg-background text-foreground mr-8 border-border"
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

        {!isUser && (
          <div className={`flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ${isUser ? "justify-end" : "justify-start"}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-7 px-3 text-xs hover:bg-chat-accent-bg border border-border/50"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadAsText(message.content)}
              className="h-7 px-3 text-xs hover:bg-chat-accent-bg border border-border/50"
            >
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};