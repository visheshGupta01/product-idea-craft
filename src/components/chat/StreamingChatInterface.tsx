import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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

  // Handle initial response from user context and send message
  useEffect(() => {
    if (initialResponse && sessionId) {
      // Add user message
      addMessage({
        type: "user",
        content: initialResponse.userMessage,
        timestamp: initialResponse.timestamp,
      });

      // Send the message to get AI response
      sendMessage(initialResponse.userMessage);

      // Clear from context
      clearInitialResponse();
    }
  }, [initialResponse, sessionId, addMessage, sendMessage, clearInitialResponse]);

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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div key={message.id} className="group">
              <MessageBubble
                message={message}
                isWelcomeMessage={index === 0 && message.type === "ai"}
              />
            </div>
          ))}

          {/* Streaming indicator */}
          {showLoadingIndicator && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-purple-500 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                  {showToolsIndicator ? (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Running Tools...
                    </span>
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      AI is thinking...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isStreaming} />
        </div>
      </div>
    </div>
  );
};