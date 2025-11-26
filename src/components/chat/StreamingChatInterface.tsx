import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PinkLoadingDots } from "@/components/ui/pink-loading-dots";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface StreamingChatInterfaceProps {
  userIdea?: string;
  onFrontendGenerated?: (url: string) => void;
  onSitemapGenerated?: (sitemap: any) => void;
  urlSessionId?: string;
  onStreamingStateChange?: (isStreaming: boolean) => void;
  onToolProcessingChange?: (isProcessingTools: boolean) => void;
  projectDetails?: any;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({
  userIdea,
  onFrontendGenerated,
  onSitemapGenerated,
  urlSessionId,
  onStreamingStateChange,
  onToolProcessingChange,
  projectDetails,
}) => {
  const {
    sessionId: contextSessionId,
    initialResponse,
    clearInitialResponse,
  } = useUser();
  const activeSessionId = urlSessionId || contextSessionId;
  const navigate = useNavigate();
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);

  const {
    messages,
    isLoadingMessages,
    isStreaming,
    isProcessingTools,
    messagesEndRef,
    sendMessage,
    addMessage,
    scrollToBottom,
    connect,
    stopGeneration,
  } = useStreamingChat(
    activeSessionId || "", 
    onFrontendGenerated, 
    onSitemapGenerated,
    () => setShowBalanceDialog(true)
  );

  const [isInitialized, setIsInitialized] = useState(false);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Notify parent of streaming state changes
  useEffect(() => {
    onStreamingStateChange?.(isStreaming);
  }, [isStreaming, onStreamingStateChange]);

  // Notify parent of tool processing state changes
  useEffect(() => {
    onToolProcessingChange?.(isProcessingTools);
  }, [isProcessingTools, onToolProcessingChange]);

  // Initialize connection when sessionId is available
  useEffect(() => {
    if (activeSessionId) {
      connect().then((success) => {
        if (success) {
          //console.log("✅ WebSocket connected successfully");
        } else {
          //console.error("❌ Failed to connect WebSocket");
        }
      });
    }
  }, [activeSessionId, connect]);

  // Add welcome message only for new sessions (with delay to allow message restoration)
  useEffect(() => {
    if (
      activeSessionId &&
      !isInitialized &&
      !isLoadingMessages &&
      !initialResponse
    ) {
      // Clear any existing timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }

      // Wait a bit for useChatPersistence to restore messages
      initTimeoutRef.current = setTimeout(() => {
        if (messages.length === 0) {
          addMessage({
            type: "ai",
            content:
              "Hello! I'm here to help you build your idea. What would you like to create today?",
            timestamp: new Date(),
          });
        }
        setIsInitialized(true);
      }, 200);
    } else if (activeSessionId && !isLoadingMessages && initialResponse) {
      // If there's an initial response, don't add welcome message, just mark as initialized
      setIsInitialized(true);
    }

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [
    activeSessionId,
    messages.length,
    addMessage,
    isInitialized,
    isLoadingMessages,
    initialResponse,
  ]);

  // Handle initial response from user context and send message
  useEffect(() => {
    if (
      initialResponse &&
      activeSessionId &&
      !isLoadingMessages &&
      isInitialized
    ) {
      // Send the message (which will also add it to messages)
      sendMessage(initialResponse.userMessage);

      // Clear from context
      clearInitialResponse();
    }
  }, [
    initialResponse,
    activeSessionId,
    isLoadingMessages,
    isInitialized,
    sendMessage,
    clearInitialResponse,
  ]);

  return (
    <>
      <div className="flex flex-col h-full bg-[#1E1E1E]">
        {/* Chat Navbar */}
        <div className="h-14 flex items-center justify-center border-b border-[#2A2A2A] bg-[#1E1E1E] relative">
          <span className="text-white text-lg font-poppins font-medium">
            {projectDetails?.title || "Untitled Project"}
          </span>
        </div>

        {isLoadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading chat history..." />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="space-y-6 max-w-5xl mx-auto">
                {messages.map((message, index) => (
                  <div key={message.id} className="group">
                    <MessageBubble
                      message={message}
                      isWelcomeMessage={index === 0 && message.type === "ai"}
                      isStreaming={isStreaming}
                    />
                  </div>
                ))}
                
                {/* Show AI responding indicator */}
                {(isStreaming || isProcessingTools) && messages[messages.length - 1]?.type === "ai" && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🤖</span>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2 border border-pink-500/20">
                      <PinkLoadingDots />
                      <span className="text-sm text-muted-foreground">
                        {isProcessingTools ? "Running tools..." : "AI is thinking..."}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="bg-[#1E1E1E] pb-6 border-t border-gray-800">
              <div className="max-w-5xl mx-auto mt-3 px-6">
                <ChatInput
                  onSendMessage={(message, model) => sendMessage(message, model)}
                  isLoading={isStreaming}
                  onStopGeneration={stopGeneration}
                />
              </div>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={showBalanceDialog} onOpenChange={setShowBalanceDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Balance Finished</AlertDialogTitle>
            <AlertDialogDescription>
              Your balance has been exhausted. Please upgrade your plan to
              continue using the service.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/pricing")}>
              Go to Pricing
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
