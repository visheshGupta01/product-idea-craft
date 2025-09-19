import { API_ENDPOINTS, buildWsUrl } from '@/config/api';

export interface StreamingMessage {
  type: "user" | "assistant" | "error" | "tool" | "complete";
  content: string;
  timestamp: Date;
  tool?: {
    name: string;
    output: string | null;
  };
}

export class StreamingWebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private isConnected: boolean = false;
  private messageQueue: string[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log("Connecting to streaming WebSocket...");
        const wsUrl = buildWsUrl(API_ENDPOINTS.CHAT.WEBSOCKET, { session_id: this.sessionId });
        console.log("WebSocket URL:", wsUrl);
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log("Streaming WebSocket connected");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          
          // Send any queued messages
          while (this.messageQueue.length > 0) {
            const message = this.messageQueue.shift();
            if (message && this.ws) {
              this.ws.send(message);
            }
          }
          
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error("Streaming WebSocket error:", error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = (event) => {
          console.log("Streaming WebSocket closed:", event.code, event.reason);
          this.isConnected = false;
          
          // Attempt to reconnect if not manually closed
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => {
              this.connect();
            }, 2000 * this.reconnectAttempts);
          }
        };

      } catch (error) {
        console.error("Failed to create WebSocket connection:", error);
        reject(error);
      }
    });
  }

  sendMessage(message: string): void {
    if (this.isConnected && this.ws) {
      console.log("Sending message:", message);
      this.ws.send(message);
    } else {
      console.log("WebSocket not connected, queuing message");
      this.messageQueue.push(message);
    }
  }

  onMessage(callback: (message: StreamingMessage) => void): void {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received streaming message:", data);
          
          const streamingMessage: StreamingMessage = {
            type: data.type || "assistant",
            content: data.content || data.message || "",
            timestamp: new Date(),
            tool: data.tool
          };
          
          callback(streamingMessage);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          callback({
            type: "error",
            content: "Failed to parse message",
            timestamp: new Date()
          });
        }
      };
    }
  }

  disconnect(): void {
    if (this.ws) {
      console.log("Disconnecting streaming WebSocket");
      this.isConnected = false;
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }
  }

  isConnectionOpen(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}