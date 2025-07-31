import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, User, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types";
import { MarkdownRenderer } from "./MarkdownRenderer";

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
    <div className={`flex items-start space-x-3 mb-6 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={isUser ? "bg-blue-500 text-white" : "bg-purple-500 text-white"}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={`flex flex-col space-y-2 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        <div className={`px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-gray-800 text-white rounded-bl-sm"
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {message.content}
            </div>
          ) : (
            <div className="text-sm leading-relaxed">
              <MarkdownRenderer content={message.content} />
            </div>
          )}
        </div>
        
        {!isWelcomeMessage && (
          <div className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? "justify-end" : "justify-start"}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-gray-600 text-gray-300"
              onClick={() => copyToClipboard(message.content)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            {!isUser && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-gray-600 text-gray-300"
                onClick={() => downloadAsText(message.content, message.id)}
              >
                <Download className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
