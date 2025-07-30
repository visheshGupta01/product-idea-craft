import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Bot } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useUser } from "@/context/UserContext";

interface StreamingChatInterfaceProps {
  userIdea?: string;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({ userIdea }) => {
  const { sessionId, initialResponse, clearInitialResponse } = useUser();
  const {
    messages,
    isStreaming,
    isProcessingTools,
    messagesEndRef,
    sendMessage,
    addMessage,
    scrollToBottom,
    connect
  } = useStreamingChat(sessionId || "");

  // Initialize connection when sessionId is available
  useEffect(() => {
    if (sessionId) {
      connect().then(success => {
        if (success) {
          console.log("✅ WebSocket connected successfully");
        } else {
          console.error("❌ Failed to connect WebSocket");
        }
      });
    }
  }, [sessionId, connect]);

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        type: "ai",
        content: "Hello! I'm here to help you build your idea. What would you like to create today?",
        timestamp: new Date(),
      });
    }
  }, [messages.length, addMessage]);

  // Handle initial response from user context
  useEffect(() => {
    if (initialResponse) {
      // Add user message
      addMessage({
        type: "user",
        content: initialResponse.userMessage,
        timestamp: initialResponse.timestamp,
      });

      // Clear from context
      clearInitialResponse();
    }
  }, [initialResponse, addMessage, clearInitialResponse]);

  // Auto-scroll on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isStreaming, scrollToBottom]);

  const showLoadingIndicator = isStreaming && messages.length > 0;
  const showToolsIndicator = isProcessingTools;

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isWelcomeMessage={index === 0 && message.type === "ai"}
            />
          ))}

          {/* Streaming indicator */}
          {showLoadingIndicator && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is responding...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tools processing indicator */}
          {showToolsIndicator && (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Bot className="h-6 w-6" />
                <div className="bg-secondary rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Running tools...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isStreaming} />
        </div>
      </div>
    </div>
  );
};