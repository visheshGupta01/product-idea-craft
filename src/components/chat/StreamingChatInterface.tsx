import React, { useEffect, useState, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { useUser } from "@/context/UserContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
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
  isLargeScreen?: boolean;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({
  userIdea,
  onFrontendGenerated,
  onSitemapGenerated,
  urlSessionId,
  isLargeScreen,
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
  const shouldAutoScrollRef = useRef(true);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);

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

  // Track scroll position to determine if user is at bottom
  useEffect(() => {
    const scrollViewport = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (scrollViewport) {
      scrollViewportRef.current = scrollViewport as HTMLDivElement;

      const handleScroll = () => {
        const element = scrollViewportRef.current;
        if (element) {
          const isNearBottom =
            element.scrollHeight - element.scrollTop - element.clientHeight <
            100;
          shouldAutoScrollRef.current = isNearBottom;
        }
      };

      scrollViewport.addEventListener("scroll", handleScroll);
      return () => scrollViewport.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Auto-scroll on new messages only if user is already at bottom
  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [messages, isStreaming, scrollToBottom]);

  return (
    <>
      <div className=" w-full flex flex-col h-full bg-[#1E1E1E]">
        {isLoadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading chat history..." />
          </div>
        ) : (
          <>
            {isLargeScreen ? (
              <ScrollArea className=" flex-1 p-4 sm:p-6">
                <div className=" space-y-6  max-w-4xl mx-auto ">
                  {messages.map((message, index) => (
                    <div key={message.id} className="group">
                      <MessageBubble
                        message={message}
                        isWelcomeMessage={index === 0 && message.type === "ai"}
                        isStreaming={isStreaming}
                      />
                    </div>
                  ))}

                  {/* Show tool processing indicator */}
                  {isProcessingTools && (
                    <div className="flex items-start gap-3 animate-scale-in">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 animate-pulse">
                        <span className="text-sm">🔧</span>
                      </div>
                      <div className="flex-1 bg-gradient-to-r from-muted to-muted/50 rounded-lg p-4 border border-primary/20 shadow-lg">
                        <div className="flex items-center gap-3">
                          <LoadingSpinner size="sm" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              Processing tools
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Executing operations...
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            ) : (
              <div className="overflow-y-scroll space-y-6  max-w-[72vw] sm:max-w-xl md:max-w-2xl mx-auto ">
                {messages.map((message, index) => (
                  <div key={message.id} className="group">
                    <MessageBubble
                      message={message}
                      isWelcomeMessage={index === 0 && message.type === "ai"}
                      isStreaming={isStreaming}
                    />
                  </div>
                ))}

                {/* Show tool processing indicator */}
                {isProcessingTools && (
                  <div className="flex items-start gap-3 animate-scale-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 animate-pulse">
                      <span className="text-sm">🔧</span>
                    </div>
                    <div className="flex-1 bg-gradient-to-r from-muted to-muted/50 rounded-lg p-4 border border-primary/20 shadow-lg">
                      <div className="flex items-center gap-3">
                        <LoadingSpinner size="sm" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            Processing tools
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Executing operations...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="bg-[#1E1E1E] pb-6">
              <div className="max-w-5xl mx-auto px-6">
                <ChatInput
                  onSendMessage={sendMessage}
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
