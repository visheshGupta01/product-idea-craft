import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "@/types";
import {
  StreamingWebSocketClient,
  StreamingCallbacks,
} from "@/services/streamingWebSocket";
import { useChatPersistence } from "./useChatPersistence";

export interface StreamingChatState {
  messages: Message[];
  isLoadingMessages: boolean;
  isStreaming: boolean;
  isProcessingTools: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  projectUrl: string;
  sitemap: any;
  title: string;
}

export interface StreamingChatActions {
  sendMessage: (content: string) => Promise<void>;
  addMessage: (message: Omit<Message, "id">) => Message;
  updateMessage: (messageId: string, content: string) => void;
  clearMessages: () => void;
  scrollToBottom: () => void;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  onFrontendGenerated?: (url: string) => void;
}

export const useStreamingChat = (
  sessionId: string,
  onFrontendGenerated?: (url: string) => void
): StreamingChatState & StreamingChatActions => {
  const {
    messages,
    isLoadingMessages,
    addMessage: persistAddMessage,
    updateMessage: persistUpdateMessage,
    clearMessages: persistClearMessages,
    setMessages,
    projectUrl,
    sitemap,
    title,
    setProjectUrl,
  } = useChatPersistence(sessionId);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isProcessingTools, setIsProcessingTools] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<StreamingWebSocketClient | null>(null);

  // Trigger onFrontendGenerated if projectUrl is available on load
  useEffect(() => {
    if (projectUrl && onFrontendGenerated && !isLoadingMessages) {
      console.log("🚀 Auto-opening preview with stored URL:", projectUrl);
      onFrontendGenerated(projectUrl);
    }
  }, [projectUrl, onFrontendGenerated, isLoadingMessages]);

  // Initialize WebSocket client
  useEffect(() => {
    if (sessionId && !wsClientRef.current) {
      wsClientRef.current = new StreamingWebSocketClient(sessionId);
    }
  }, [sessionId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const addMessage = useCallback(
    (message: Omit<Message, "id">): Message => {
      return persistAddMessage(message);
    },
    [persistAddMessage]
  );

  const updateMessage = useCallback(
    (messageId: string, content: string) => {
      persistUpdateMessage(messageId, content);
    },
    [persistUpdateMessage]
  );

  const clearMessages = useCallback(() => {
    persistClearMessages();
  }, [persistClearMessages]);

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

  const sendMessage = useCallback(
    async (content: string): Promise<void> => {
      if (!content.trim() || !wsClientRef.current) return;

      // Set streaming state
      setIsStreaming(true);

      try {
        // Add user message after ensuring connection
        const isConnected = await connect();
        if (!isConnected) {
          throw new Error("Failed to establish WebSocket connection");
        }
        
        // Add user message to chat history
        const userMessage = addMessage({
          type: "user",
          content: content.trim(),
          timestamp: new Date(),
        });

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

            // Check for frontend_code_generator tool output with ngrok URL
            if (
              text.includes("[Tool Output for frontend_code_generator]:") &&
              text.includes("preview.imagine.bo")
            ) {
const urlMatch = text.match(
  /https?:\/\/[^\s"]+?(?:\.localhost:8000|\.preview\.imagine\.bo)\/?/
);

              if (urlMatch && onFrontendGenerated) {
                const localUrl = urlMatch[0];
                console.log("🚀 Frontend generated with URL:", localUrl);
                setProjectUrl(localUrl); // Store in session storage
                onFrontendGenerated(localUrl);
              }
            }
          },
          onToolStart: () => {
            setIsProcessingTools(true);
            console.log("🔧 Tool processing started");
          },
          onToolEnd: () => {
            setIsProcessingTools(false);
            console.log("✅ Tool processing ended");
          },
          onComplete: (fullContent: string) => {
            // Use the accumulated streaming content if it's longer than fullContent
            const finalContent =
              streamingContent.length > fullContent.length
                ? streamingContent
                : fullContent;
            updateMessage(aiMessage.id, finalContent);
            setIsStreaming(false);
            setIsProcessingTools(false);
            console.log(
              "🎉 Streaming completed with content length:",
              finalContent.length
            );
          },
          onError: (error: Error) => {
            console.error("❌ Streaming error:", error);

            updateMessage(
              aiMessage.id,
              `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${error.message}`
            );

            setIsStreaming(false);
            setIsProcessingTools(false);
          },
        };

        await wsClientRef.current.sendStreamingMessage(content, callbacks);
      } catch (error) {
        console.error("Error in sendMessage:", error);

        // Add error message
        addMessage({
          type: "ai",
          content: `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: new Date(),
        });

        // Clear loading states
        setIsStreaming(false);
        setIsProcessingTools(false);
      }
    },
    [addMessage, updateMessage, connect]
  );

  return {
    messages,
    isLoadingMessages,
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
    onFrontendGenerated,
    projectUrl,
    sitemap,
    title,
  };
};
