import { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "@/types";
import { StreamingWebSocketClient } from "@/services/streamingWebSocket";
import { StreamingCallbacks, ChatStatus } from "@/types/websocketEvents";
import { useChatPersistence } from "./useChatPersistence";

export interface StreamingChatState {
  messages: Message[];
  isLoadingMessages: boolean;
  isStreaming: boolean;
  isProcessingTools: boolean;
  chatStatus: ChatStatus;
  statusMessage: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  projectUrl: string;
  sitemap: any;
  title: string;
}

export interface StreamingChatActions {
  sendMessage: (content: string, model?: string) => Promise<void>;
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
  const [chatStatus, setChatStatus] = useState<ChatStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsClientRef = useRef<StreamingWebSocketClient | null>(null);

  // Trigger onFrontendGenerated if projectUrl is available on load
  useEffect(() => {
    if (projectUrl && onFrontendGenerated && !isLoadingMessages) {
      onFrontendGenerated(projectUrl);
    }
  }, [projectUrl, isLoadingMessages]);

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
      setChatStatus("idle");
      setStatusMessage("");
    }
  }, []);

  const resetStates = useCallback(() => {
    setIsStreaming(false);
    setIsProcessingTools(false);
    setChatStatus("idle");
    setStatusMessage("");
  }, []);

  const sendMessage = useCallback(
    async (content: string, model: string = "kimik2"): Promise<void> => {
      if (!content.trim() || !wsClientRef.current) return;

      // Set initial states
      setIsStreaming(true);
      setChatStatus("streaming");
      setStatusMessage("");

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

            // Check for frontend_code_generator tool output with preview URL
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
                const urlWithTimestamp = `${localUrl}${localUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
                setProjectUrl(urlWithTimestamp);
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
                  // Failed to parse sitemap
                }
              }
            }
          },

          onToolStart: (message?: string) => {
            setIsProcessingTools(true);
            setChatStatus("tool_running");
            setStatusMessage(message || "Running tool...");
          },

          onToolOutput: (message: string) => {
            streamingContent += message;
            updateMessage(aiMessage.id, streamingContent);
          },

          onToolComplete: (message?: string) => {
            setIsProcessingTools(false);
            setChatStatus("streaming");
            setStatusMessage("");
          },

          onToolError: (message: string) => {
            setIsProcessingTools(false);
            setChatStatus("error");
            setStatusMessage(message || "Tool error occurred");
          },

          onStreamStart: () => {
            setIsStreaming(true);
            setChatStatus("streaming");
          },

          onStreamEnd: () => {
            updateMessage(aiMessage.id, streamingContent);
            resetStates();
          },

          onStreamError: (message: string) => {
            updateMessage(
              aiMessage.id,
              streamingContent || `Error: ${message}`
            );
            setChatStatus("error");
            setStatusMessage(message);
            setTimeout(resetStates, 2000);
          },

          onThinking: () => {
            setChatStatus("thinking");
            setStatusMessage("Thinking...");
          },

          onGenerating: () => {
            setChatStatus("generating");
            setStatusMessage("Generating frontend...");
          },

          onPreviewStart: (message?: string) => {
            setChatStatus("preview_generating");
            setStatusMessage(message || "Generating preview...");
          },

          onPreviewDone: (message?: string) => {
            setChatStatus("streaming");
            setStatusMessage("");
            // If message contains URL, trigger preview
            if (message && onFrontendGenerated) {
              const urlMatch = message.match(
                /https?:\/\/[^\s"]+?(?:\.localhost:8000|\.preview\.imagine\.bo|\.devpreview\.imagine\.bo)\/?/
              );
              if (urlMatch) {
                const localUrl = urlMatch[0];
                const urlWithTimestamp = `${localUrl}${localUrl.includes('?') ? '&' : '?'}_t=${Date.now()}`;
                setProjectUrl(urlWithTimestamp);
                onFrontendGenerated(urlWithTimestamp);
              }
            }
          },

          onPreviewError: (message: string) => {
            setChatStatus("error");
            setStatusMessage(message || "Preview generation failed");
          },

          onProgressStart: (message?: string) => {
            setChatStatus("generating");
            setStatusMessage(message || "Processing...");
          },

          onProgressDone: (message?: string) => {
            setChatStatus("streaming");
            setStatusMessage("");
          },

          onPricingLow: (message: string) => {
            // Trigger insufficient balance popup
            onInsufficientBalance?.();
            resetStates();
          },

          onError: (error: Error) => {
            updateMessage(
              aiMessage.id,
              streamingContent || `Sorry, I encountered an error: ${error.message}`
            );
            setChatStatus("error");
            setStatusMessage(error.message);
            setTimeout(resetStates, 2000);
          },

          onSuccess: (message?: string) => {
            updateMessage(aiMessage.id, streamingContent);
            resetStates();
          },

          onInfo: (message: string) => {
            // Info messages can be shown as status or appended to content
            setStatusMessage(message);
          },
        };

        await wsClientRef.current.sendStreamingMessage(content, model, callbacks);
      } catch (error) {
        // Add error message
        addMessage({
          type: "ai",
          content: `Sorry, I encountered an error while processing your message. Please try again.\n\nError: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          timestamp: new Date(),
        });

        resetStates();
      }
    },
    [addMessage, updateMessage, connect, onFrontendGenerated, onSitemapGenerated, onInsufficientBalance, setProjectUrl, resetStates]
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
    chatStatus,
    statusMessage,
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
