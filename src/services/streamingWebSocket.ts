export interface StreamingMessage {
  type: 'content' | 'tool_use' | 'tool_result' | 'message_stop' | 'complete' | 'error';
  text?: string;
  content?: any;
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
  private completionTimeout: NodeJS.Timeout | null = null;

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
    let isProcessingTools = false;
    let lastMessageTime = Date.now();
    let completionCheckInterval: NodeJS.Timeout | null = null;
    
    // Check for completion every 500ms after 2 seconds of no new messages
    const checkForCompletion = () => {
      const timeSinceLastMessage = Date.now() - lastMessageTime;
      if (timeSinceLastMessage > 2000) { // 2 seconds of silence
        console.log("✅ Stream completed due to inactivity. Final content length:", fullContent.length);
        if (isProcessingTools) {
          callbacks.onToolEnd();
        }
        callbacks.onComplete(fullContent);
        this.cleanup(messageHandler);
        if (completionCheckInterval) {
          clearInterval(completionCheckInterval);
          completionCheckInterval = null;
        }
      }
    };

    const messageHandler = (event: MessageEvent) => {
      lastMessageTime = Date.now();
      console.log("📨 Raw WebSocket message:", event.data);

      try {
        const data: any = JSON.parse(event.data);
        console.log("📋 Parsed message:", data);

        // Handle explicit completion signals immediately
        if (data.done === true || data.type === 'message_stop' || data.type === 'complete') {
          console.log("✅ Stream completed via explicit signal. Final content length:", fullContent.length);
          if (isProcessingTools) {
            callbacks.onToolEnd();
          }
          callbacks.onComplete(fullContent);
          this.cleanup(messageHandler);
          if (completionCheckInterval) {
            clearInterval(completionCheckInterval);
            completionCheckInterval = null;
          }
          return;
        }

        switch (data.type) {
          case 'content':
            if (data.text) {
              console.log("📝 Content chunk received:", data.text.length, "characters");
              fullContent += data.text;
              callbacks.onContent(data.text);
            }
            break;

          case 'tool_use':
            console.log("🔧 Tool execution started");
            isProcessingTools = true;
            callbacks.onToolStart();
            break;

          case 'tool_result':
            let toolOutput = '';
            
            // Extract tool output from various formats
            if (data.content) {
              if (Array.isArray(data.content)) {
                data.content.forEach((block: any) => {
                  if (block.type === 'text' && block.text) {
                    toolOutput += block.text;
                  } else if (typeof block === 'string') {
                    toolOutput += block;
                  }
                });
              } else if (typeof data.content === 'string') {
                toolOutput = data.content;
              } else if (data.content.text) {
                toolOutput = data.content.text;
              }
            }
            
            if (data.text && !toolOutput) {
              toolOutput = data.text;
            }
            
            console.log("🔧 Tool result received:", toolOutput.length, "characters");
            
            if (toolOutput) {
              fullContent += toolOutput;
              callbacks.onContent(toolOutput);
            }
            
            console.log("🔧 Tool execution completed");
            isProcessingTools = false;
            callbacks.onToolEnd();
            break;

          case 'error':
            console.error("❌ Stream error:", data.message);
            this.cleanup(messageHandler);
            if (completionCheckInterval) {
              clearInterval(completionCheckInterval);
              completionCheckInterval = null;
            }
            callbacks.onError(new Error(data.message || 'WebSocket streaming error'));
            break;

          default:
            // Handle messages without type but with text
            if (data.text && !data.type) {
              console.log("📝 Text received:", data.text.length, "characters");
              fullContent += data.text;
              callbacks.onContent(data.text);
            }
            break;
        }
      } catch (parseError) {
        console.warn("Failed to parse WebSocket message:", event.data, parseError);
        
        // Handle plain text fallback
        if (typeof event.data === 'string') {
          if (event.data.includes('complete') || event.data.includes('message_stop') || event.data.includes('done')) {
            console.log("✅ Stream completed via text signal. Final content length:", fullContent.length);
            if (isProcessingTools) {
              callbacks.onToolEnd();
            }
            callbacks.onComplete(fullContent);
            this.cleanup(messageHandler);
            if (completionCheckInterval) {
              clearInterval(completionCheckInterval);
              completionCheckInterval = null;
            }
          } else {
            console.log("📝 Plain text received:", event.data.length, "characters");
            fullContent += event.data;
            callbacks.onContent(event.data);
          }
        }
      }
    };

    // Clean setup
    this.cleanup(messageHandler);
    this.ws.addEventListener('message', messageHandler);

    // Start completion checking after 3 seconds
    setTimeout(() => {
      if (!completionCheckInterval) {
        completionCheckInterval = setInterval(checkForCompletion, 500);
      }
    }, 3000);

    // Send message
    try {
      this.ws.send(JSON.stringify({
        message,
        session_id: this.sessionId,
        stream: true,
      }));
    } catch (error) {
      this.cleanup(messageHandler);
      if (completionCheckInterval) {
        clearInterval(completionCheckInterval);
      }
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