interface WebSocketMessage {
  type: 'user_message' | 'ai_response' | 'tool_start' | 'tool_end' | 'error';
  content?: string;
  session_id?: string;
  chunk?: string;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 1000;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  async createSession(): Promise<string> {
    try {
      const response = await fetch('/create/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create session');
      }
      
      const data = await response.json();
      this.sessionId = data.session_id;
      return this.sessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  connect(sessionId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (sessionId) {
          this.sessionId = sessionId;
        }

        const wsUrl = `ws://localhost:8080/ws${this.sessionId ? `?session_id=${this.sessionId}` : ''}`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.attemptReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleMessage(message: WebSocketMessage) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect(this.sessionId || undefined);
      }, this.reconnectInterval * this.reconnectAttempts);
    }
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type: 'user_message',
        content,
        session_id: this.sessionId || undefined,
      };
      this.ws.send(JSON.stringify(message));
    } else {
      throw new Error('WebSocket is not connected');
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  offMessage(type: string) {
    this.messageHandlers.delete(type);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const websocketService = new WebSocketService();