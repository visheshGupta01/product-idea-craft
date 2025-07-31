export interface StreamingMessage {
  type: 'done' | 'error';
  tool?: string;
  text?: string;
  message?: string;
}

export interface StreamingCallbacks {
  onContent: (text: string) => void;
  onToolStart: () => void;
  onToolEnd: () => void;
  onComplete: (fullContent: string) => void;
  onError: (error: Error) => void;
}

export class StreamingWebSocketClient {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://localhost:8000/ws?s_id=${this.sessionId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log("StreamingWebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error("StreamingWebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("StreamingWebSocket disconnected");
          this.handleReconnect();
        };
      } catch (error) {
        console.error("Error creating StreamingWebSocket:", error);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`StreamingWebSocket reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay);
    }
  }

  async sendStreamingMessage(message: string, callbacks: StreamingCallbacks): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    let fullContent = '';
    let isComplete = false;
    let isInToolMode = false;
    let completionTimeout: NodeJS.Timeout | null = null;

    // Robust completion handler to prevent race conditions
    const handleCompletion = () => {
      if (isComplete) return;
      
      console.log("🎯 Completing stream - toolMode:", isInToolMode, "contentLength:", fullContent.length);
      isComplete = true;
      
      // Clear timeout
      if (completionTimeout) {
        clearTimeout(completionTimeout);
        completionTimeout = null;
      }
      
      // End tool mode if active
      if (isInToolMode) {
        console.log("🔧 Ending tool mode on completion");
        callbacks.onToolEnd();
        isInToolMode = false;
      }
      
      // Complete the stream
      console.log("✅ Calling onComplete with content length:", fullContent.length);
      callbacks.onComplete(fullContent);
      this.cleanup(messageHandler);
    };

    // Set completion timeout as fallback (30 seconds)
    completionTimeout = setTimeout(() => {
      console.warn("⚠️ Stream completion timeout reached, forcing completion");
      handleCompletion();
    }, 30000);

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;

      console.log("📨 Raw WebSocket message:", event.data);

      // Handle JSON messages (completion signals)
      try {
        const data: any = JSON.parse(event.data);
        console.log("📋 Parsed JSON message:", data);

        // Handle completion signal from backend
        if (data.type === 'done' && data.tool === 'claude') {
          console.log("✅ Stream completed with done signal");
          handleCompletion();
          return;
        }

        // Handle error messages
        if (data.type === 'error') {
          if (!isComplete) {
            isComplete = true;
            if (completionTimeout) {
              clearTimeout(completionTimeout);
              completionTimeout = null;
            }
            if (isInToolMode) {
              callbacks.onToolEnd();
              isInToolMode = false;
            }
            this.cleanup(messageHandler);
            callbacks.onError(new Error(data.message || 'WebSocket streaming error'));
          }
          return;
        }
      } catch (parseError) {
        // Not JSON, handle as text content
        if (typeof event.data === 'string' && !isComplete) {
          const content = event.data;
          
          // Only enter tool mode when we actually detect tool usage
          if (content.includes('[Tool Use Started]:')) {
            console.log("🔧 Tool execution started - entering tool mode");
            console.log("🔧 Tool start content:", content);
            if (!isInToolMode) {
              isInToolMode = true;
              callbacks.onToolStart();
            }
            fullContent += content;
            callbacks.onContent(content);
          } else if (content.includes('[Tool Output for') && content.includes(']:')) {
            console.log("🔧 Tool output received");
            console.log("🔧 Tool output content:", content);
            console.log("🔧 Full content so far:", fullContent.length, "chars");
            // Keep tool mode active, don't end here
            fullContent += content;
            callbacks.onContent(content);
          } else {
            // Regular streaming text content
            console.log("📝 Content chunk received:", content.length, "characters");
            if (content.length < 100) {
              console.log("📝 Content preview:", content);
            }
            fullContent += content;
            callbacks.onContent(content);
          }
        }
      }
    };

    // Clean setup
    this.cleanup(messageHandler);
    this.ws.addEventListener('message', messageHandler);

    // Send message
    try {
      console.log("🚀 Sending message to WebSocket");
      this.ws.send(JSON.stringify({
        message,
        session_id: this.sessionId,
        stream: true,
      }));
    } catch (error) {
      if (completionTimeout) {
        clearTimeout(completionTimeout);
        completionTimeout = null;
      }
      this.cleanup(messageHandler);
      throw error;
    }
  }

  private cleanup(messageHandler: (event: MessageEvent) => void) {
    this.ws?.removeEventListener('message', messageHandler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}