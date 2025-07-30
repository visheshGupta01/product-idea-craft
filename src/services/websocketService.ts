import { ServerResponse } from "@/types";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://localhost:8000/ws?s_id=${this.sessionId}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket disconnected");
          this.handleReconnect();
        };
      } catch (error) {
        console.error("Error creating WebSocket:", error);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay);
    }
  }

  sendMessage(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      try {
        this.ws.send(JSON.stringify({
          message,
          session_id: this.sessionId,
        }));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  sendMessageStream(
    message: string,
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void,
    onToolStart?: () => void,
    onToolEnd?: () => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      let fullResponseContent = '';

      const messageHandler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received WebSocket message:", data);
          
          // Handle different types of messages
          if (data.type === 'content' && data.text) {
            // Regular text content - stream it immediately
            onChunk(data.text);
            fullResponseContent += data.text;
          } else if (data.type === 'tool_use') {
            // Tool processing started - notify UI
            onToolStart?.();
          } else if (data.type === 'tool_result') {
            // Tool result - process and add to full response
            onToolEnd?.(); // Tool finished processing
            let toolOutput = '';
            
            if (data.content && Array.isArray(data.content)) {
              // Handle array of content blocks
              data.content.forEach((block: any) => {
                if (block.type === 'text' && block.text) {
                  toolOutput += block.text;
                }
              });
            } else if (data.content && typeof data.content === 'string') {
              toolOutput = data.content;
            }
            
            if (toolOutput) {
              onChunk(toolOutput);
              fullResponseContent += toolOutput;
            }
          } else if (data.type === 'message_stop' || data.type === 'complete') {
            // Stream is complete
            onToolEnd?.(); // Ensure tool state is cleared
            onComplete(fullResponseContent);
            this.ws?.removeEventListener('message', messageHandler);
            resolve();
          } else if (data.type === 'error') {
            // Handle error response
            this.ws?.removeEventListener('message', messageHandler);
            reject(new Error(data.message || 'WebSocket error'));
          } else if (data.text) {
            // Fallback for simple text messages
            onChunk(data.text);
            fullResponseContent += data.text;
          }
        } catch (parseError) {
          console.warn("Failed to parse WebSocket message:", event.data, parseError);
          // Try to handle as plain text
          if (typeof event.data === 'string') {
            onChunk(event.data);
            fullResponseContent += event.data;
          }
        }
      };

      // Add message listener
      this.ws.addEventListener('message', messageHandler);

      // Send the message
      try {
        this.ws.send(JSON.stringify({
          message,
          session_id: this.sessionId,
          stream: true,
        }));
      } catch (error) {
        this.ws.removeEventListener('message', messageHandler);
        reject(error);
      }
    });
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