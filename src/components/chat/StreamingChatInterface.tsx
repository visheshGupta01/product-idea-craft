import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Bot } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useUser } from "@/context/UserContext";

interface StreamingChatInterfaceProps {
  userIdea?: string;
  onFrontendGenerated?: (url: string) => void;
  urlSessionId?: string;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({ userIdea, onFrontendGenerated, urlSessionId }) => {
  const { sessionId: contextSessionId, initialResponse, clearInitialResponse } = useUser();
  const activeSessionId = urlSessionId || contextSessionId;
  const {
    messages,
    isLoadingMessages,
    isStreaming,
    isProcessingTools,
    messagesEndRef,
    sendMessage,
    addMessage,
    scrollToBottom,
    connect
  } = useStreamingChat(activeSessionId || "", onFrontendGenerated);

  const [isInitialized, setIsInitialized] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize connection when sessionId is available
  useEffect(() => {
    if (activeSessionId) {
      connect().then(success => {
        if (success) {
          console.log("✅ WebSocket connected successfully");
        } else {
          console.error("❌ Failed to connect WebSocket");
        }
      });
    }
  }, [activeSessionId, connect]);

  // Add welcome message only for new sessions (with delay to allow message restoration)
  useEffect(() => {
    if (activeSessionId && !isInitialized && !isLoadingMessages) {
      // Clear any existing timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Wait a bit for useChatPersistence to restore messages
      initTimeoutRef.current = setTimeout(() => {
        if (messages.length === 0) {
          addMessage({
            type: "ai",
            content: "Hello! I'm here to help you build your idea. What would you like to create today?",
            timestamp: new Date(),
          });
        }
        setIsInitialized(true);
      }, 200); // Increased delay to ensure message restoration is complete
    }
    
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [activeSessionId, messages.length, addMessage, isInitialized, isLoadingMessages]);

  // Handle initial response from user context and send message
  useEffect(() => {
    if (initialResponse && activeSessionId && !isLoadingMessages && isInitialized) {
      // Add the user message first
      addMessage({
        type: "user",
        content: initialResponse.userMessage,
        timestamp: new Date(),
      });
      
      // Then send to get AI response
      sendMessage(initialResponse.userMessage);

      // Clear from context
      clearInitialResponse();
    }
  }, [initialResponse, activeSessionId, isLoadingMessages, isInitialized, addMessage, sendMessage, clearInitialResponse]);

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
    <div className="flex flex-col h-full bg-[#1E1E1E]">
      {isLoadingMessages ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
            <p className="text-white/70">Loading chat history...</p>
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-5xl mx-auto">
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
                  <div className="bg-[#D9D9D9] rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin text-black" />
                      {showToolsIndicator ? (
                        <span className="text-sm text-black">Running Tools...</span>
                      ) : (
                        <span className="text-sm text-black">
                          AI is thinking
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="bg-[#1E1E1E]">
            <div className="max-w-4xl mx-auto">
              <ChatInput onSendMessage={sendMessage} isLoading={isStreaming} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};