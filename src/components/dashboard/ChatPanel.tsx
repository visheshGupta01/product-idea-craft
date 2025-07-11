import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface ChatPanelProps {
  userIdea: string;
  mcpServerUrl?: string; // URL of your MCP server
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

const ChatPanel = ({
  userIdea,
  mcpServerUrl = "http://localhost:3000/api/chat",
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Great idea! I've analyzed your concept: "${userIdea}". Let's start by conducting a competitive analysis. What similar products or services have you seen in the market?`,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(mcpServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: currentMessage,
          context: userIdea, // Include the user's original idea as context
          // Add any other fields your MCP server expects
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Adjust this based on your MCP server's response structure
      const aiContent =
        data.response ||
        data.message ||
        data.content ||
        "Sorry, I received an unexpected response format.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to MCP server:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">{/* Changed from h-screen to h-full to work with navbar */}
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border bg-sidebar-background">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-sidebar-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-sidebar-foreground">AI Assistant</h3>
            <p className="text-xs text-sidebar-foreground/60">
              Guiding your build process
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-sidebar-accent text-sidebar-foreground"
                }`}
              >
                <p>{message.content}</p>
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.type === "user" && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-secondary">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex space-x-3 justify-start">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-sidebar-accent p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-sidebar-foreground" />
                  <span className="text-sm text-sidebar-foreground/60">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-background">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about your project..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            className="flex-1 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded-2xl"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="sm"
            disabled={!newMessage.trim() || isLoading}
            className="px-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
