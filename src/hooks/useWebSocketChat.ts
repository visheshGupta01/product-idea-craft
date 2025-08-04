import { useState, useRef, useCallback } from "react";
import { Message } from "@/types";
import { WebSocketService } from "@/services/websocketService";
import { useChatPersistence } from "./useChatPersistence";

export const useWebSocketChat = (sessionId: string) => {
  const { 
    messages, 
    addMessage: persistentAddMessage, 
    updateMessage: persistentUpdateMessage,
    setMessages 
  } = useChatPersistence(sessionId);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingTools, setIsProcessingTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsServiceRef = useRef<WebSocketService | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = persistentAddMessage;
  const updateMessage = persistentUpdateMessage;

  const initializeWebSocket = async (): Promise<boolean> => {
    if (!wsServiceRef.current) {
      wsServiceRef.current = new WebSocketService(sessionId);
    }

    try {
      if (!wsServiceRef.current.isConnected()) {
        await wsServiceRef.current.connect();
      }
      return true;
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      return false;
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!content.trim()) return;

    // Add user message immediately
    addMessage({
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      // Initialize WebSocket connection if needed
      const isConnected = await initializeWebSocket();
      if (!isConnected) {
        throw new Error("Failed to establish WebSocket connection");
      }

      // Create AI message placeholder
      const aiMessage = addMessage({
        type: "ai",
        content: "",
        timestamp: new Date(),
      });

      let streamingContent = "";

      await wsServiceRef.current!.sendMessageStream(
        content,
        // onChunk: update AI message as chunks arrive
        (chunk: string) => {
          streamingContent += chunk;
          updateMessage(aiMessage.id, streamingContent);
        },
        // onComplete: final processing
        (fullResponse: string) => {
          updateMessage(aiMessage.id, fullResponse);
          setIsLoading(false);
          setIsProcessingTools(false);
          console.log("WebSocket stream completed, clearing all loading states");
        },
        // onToolStart: tool processing started
        () => {
          setIsProcessingTools(true);
          console.log("Tool processing started");
        },
        // onToolEnd: tool processing finished
        () => {
          setIsProcessingTools(false);
          console.log("Tool processing ended");
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      addMessage({
        type: "ai",
        content: `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });
      
      // Ensure all loading states are cleared on error
      setIsLoading(false);
      setIsProcessingTools(false);
      console.log("Error occurred, clearing all loading states");
    }
  };

  const disconnect = () => {
    if (wsServiceRef.current) {
      wsServiceRef.current.disconnect();
      wsServiceRef.current = null;
    }
  };

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
    initializeWebSocket,
    disconnect,
  };
};