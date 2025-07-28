import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "@/types";
import { websocketService } from "@/services/websocketService";

export const useWebSocketChat = (initialMessages: Message[] = []) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingTools, setIsProcessingTools] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAiMessageId = useRef<string | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: Omit<Message, "id">) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${crypto.randomUUID()}`,
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

  // Initialize WebSocket connection
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        // Create session first
        await websocketService.createSession();
        
        // Setup message handlers
        websocketService.onMessage('ai_response', (data) => {
          if (!currentAiMessageId.current) {
            const aiMessage = addMessage({
              type: "ai",
              content: data.chunk || data.content || "",
              timestamp: new Date(),
            });
            currentAiMessageId.current = aiMessage.id;
            setIsLoading(false);
          } else {
            updateMessage(currentAiMessageId.current, data.chunk || data.content || "");
          }
          setTimeout(scrollToBottom, 50);
        });

        websocketService.onMessage('tool_start', () => {
          setIsProcessingTools(true);
        });

        websocketService.onMessage('tool_end', () => {
          setIsProcessingTools(false);
        });

        websocketService.onMessage('error', (data) => {
          if (!currentAiMessageId.current) {
            const aiMessage = addMessage({
              type: "ai",
              content: data.content || "I apologize, but I'm having trouble processing your request right now.",
              timestamp: new Date(),
            });
            currentAiMessageId.current = aiMessage.id;
          } else {
            updateMessage(currentAiMessageId.current, data.content || "Error occurred");
          }
          setIsLoading(false);
          setIsProcessingTools(false);
        });

        // Connect to WebSocket
        await websocketService.connect();
        setIsConnected(true);
        
      } catch (error) {
        console.error('Failed to initialize WebSocket connection:', error);
        setIsConnected(false);
      }
    };

    initializeConnection();

    // Cleanup on unmount
    return () => {
      websocketService.disconnect();
    };
  }, [addMessage, updateMessage, scrollToBottom]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading || !isConnected) return;

    // Add user message
    addMessage({
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    });

    setIsLoading(true);
    currentAiMessageId.current = null;

    try {
      websocketService.sendMessage(content.trim());
    } catch (error) {
      console.error("Error sending message:", error);
      
      const aiMessage = addMessage({
        type: "ai",
        content: "Connection error. Please try again.",
        timestamp: new Date(),
      });
      
      setIsLoading(false);
    }
  }, [isLoading, isConnected, addMessage]);

  return {
    messages,
    isLoading,
    isProcessingTools,
    isConnected,
    messagesEndRef,
    sendMessage,
    addMessage,
    updateMessage,
    scrollToBottom,
    setMessages,
  };
};