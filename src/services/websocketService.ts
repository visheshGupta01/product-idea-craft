import { WebSocketMessage, MCPRequest, MCPResponse, ChatMessage, ToolOutput } from '../types/chat';

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageHandlers: Map<string, (message: WebSocketMessage) => void> = new Map();
  private requestQueue: MCPRequest[] = [];
  private pendingRequests: Map<string, (response: MCPResponse) => void> = new Map();
  
  private baseUrl = 'ws://localhost:8000';
  private sessionId: string | null = null;
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
  }

  async connect(sessionId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.sessionId = sessionId;
        const wsUrl = `${this.baseUrl}/ws/${sessionId}`;
        
        this.ws = new WebSocket(wsUrl);
        
        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          
          // Send authentication if token exists
          if (this.token) {
            this.sendMessage({
              type: 'auth',
              data: { token: this.token }
            });
          }
          
          // Process queued requests
          this.processRequestQueue();
          resolve(true);
        };
        
        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };
        
        this.ws.onclose = (event) => {
          console.log('WebSocket closed:', event.code, event.reason);
          this.handleDisconnect();
        };
        
        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
        
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.sessionId = null;
    this.messageHandlers.clear();
    this.pendingRequests.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  sendMessage(message: WebSocketMessage): void {
    if (!this.isConnected()) {
      console.warn('WebSocket not connected, queueing message');
      return;
    }

    try {
      this.ws!.send(JSON.stringify(message));
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
    }
  }

  sendChatMessage(content: string, messageId: string): void {
    this.sendMessage({
      type: 'message',
      data: {
        content,
        messageId,
        timestamp: new Date().toISOString()
      },
      messageId
    });
  }

  sendMCPRequest(request: MCPRequest): Promise<MCPResponse> {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        this.requestQueue.push(request);
        reject(new Error('WebSocket not connected'));
        return;
      }

      this.pendingRequests.set(request.id, resolve);
      
      this.sendMessage({
        type: 'mcp_request',
        data: request,
        messageId: request.id
      });

      // Set timeout for request
      setTimeout(() => {
        if (this.pendingRequests.has(request.id)) {
          this.pendingRequests.delete(request.id);
          reject(new Error('MCP request timeout'));
        }
      }, 30000);
    });
  }

  onMessage(handler: (message: WebSocketMessage) => void): () => void {
    const id = Math.random().toString(36);
    this.messageHandlers.set(id, handler);
    
    return () => {
      this.messageHandlers.delete(id);
    };
  }

  onToolOutput(handler: (toolOutput: ToolOutput) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'tool_output' && message.data) {
        handler({
          toolName: message.data.toolName || 'unknown',
          content: message.data.content || '',
          timestamp: new Date(message.data.timestamp || Date.now()),
          status: message.data.status || 'success'
        });
      }
    });
  }

  onStreamingMessage(handler: (content: string, messageId: string, isComplete: boolean) => void): () => void {
    return this.onMessage((message) => {
      if (message.type === 'message' && message.data) {
        const { content, messageId, isComplete } = message.data;
        handler(content || '', messageId || '', isComplete || false);
      }
    });
  }

  private handleMessage(message: WebSocketMessage): void {
    // Handle MCP responses
    if (message.type === 'mcp_response' && message.messageId) {
      const resolver = this.pendingRequests.get(message.messageId);
      if (resolver) {
        resolver(message.data as MCPResponse);
        this.pendingRequests.delete(message.messageId);
        return;
      }
    }

    // Broadcast to all handlers
    this.messageHandlers.forEach(handler => {
      try {
        handler(message);
      } catch (error) {
        console.error('Error in message handler:', error);
      }
    });
  }

  private handleDisconnect(): void {
    this.ws = null;
    
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.sessionId) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (this.sessionId) {
          this.connect(this.sessionId);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private processRequestQueue(): void {
    while (this.requestQueue.length > 0 && this.isConnected()) {
      const request = this.requestQueue.shift();
      if (request) {
        this.sendMCPRequest(request);
      }
    }
  }
}

export const websocketService = new WebSocketService();