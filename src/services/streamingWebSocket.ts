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

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;

      console.log("📨 Raw WebSocket message:", event.data);

      try {
        const data: any = JSON.parse(event.data);
        console.log("📋 Parsed message:", data);

        // Check for done: true to complete streaming
        if (data.done === true) {
          if (!isComplete) {
            isComplete = true;
            callbacks.onToolEnd(); // Ensure tools are cleared
            callbacks.onComplete(fullContent);
            this.cleanup(messageHandler);
          }
          return;
        }

        switch (data.type) {
          case 'content':
            if (data.text) {
              fullContent += data.text;
              callbacks.onContent(data.text);
            }
            break;

          case 'tool_use':
            callbacks.onToolStart();
            break;

          case 'tool_result':
            callbacks.onToolEnd();
            let toolOutput = '';
            
            // Handle different content formats
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
            
            // Also check for direct text property
            if (data.text && !toolOutput) {
              toolOutput = data.text;
            }
            
            console.log("🔧 Tool output received:", toolOutput.length, "characters");
            
            if (toolOutput) {
              fullContent += toolOutput;
              callbacks.onContent(toolOutput);
            }
            break;

          case 'message_stop':
          case 'complete':
            if (!isComplete) {
              isComplete = true;
              callbacks.onToolEnd(); // Ensure tools are cleared
              callbacks.onComplete(fullContent);
              this.cleanup(messageHandler);
            }
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