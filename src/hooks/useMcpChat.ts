import { useState, useRef, useCallback } from "react";
import { Message } from "@/types";
import { mcpService } from "@/services/mcpService";

export const useMcpChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log("useMcpChat - Current messages:", messages);
  console.log("useMcpChat - Initial messages:", initialMessages);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${messageIdCounter}-${Date.now()}`, // More unique ID
    };
    setMessageIdCounter(prev => prev + 1);
    setMessages(prev => [...prev, newMessage]);
    setTimeout(scrollToBottom, 100);
    return newMessage;
  }, [scrollToBottom, messageIdCounter]);

  const updateMessage = useCallback((messageId: string, content: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, content } : msg
      )
    );
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    console.log("Sending message:", content.trim());
    
    // Add user message
    const userMessage = addMessage({
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    });

    console.log("Chat History:", messages);

    setIsLoading(true);

    // Create placeholder AI message for streaming
    const aiMessage = addMessage({
      type: "ai",
      content: "",
      timestamp: new Date(),
    });

    try {
      let streamingContent = "";
      
      await mcpService.sendMessageStream(
        content.trim(),
        // onChunk: update message content as chunks arrive
        (chunk: string) => {
          streamingContent += chunk;
          updateMessage(aiMessage.id, streamingContent);
          setTimeout(scrollToBottom, 50);
        },
        // onComplete: final processing if needed
        (fullResponse: string) => {
          updateMessage(aiMessage.id, fullResponse);
          setTimeout(scrollToBottom, 100);
        }
      );
    } catch (error) {
      console.error("Error in chat:", error);
      updateMessage(aiMessage.id, "I apologize, but I'm having trouble processing your request right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, updateMessage, scrollToBottom, messages]);

  return {
    messages,
    isLoading,
    messagesEndRef,
    sendMessage,
    addMessage,
    updateMessage,
    scrollToBottom,
  };
};