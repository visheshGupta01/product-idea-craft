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
    addMessage({
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
      let fullContent = "";
      let displayContent = "";
      let isStreaming = true;
      
      // Smooth typewriter effect
      const typewriterEffect = () => {
        if (displayContent.length < fullContent.length && isStreaming) {
          displayContent = fullContent.slice(0, displayContent.length + 1);
          updateMessage(aiMessage.id, displayContent);
          setTimeout(scrollToBottom, 10);
          setTimeout(typewriterEffect, 15); // Adjust speed here (lower = faster)
        }
      };
      
      await mcpService.sendMessageStream(
        content.trim(),
        // onChunk: accumulate content and trigger typewriter effect
        (chunk: string) => {
          fullContent += chunk;
          if (displayContent.length === fullContent.length - chunk.length) {
            typewriterEffect();
          }
        },
        // onComplete: ensure all content is displayed
        (fullResponse: string) => {
          isStreaming = false;
          fullContent = fullResponse;
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
  }, [isLoading, addMessage, updateMessage, scrollToBottom]);

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