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
  private isToolOutputStreaming = false;
  private toolOutputBuffer = '';
  
  // Content integrity tracking
  private expectedContentLength = 0;
  private actualContentLength = 0;
  private lastContentTimestamp = 0;
  private contentTimeout: NodeJS.Timeout | null = null;
  private readonly CONTENT_TIMEOUT_MS = 5000; // 5 seconds timeout

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
    
    // Reset all tracking state for new message
    this.isToolOutputStreaming = false;
    this.toolOutputBuffer = '';
    this.actualContentLength = 0;
    this.expectedContentLength = 0;
    this.lastContentTimestamp = Date.now();
    
    // Clear any existing timeout
    if (this.contentTimeout) {
      clearTimeout(this.contentTimeout);
      this.contentTimeout = null;
    }

    // Set up content timeout safety mechanism
    const setupContentTimeout = () => {
      if (this.contentTimeout) {
        clearTimeout(this.contentTimeout);
      }
      this.contentTimeout = setTimeout(() => {
        if (!isComplete) {
          console.warn("⚠️ Content timeout reached. Forcing completion with current content.");
          console.warn(`📊 Final content stats: Expected: ${this.expectedContentLength}, Actual: ${this.actualContentLength}, Full length: ${fullContent.length}`);
          if (!isComplete) {
            isComplete = true;
            if (this.isToolOutputStreaming) {
              callbacks.onToolEnd();
            }
            callbacks.onComplete(fullContent);
            this.cleanup(messageHandler);
          }
        }
      }, this.CONTENT_TIMEOUT_MS);
    };

    const updateContentStats = (newContent: string) => {
      this.actualContentLength += newContent.length;
      this.lastContentTimestamp = Date.now();
      console.log(`📊 Content stats: Added ${newContent.length} chars, Total: ${this.actualContentLength}, Full: ${fullContent.length}`);
      setupContentTimeout(); // Reset timeout on new content
    };

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;

      console.log("📨 Raw WebSocket message:", event.data);

      try {
        const data: any = JSON.parse(event.data);
        console.log("📋 Parsed message:", data);

        // Check for expected content length in metadata
        if (data.expected_length) {
          this.expectedContentLength = data.expected_length;
          console.log(`📏 Expected content length: ${this.expectedContentLength}`);
        }

        // Check for done: true to complete streaming
        if (data.done === true) {
          if (!isComplete) {
            console.log(`✅ Stream completed with done=true. Content integrity check: Expected: ${this.expectedContentLength}, Actual: ${this.actualContentLength}, Full: ${fullContent.length}`);
            // Add a small delay to allow any pending content to arrive
            setTimeout(() => {
              if (!isComplete) {
                isComplete = true;
                if (this.contentTimeout) clearTimeout(this.contentTimeout);
                if (this.isToolOutputStreaming) {
                  callbacks.onToolEnd();
                }
                callbacks.onComplete(fullContent);
                this.cleanup(messageHandler);
              }
            }, 100); // 100ms delay to catch any late content
          }
          return;
        }

        switch (data.type) {
          case 'content':
            if (data.text) {
              console.log("📝 Content chunk received:", data.text.length, "characters");
              fullContent += data.text;
              updateContentStats(data.text);
              callbacks.onContent(data.text);
            }
            break;

          case 'tool_use':
            console.log("🔧 Tool execution started");
            this.isToolOutputStreaming = true;
            this.toolOutputBuffer = '';
            callbacks.onToolStart();
            break;

          case 'tool_result':
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
            
            console.log("🔧 Tool output chunk received:", toolOutput.length, "characters");
            console.log("🔧 Tool output preview:", toolOutput.substring(0, 100) + (toolOutput.length > 100 ? '...' : ''));
            
            if (toolOutput) {
              this.toolOutputBuffer += toolOutput;
              fullContent += toolOutput;
              updateContentStats(toolOutput);
              callbacks.onContent(toolOutput);
            }
            
            // Check if this tool_result indicates completion
            if (data.is_final || data.final || data.complete) {
              console.log("🔧 Tool execution completed. Total buffer length:", this.toolOutputBuffer.length);
              this.isToolOutputStreaming = false;
              callbacks.onToolEnd();
            }
            break;

          case 'message_stop':
          case 'complete':
            if (!isComplete) {
              console.log(`✅ Stream completed with ${data.type}. Final content length: ${fullContent.length}`);
              // Add a small delay to ensure all content is processed
              setTimeout(() => {
                if (!isComplete) {
                  isComplete = true;
                  if (this.contentTimeout) clearTimeout(this.contentTimeout);
                  // If we were streaming tool output, end it now
                  if (this.isToolOutputStreaming) {
                    console.log("🔧 Force-ending tool output on stream completion. Buffer length:", this.toolOutputBuffer.length);
                    this.isToolOutputStreaming = false;
                    callbacks.onToolEnd();
                  }
                  callbacks.onComplete(fullContent);
                  this.cleanup(messageHandler);
                }
              }, 100); // 100ms delay
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
    // Clear timeout on cleanup
    if (this.contentTimeout) {
      clearTimeout(this.contentTimeout);
      this.contentTimeout = null;
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