import { useState, useRef, useCallback } from "react";
import { Message } from "@/types";
import { mcpService } from "@/services/mcpService";

export const useMcpChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    console.log("useMcpChat - Initializing with messages:", initialMessages);
    return initialMessages;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingTools, setIsProcessingTools] = useState(false);
  const [messageIdCounter, setMessageIdCounter] = useState(() => {
    // Start counter after initial messages
    return initialMessages.length > 0 ? initialMessages.length + 1 : 1;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log("useMcpChat - Current messages:", messages);
  console.log("useMcpChat - Initial messages:", initialMessages);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

 const addMessage = useCallback((message: Omit<Message, "id">) => {
  // Log the message being added to track undefined content
  console.log("useMcpChat - Adding message:", message);
  
  if (!message.content) {
    console.error("useMcpChat - Warning: Adding message with undefined/empty content:", message);
  }
  
  const newMessage: Message = {
    ...message,
    id: `msg-${crypto.randomUUID()}`, // Unique ID every time
  };
  setMessages(prev => [...prev, newMessage]);
  setTimeout(scrollToBottom, 100);
  return newMessage;
}, [scrollToBottom]);


  const updateMessage = useCallback((messageId: string, content: string) => {
    console.log("useMcpChat - Updating message:", messageId, "with content:", content);
    
    if (content === undefined || content === null) {
      console.error("useMcpChat - Warning: Updating message with undefined/null content:", messageId, content);
    }
    
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

    // Don't create AI message yet - let loading indicator show first
    let aiMessage: Message | null = null;

    try {
      let streamingContent = "";
      
      await mcpService.sendMessageStream(
        content.trim(),
        // onChunk: create AI message on first chunk and update content
        (chunk: string) => {
          // Create AI message on first chunk
          if (!aiMessage) {
            aiMessage = addMessage({
              type: "ai",
              content: "",
              timestamp: new Date(),
            });
            setIsLoading(false); // Hide loading indicator when message starts
          }
          
          streamingContent += chunk;
          updateMessage(aiMessage.id, streamingContent);
          setTimeout(scrollToBottom, 50);
        },
        // onComplete: final processing if needed
        (fullResponse: string) => {
          if (aiMessage) {
            updateMessage(aiMessage.id, fullResponse);
            setTimeout(scrollToBottom, 100);
          }
          setIsProcessingTools(false); // Clear tool processing state
        },
        // onToolStart: show tool processing indicator
        () => {
          setIsProcessingTools(true);
        },
        // onToolEnd: hide tool processing indicator
        () => {
          setIsProcessingTools(false);
        }
      );
    } catch (error) {
      console.error("Error in chat:", error);
      
      // Create AI message for error if it doesn't exist
      if (!aiMessage) {
        aiMessage = addMessage({
          type: "ai",
          content: "",
          timestamp: new Date(),
        });
      }
      
      updateMessage(aiMessage.id, "I apologize, but I'm having trouble processing your request right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, updateMessage, scrollToBottom, messages]);

  return {
    messages,
    isLoading,
    isProcessingTools,
    messagesEndRef,
    sendMessage,
    addMessage,
    updateMessage,
    scrollToBottom,
    setMessages,
  };
};