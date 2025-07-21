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
    <div className="flex flex-col h-full bg-background border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">AI Assistant</h2>
        <div className="text-sm text-muted-foreground">
          {userIdea ? `Project: ${userIdea.substring(0, 30)}...` : "New Chat"}
        </div>
      </div>

      <ScrollArea className="flex-1 p-0">
        <div className="space-y-1">
          {messages.map((message) => (
            <div key={message.id} className="group">
              <MessageBubble message={message} />
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-center items-center p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatPanel;