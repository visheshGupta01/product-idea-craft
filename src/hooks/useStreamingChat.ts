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
  stopGeneration: () => void;
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  onInsufficientBalance?: () => void;
}

export const useStreamingChat = (
  sessionId: string,
  onFrontendGenerated?: (url: string) => void,
  onSitemapGenerated?: (sitemap: any) => void,
  onInsufficientBalance?: () => void
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
      onFrontendGenerated(projectUrl);
    }
  }, [projectUrl, isLoadingMessages]);  //removed onFrontendGenerated from dependencies to avoid infinite loop

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
      return false;
    }

    try {
      if (!wsClientRef.current.isConnected()) {
        await wsClientRef.current.connect();
      }
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.disconnect();
    }
  }, []);

  const stopGeneration = useCallback(() => {
    if (wsClientRef.current) {
      wsClientRef.current.stopGeneration();
      setIsStreaming(false);
      setIsProcessingTools(false);
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

            // Check for insufficient balance in message content
            if (
              streamingContent.toLowerCase().includes("insufficient balance")
            ) {
              onInsufficientBalance?.();
              setIsStreaming(false);
              setIsProcessingTools(false);
              return;
            }

            updateMessage(aiMessage.id, streamingContent);

            // Check for frontend_code_generator tool output with ngrok URL
            if (
              (text.includes("[Tool Output for frontend_code_generator]:") &&
                text.includes("preview.imagine.bo")) ||
              (text.includes("[Tool Output for frontend_code_generator]:") &&
                text.includes("devpreview.imagine.bo"))
            ) {
              const urlMatch = text.match(
                /https?:\/\/[^\s"]+?(?:\.localhost:8000|\.preview\.imagine\.bo|\.devpreview\.imagine\.bo)\/?/
              );
              if (urlMatch && onFrontendGenerated) {
                const localUrl = urlMatch[0];
                // Add timestamp to force reload
                const urlWithTimestamp = `${localUrl}${localUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
                setProjectUrl(urlWithTimestamp); // Store in session storage
                onFrontendGenerated(urlWithTimestamp);
              }
            }

            // Check for sitemap_user_idea tool output
            if (streamingContent.includes("[Tool Output for sitemap_user_idea]:")) {
              const sitemapMatch = streamingContent.match(
                /\[Tool Output for sitemap_user_idea\]:\s*(\{[\s\S]*?\})\s*(?=\[Tool Output|\n\n|$)/
              );
              if (sitemapMatch && onSitemapGenerated) {
                try {
                  const sitemapData = JSON.parse(sitemapMatch[1]);
                  onSitemapGenerated(sitemapData);
                } catch (e) {
                  //console.error("Failed to parse sitemap:", e);
                }
              }
            }
          },
          onToolStart: () => {
            setIsProcessingTools(true);
          },
          onToolEnd: () => {
            setIsProcessingTools(false);
          },
          onComplete: (fullContent: string) => {
            // Use the accumulated streaming content if it's longer than fullContent
            const finalContent =
              streamingContent.length > fullContent.length
                ? streamingContent
                : fullContent;
            // console.log("Final streamed content:", finalContent);
            updateMessage(aiMessage.id, finalContent);
            setIsStreaming(false);
            setIsProcessingTools(false);
          },
          onError: (error: Error) => {
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
    [addMessage, updateMessage, connect, onFrontendGenerated, onSitemapGenerated, onInsufficientBalance, setProjectUrl]
  );

  // Filter out empty messages before returning, but keep them during streaming
  const filteredMessages = isStreaming 
    ? messages 
    : messages.filter((msg) => msg.content.trim() !== "");

  return {
    messages: filteredMessages,
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
    stopGeneration,
    onFrontendGenerated,
    onSitemapGenerated,
    onInsufficientBalance,
    projectUrl,
    sitemap,
    title,
  };
};
