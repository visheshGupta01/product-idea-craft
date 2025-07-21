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
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className="relative group max-w-md">
        <div
          className={`rounded-3xl px-6 py-4 shadow-sm ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-900"
          }`}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.content}
            </p>
          ) : (
            <div className="text-sm leading-relaxed">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>

        {/* Action buttons */}
        {isUser ? (
          <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-6 w-6 p-0 hover:bg-gray-700 bg-gray-800 rounded-full"
            >
              <Copy className="w-3 h-3 text-white" />
            </Button>
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-6 w-6 p-0 hover:bg-gray-700 bg-gray-800 rounded-full"
            >
              <Copy className="w-3 h-3 text-white" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadAsText(message.content)}
              className="h-6 w-6 p-0 hover:bg-gray-700 bg-gray-800 rounded-full"
            >
              <Download className="w-3 h-3 text-white" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};