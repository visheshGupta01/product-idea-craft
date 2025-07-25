import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { ChatPanelProps, Message } from "@/types";
import { useMcpChat } from "@/hooks/useMcpChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { CHAT_CONFIG } from "@/utils/constants";

const ChatPanel = ({ userIdea }: ChatPanelProps) => {
  const { initialMcpResponse, clearInitialResponse, isProcessingIdea } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with default messages first
  const { messages, isLoading, sendMessage, setMessages } = useMcpChat([
    {
      id: "1",
      type: "ai",
      content: CHAT_CONFIG.DEFAULT_WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ]);

  // Update messages when initialMcpResponse becomes available
  useEffect(() => {
    if (initialMcpResponse && initialMcpResponse.userMessage) {
      console.log("ChatPanel - Processing initialMcpResponse:", initialMcpResponse);
      
      setMessages(prevMessages => {
        // Keep the welcome message and add the new ones
        const welcomeMessage = prevMessages.find(msg => msg.id === "1");
        const newMessages: Message[] = welcomeMessage ? [welcomeMessage] : [];
        
        // Add user message
        newMessages.push({
          id: `initial-user-${Date.now()}`,
          type: "user",
          content: initialMcpResponse.userMessage,
          timestamp: initialMcpResponse.timestamp,
        });
        
        // Only add AI message if there's content
        if (initialMcpResponse.aiResponse) {
          newMessages.push({
            id: `initial-ai-${Date.now()}`,
            type: "ai",
            content: initialMcpResponse.aiResponse,
            timestamp: new Date(initialMcpResponse.timestamp.getTime() + 1000),
          });
        }
        
        return newMessages;
      });
    }
  }, [initialMcpResponse, setMessages]);

  // Debug logging
  console.log("ChatPanel - messages:", messages);
  console.log("ChatPanel - initialMcpResponse:", initialMcpResponse);

  // Clear the initial response from context after messages are processed
  useEffect(() => {
    if (initialMcpResponse && messages.length > 1) {
      // Only clear after we've successfully processed the initial response
      const timer = setTimeout(() => {
        console.log("ChatPanel - Clearing initialMcpResponse");
        clearInitialResponse();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [initialMcpResponse, clearInitialResponse, messages.length]);

  const scrollToTopOfNewMessage = () => {
    const messageElements = document.querySelectorAll("[data-message-id]");
    if (messageElements.length > 0) {
      const lastMessage = messageElements[messageElements.length - 1];
      lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToTopOfNewMessage();
    }
  }, [messages, isLoading]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Messages */}
      <ScrollArea
        className="flex-1 pt-4 pl-4 pr-4"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="w-full">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isWelcomeMessage={message.id === "1" && !initialMcpResponse}
            />
          ))}

          {/* Enhanced loading indicator - show when either loading or processing idea */}
          {(isLoading || isProcessingIdea) && (
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md border border-white/10">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-white/90 font-medium">
                    {isProcessingIdea ? "AI is analyzing and using tools..." : "AI is responding..."}
                  </span>
                </div>
                {isProcessingIdea && (
                  <div className="mt-2 text-xs text-white/60">
                    This may take a moment while I process your request
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;
