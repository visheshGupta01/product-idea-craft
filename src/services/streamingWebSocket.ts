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
    let isComplete = false;
    let isProcessingTools = false;
    
    // Set up completion timeout
    this.completionTimeout = setTimeout(() => {
      if (!isComplete) {
        console.warn("⚠️ Stream timeout reached. Forcing completion.");
        isComplete = true;
        if (isProcessingTools) {
          callbacks.onToolEnd();
        }
        callbacks.onComplete(fullContent);
        this.cleanup(messageHandler);
      }
    }, 10000); // 10 second timeout

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;

      console.log("📨 Raw WebSocket message:", event.data);

      try {
        const data: any = JSON.parse(event.data);
        console.log("📋 Parsed message:", data);

        // Handle completion signals
        if (data.done === true || data.type === 'message_stop' || data.type === 'complete') {
          if (!isComplete) {
            console.log(`✅ Stream completed. Final content length: ${fullContent.length}`);
            isComplete = true;
            if (this.completionTimeout) clearTimeout(this.completionTimeout);
            if (isProcessingTools) {
              callbacks.onToolEnd();
            }
            callbacks.onComplete(fullContent);
            this.cleanup(messageHandler);
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
            
            // Tool execution is complete
            console.log("🔧 Tool execution completed");
            isProcessingTools = false;
            callbacks.onToolEnd();
            break;

          case 'error':
            if (!isComplete) {
              isComplete = true;
              this.cleanup(messageHandler);
              callbacks.onError(new Error(data.message || 'WebSocket streaming error'));
            }
            break;

          default:
            // Handle messages without type but with text
            if (data.text && !data.type) {
              fullContent += data.text;
              callbacks.onContent(data.text);
            }
            break;
        }
      } catch (parseError) {
        console.warn("Failed to parse WebSocket message:", event.data, parseError);
        
        // Handle plain text fallback
        if (typeof event.data === 'string' && !isComplete) {
          if (event.data.includes('complete') || event.data.includes('message_stop')) {
            if (!isComplete) {
              isComplete = true;
              if (isProcessingTools) {
                callbacks.onToolEnd();
              }
              callbacks.onComplete(fullContent);
              this.cleanup(messageHandler);
            }
          } else {
            fullContent += event.data;
            callbacks.onContent(event.data);
          }
        }
      }
    };

    // Clean setup
    this.cleanup(messageHandler);
    this.ws.addEventListener('message', messageHandler);

    // Send message
    try {
      this.ws.send(JSON.stringify({
        message,
        session_id: this.sessionId,
        stream: true,
      }));
    } catch (error) {
      this.cleanup(messageHandler);
      throw error;
    }
  }

  private cleanup(messageHandler: (event: MessageEvent) => void) {
    this.ws?.removeEventListener('message', messageHandler);
    if (this.completionTimeout) {
      clearTimeout(this.completionTimeout);
      this.completionTimeout = null;
    }
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