import { websocketService } from './websocketService';
import { ChatMessage, ToolOutput, StreamingState } from '../types/chat';

class StreamingWebSocketService {
  private streamingState: StreamingState = {
    isConnected: false,
    isStreaming: false,
    currentMessageId: null,
    error: null
  };

  private stateListeners: Set<(state: StreamingState) => void> = new Set();
  private messageListeners: Set<(message: ChatMessage) => void> = new Set();
  private toolOutputListeners: Set<(toolOutput: ToolOutput) => void> = new Set();

  constructor() {
    this.setupWebSocketListeners();
  }

  async initializeSession(sessionId: string): Promise<boolean> {
    try {
      const connected = await websocketService.connect(sessionId);
      this.updateState({ isConnected: connected, error: null });
      return connected;
    } catch (error) {
      console.error('Failed to initialize session:', error);
      this.updateState({ 
        isConnected: false, 
        error: error instanceof Error ? error.message : 'Connection failed' 
      });
      return false;
    }
  }

  sendMessage(content: string): string {
    const messageId = this.generateMessageId();
    
    if (!websocketService.isConnected()) {
      this.updateState({ error: 'Not connected to server' });
      return messageId;
    }

    try {
      // Create user message
      const userMessage: ChatMessage = {
        id: messageId,
        content,
        sender: 'user',
        timestamp: new Date()
      };

      this.notifyMessageListeners(userMessage);

      // Send to server
      websocketService.sendChatMessage(content, messageId);
      
      // Start streaming state
      this.updateState({ 
        isStreaming: true, 
        currentMessageId: messageId,
        error: null 
      });

    } catch (error) {
      console.error('Error sending message:', error);
      this.updateState({ 
        error: error instanceof Error ? error.message : 'Failed to send message',
        isStreaming: false 
      });
    }

    return messageId;
  }

  getState(): StreamingState {
    return { ...this.streamingState };
  }

  onStateChange(listener: (state: StreamingState) => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  onMessage(listener: (message: ChatMessage) => void): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onToolOutput(listener: (toolOutput: ToolOutput) => void): () => void {
    this.toolOutputListeners.add(listener);
    return () => this.toolOutputListeners.delete(listener);
  }

  disconnect(): void {
    websocketService.disconnect();
    this.updateState({
      isConnected: false,
      isStreaming: false,
      currentMessageId: null,
      error: null
    });
  }

  private setupWebSocketListeners(): void {
    // Handle streaming messages
    websocketService.onStreamingMessage((content, messageId, isComplete) => {
      const botMessage: ChatMessage = {
        id: messageId,
        content,
        sender: 'bot',
        timestamp: new Date(),
        isStreaming: !isComplete
      };

      this.notifyMessageListeners(botMessage);

      if (isComplete) {
        this.updateState({ 
          isStreaming: false, 
          currentMessageId: null 
        });
      }
    });

    // Handle tool outputs
    websocketService.onToolOutput((toolOutput) => {
      this.notifyToolOutputListeners(toolOutput);
    });

    // Handle general messages for connection status
    websocketService.onMessage((message) => {
      switch (message.type) {
        case 'error':
          this.updateState({ 
            error: message.data?.message || 'Unknown error',
            isStreaming: false 
          });
          break;
        
        case 'stream_start':
          this.updateState({ 
            isStreaming: true,
            currentMessageId: message.messageId || null 
          });
          break;
          
        case 'stream_end':
          this.updateState({ 
            isStreaming: false,
            currentMessageId: null 
          });
          break;
      }
    });
  }

  private updateState(updates: Partial<StreamingState>): void {
    this.streamingState = { ...this.streamingState, ...updates };
    this.stateListeners.forEach(listener => {
      try {
        listener(this.streamingState);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  private notifyMessageListeners(message: ChatMessage): void {
    this.messageListeners.forEach(listener => {
      try {
        listener(message);
      } catch (error) {
        console.error('Error in message listener:', error);
      }
    });
  }

  private notifyToolOutputListeners(toolOutput: ToolOutput): void {
    this.toolOutputListeners.forEach(listener => {
      try {
        listener(toolOutput);
      } catch (error) {
        console.error('Error in tool output listener:', error);
      }
    });
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const streamingWebSocketService = new StreamingWebSocketService();