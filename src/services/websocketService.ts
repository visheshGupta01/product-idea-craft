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
          
          // Process different types of streaming data
          if (data.type === 'text' && data.content) {
            // Regular text content - stream it immediately
            onChunk(data.content);
            fullResponseContent += data.content;
          } else if (data.type === 'tool_start') {
            // Tool processing started - notify UI
            onToolStart?.();
          } else if (data.type === 'tool_result' && data.tool) {
            // Tool result - process and add to full response
            onToolEnd?.(); // Tool finished processing
            let toolOutput = '';
            
            if (data.tool.name === "sitemap_user_idea" && typeof data.tool.output === "object") {
              // Handle structured sitemap data
              const sitemapData = data.tool.output;
              toolOutput = `\n\n## Project Sitemap\n\n__SITEMAP_DATA__${JSON.stringify(sitemapData)}__SITEMAP_DATA__`;
            } else {
              // Handle regular string output
              toolOutput = data.tool.output?.toString().trim() || '';
              if (toolOutput) {
                const sectionTitle = data.tool.name
                  .replace(/[_-]/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                toolOutput = `\n\n## ${sectionTitle}\n\n${toolOutput}`;
              }
            }
            
            if (toolOutput) {
              onChunk(toolOutput);
              fullResponseContent += toolOutput;
            }
          } else if (data.type === 'complete') {
            // Stream is complete
            onToolEnd?.(); // Ensure tool state is cleared
            onComplete(fullResponseContent);
            this.ws?.removeEventListener('message', messageHandler);
            resolve();
          } else if (data.type === 'error') {
            // Handle error response
            this.ws?.removeEventListener('message', messageHandler);
            reject(new Error(data.message || 'WebSocket error'));
          }
        } catch (parseError) {
          console.warn("Failed to parse WebSocket message:", event.data, parseError);
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