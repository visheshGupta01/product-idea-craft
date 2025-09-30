import { buildWsUrl } from "@/config/api";

export interface SupportMessage {
  message: string;
  task_id: number;
  sender_id: string;
  receiver_id: string;
  role: string;
}

export class SupportWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private messageHandlers: ((message: any) => void)[] = [];

  connect(token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = buildWsUrl("/api/chat/support", { token });
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log("Support WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          console.error("Support WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("Support WebSocket disconnected");
          this.handleReconnect();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.messageHandlers.forEach(handler => handler(data));
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private storedToken: string = "";

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => {
        this.connect(this.storedToken).catch(console.error);
      }, 2000 * this.reconnectAttempts);
    }
  }

  setToken(token: string) {
    this.storedToken = token;
  }

  sendMessage(message: SupportMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  }

  onMessage(handler: (message: any) => void) {
    this.messageHandlers.push(handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers = [];
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
