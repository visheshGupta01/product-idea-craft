import { useState, useRef, useCallback } from "react";
import { Message } from "@/types";
import { mcpService } from "@/services/mcpService";

export const useMcpChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
    };
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
    return newMessage;
  }, [scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Add user message
    addMessage({
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      const aiResponse = await mcpService.sendMessage(content.trim());
      
      // Add AI response
      addMessage({
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error in chat:", error);
      addMessage({
        type: "ai",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage]);

  return {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    addMessage,
    scrollToBottom,
  };
};