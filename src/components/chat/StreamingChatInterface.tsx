import React, { useEffect, useRef, useState } from 'react';
import { useStreamingChat } from '../../hooks/useStreamingChat';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { ToolOutputRenderer } from './ToolOutputRenderer';
import { LoadingSpinner } from '../ui/loading-spinner';

interface StreamingChatInterfaceProps {
  sessionId: string;
  onSessionUpdate?: (sessionId: string) => void;
}

export const StreamingChatInterface: React.FC<StreamingChatInterfaceProps> = ({
  sessionId,
  onSessionUpdate
}) => {
  const {
    messages,
    toolOutputs,
    streamingState,
    sendMessage,
    clearMessages,
    isInitialized,
    initializeSession
  } = useStreamingChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize session
  useEffect(() => {
    if (sessionId && !isInitialized) {
      setIsInitializing(true);
      initializeSession(sessionId)
        .then((success) => {
          if (success) {
            console.log('Chat session initialized successfully');
          } else {
            console.error('Failed to initialize chat session');
          }
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [sessionId, isInitialized, initializeSession]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, toolOutputs]);

  const handleSendMessage = (content: string) => {
    if (!streamingState.isConnected) {
      console.warn('Cannot send message: not connected');
      return;
    }
    sendMessage(content);
  };

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <LoadingSpinner />
          <span className="text-muted-foreground">Initializing chat session...</span>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-destructive mb-2">Failed to initialize chat session</div>
          <button 
            onClick={() => initializeSession(sessionId)}
            className="text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Connection Status */}
      {streamingState.error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-2 rounded-md mx-4 mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Connection Error:</span>
            <span className="text-sm">{streamingState.error}</span>
          </div>
        </div>
      )}

      {!streamingState.isConnected && !streamingState.error && (
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md mx-4 mt-4">
          <div className="flex items-center gap-2">
            <LoadingSpinner />
            <span className="text-sm">Connecting to server...</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            <div className="text-lg font-medium mb-2">Welcome to ImagineBo</div>
            <div className="text-sm">Start a conversation by typing a message below.</div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id}>
            <MessageBubble message={message} />
            
            {/* Show tool outputs for this message */}
            {message.sender === 'bot' && toolOutputs.has(message.id) && (
              <ToolOutputRenderer toolOutputs={toolOutputs.get(message.id)!} />
            )}
          </div>
        ))}

        {/* Streaming indicator */}
        {streamingState.isStreaming && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <LoadingSpinner />
            <span className="text-sm">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-border p-4 bg-background">
        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={!streamingState.isConnected || streamingState.isStreaming}
          placeholder={
            !streamingState.isConnected 
              ? "Connecting..." 
              : streamingState.isStreaming 
                ? "Please wait..." 
                : "Type your message..."
          }
        />
      </div>
    </div>
  );
};