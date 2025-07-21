import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@/context/UserContext";
import { ChatPanelProps, Message } from "@/types";
import { useMcpChat } from "@/hooks/useMcpChat";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { CHAT_CONFIG } from "@/utils/constants";

const ChatPanel = ({ userIdea }: ChatPanelProps) => {
  const { initialMcpResponse, clearInitialResponse } = useUser();
  
  // Initialize messages based on whether we have an initial MCP response
  const getInitialMessages = (): Message[] => {
    if (initialMcpResponse) {
      return [
        {
          id: "1",
          type: "user",
          content: initialMcpResponse.userMessage,
          timestamp: initialMcpResponse.timestamp,
        },
        {
          id: "2",
          type: "ai",
          content: initialMcpResponse.aiResponse,
          timestamp: new Date(initialMcpResponse.timestamp.getTime() + 1000),
        },
      ];
    }
    
    return [
      {
        id: "1",
        type: "ai",
        content: CHAT_CONFIG.DEFAULT_WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ];
  };

  const { messages, isLoading, messagesEndRef, sendMessage } = useMcpChat(getInitialMessages());

  // Clear the initial response from context when component mounts
  useEffect(() => {
    if (initialMcpResponse) {
      clearInitialResponse();
    }
  }, [initialMcpResponse, clearInitialResponse]);

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-xl overflow-hidden">
      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <div key={message.id} className="group animate-fade-in">
              <MessageBubble message={message} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center p-6">
              <div className="flex items-center gap-3 text-gray-400 bg-gray-800 px-4 py-2 rounded-full">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animate-delay-100"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse animate-delay-200"></div>
                </div>
                <span className="text-sm font-medium">AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 pt-0">
        <div className="max-w-2xl mx-auto">
          <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;