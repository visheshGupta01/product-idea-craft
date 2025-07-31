import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "@/types";
import { StreamingWebSocketClient, StreamingCallbacks } from "@/services/streamingWebSocket";

export interface StreamingChatState {
  messages: Message[];
  isStreaming: boolean;
  isProcessingTools: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export interface StreamingChatActions {
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id">) => Message;
  updateMessage: (messageId: string, content: string) => void;
  clearMessages: () => void;
  scrollToBottom: () => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

export const useStreamingChat = (sessionId: string): StreamingChatState & StreamingChatActions => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessingTools, setIsProcessingTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<StreamingWebSocketClient | null>(null);

  // Initialize WebSocket client
  useEffect(() => {
    if (sessionId && !wsClientRef.current) {
      wsClientRef.current = new StreamingWebSocketClient(sessionId);
    }
  }, [sessionId]);

  const generateId = useCallback(() => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback((message: Omit<Message, "id">): Message => {
    const newMessage: Message = {
      ...message,
      id: generateId(),
    };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, [generateId]);

  const updateMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content } : msg
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!wsClientRef.current) {
      console.error("WebSocket client not initialized");
      return false;
    }

    try {
      if (!wsClientRef.current.isConnected()) {
        await wsClientRef.current.connect();
      }
      return true;
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
    }
  }, []);

  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || !wsClientRef.current) return;

    // Add user message
    const userMessage = addMessage({
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    });

    // Set streaming state
    setIsStreaming(true);

    try {
      // Ensure connection
      const isConnected = await connect();
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

      const callbacks: StreamingCallbacks = {
        onContent: (text: string) => {
          streamingContent += text;
          updateMessage(aiMessage.id, streamingContent);
        },
        onToolStart: () => {
          console.log("🔧 Tool processing started in hook");
          setIsProcessingTools(true);
        },
        onToolEnd: () => {
          console.log("✅ Tool processing ended in hook");
          setIsProcessingTools(false);
        },
        onComplete: (fullContent: string) => {
          console.log("🎉 Stream completion in hook - clearing all states");
          
          // Use the accumulated streaming content if it's longer than fullContent
          const finalContent = streamingContent.length > fullContent.length ? streamingContent : fullContent;
          updateMessage(aiMessage.id, finalContent);
          
          // Always clear both states on completion
          setIsStreaming(false);
          setIsProcessingTools(false);
          
          console.log("✅ All states cleared - content length:", finalContent.length);
        },
        onError: (error: Error) => {
          console.error("❌ Streaming error in hook:", error);
          
          updateMessage(aiMessage.id, 
            `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${error.message}`
          );
          
          // Always clear both states on error
          setIsStreaming(false);
          setIsProcessingTools(false);
          
          console.log("🧹 States cleared after error");
        }
      };

      await wsClientRef.current.sendStreamingMessage(content, callbacks);

    } catch (error) {
      console.error("Error in sendMessage:", error);
      
      // Add error message
      addMessage({
        type: "ai",
        content: `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
      });

      // Clear loading states
      setIsStreaming(false);
      setIsProcessingTools(false);
    }
  }, [addMessage, updateMessage, connect]);

  return {
    messages,
    isStreaming,
    isProcessingTools,
    messagesEndRef,
    sendMessage,
    addMessage,
    updateMessage,
    clearMessages,
    scrollToBottom,
    connect,
    disconnect,
  };
};