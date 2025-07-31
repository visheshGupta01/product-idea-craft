import { useState, useEffect, useCallback, useRef } from 'react';
import { streamingWebSocketService } from '../services/streamingWebSocket';
import { ChatMessage, ToolOutput, StreamingState } from '../types/chat';

interface UseStreamingChatReturn {
  messages: ChatMessage[];
  toolOutputs: Map<string, ToolOutput[]>;
  streamingState: StreamingState;
  sendMessage: (content: string) => void;
  clearMessages: () => void;
  isInitialized: boolean;
  initializeSession: (sessionId: string) => Promise<boolean>;
}

export const useStreamingChat = (): UseStreamingChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [toolOutputs, setToolOutputs] = useState<Map<string, ToolOutput[]>>(new Map());
  const [streamingState, setStreamingState] = useState<StreamingState>(
    streamingWebSocketService.getState()
  );
  const [isInitialized, setIsInitialized] = useState(false);
  
  const messageMapRef = useRef<Map<string, ChatMessage>>(new Map());
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  const initializeSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const success = await streamingWebSocketService.initializeSession(sessionId);
      setIsInitialized(success);
      return success;
    } catch (error) {
      console.error('Failed to initialize chat session:', error);
      setIsInitialized(false);
      return false;
    }
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (!streamingState.isConnected) {
      console.warn('Cannot send message: not connected');
      return;
    }

    streamingWebSocketService.sendMessage(content);
  }, [streamingState.isConnected]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setToolOutputs(new Map());
    messageMapRef.current.clear();
  }, []);

  // Set up listeners
  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // State changes
    const unsubscribeState = streamingWebSocketService.onStateChange((newState) => {
      setStreamingState(newState);
    });
    cleanupFunctions.push(unsubscribeState);

    // Message updates
    const unsubscribeMessages = streamingWebSocketService.onMessage((message) => {
      messageMapRef.current.set(message.id, message);
      
      setMessages(prevMessages => {
        const existingIndex = prevMessages.findIndex(m => m.id === message.id);
        
        if (existingIndex >= 0) {
          // Update existing message
          const newMessages = [...prevMessages];
          newMessages[existingIndex] = message;
          return newMessages;
        } else {
          // Add new message
          return [...prevMessages, message];
        }
      });
    });
    cleanupFunctions.push(unsubscribeMessages);

    // Tool output updates
    const unsubscribeToolOutputs = streamingWebSocketService.onToolOutput((toolOutput) => {
      const messageId = streamingState.currentMessageId;
      if (!messageId) return;

      setToolOutputs(prevOutputs => {
        const newOutputs = new Map(prevOutputs);
        const existing = newOutputs.get(messageId) || [];
        
        // Check if this tool output already exists (by toolName and timestamp)
        const existingIndex = existing.findIndex(
          output => output.toolName === toolOutput.toolName && 
                   Math.abs(output.timestamp.getTime() - toolOutput.timestamp.getTime()) < 1000
        );

        if (existingIndex >= 0) {
          // Update existing tool output
          existing[existingIndex] = toolOutput;
        } else {
          // Add new tool output
          existing.push(toolOutput);
        }

        newOutputs.set(messageId, existing);
        return newOutputs;
      });
    });
    cleanupFunctions.push(unsubscribeToolOutputs);

    cleanupFunctionsRef.current = cleanupFunctions;

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [streamingState.currentMessageId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      streamingWebSocketService.disconnect();
    };
  }, []);

  return {
    messages,
    toolOutputs,
    streamingState,
    sendMessage,
    clearMessages,
    isInitialized,
    initializeSession
  };
};