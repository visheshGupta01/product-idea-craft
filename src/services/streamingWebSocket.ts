import { WS_BASE_URL } from "@/config/api";
import { WebSocketMessage, StreamingCallbacks } from "@/types/websocketEvents";

export type { StreamingCallbacks } from "@/types/websocketEvents";

export class StreamingWebSocketClient {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private pingInterval: number | null = null; // Added for heartbeat

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem("auth_token");
        const wsUrl =
          WS_BASE_URL +
          `/api/chat/ws?session_id=${this.sessionId}${
            token ? `&token=${token}` : ""
          }`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.startHeartbeat(); // Start pinging when connected
          resolve();
        };

        this.ws.onerror = (error) => {
          reject(error);
        };

        this.ws.onclose = () => {
          this.stopHeartbeat(); // Stop pinging when closed
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    // Send a ping every 20 seconds (Backend timeout is 60s)
    this.pingInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ 
          model: "heartbeat", 
          message: "ping" 
        }));
      }
    }, 20000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.connect().catch();
      }, this.reconnectDelay);
    }
  }

  private currentMessageHandler: ((event: MessageEvent) => void) | null = null;

  async sendStreamingMessage(
    message: string,
    model: string,
    callbacks: StreamingCallbacks
  ): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    let fullContent = "";
    let isComplete = false;

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;

      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        // Ignore heartbeat responses from server if any
        if ((data.event as string) === "heartbeat") return;

        if (!data.event) {
            if (data.success === true) {
                isComplete = true;
                callbacks.onSuccess?.("Stream completed");
                this.cleanup(messageHandler);
                return;
            }
          return;
        }

        const eventType = data.event;
        const msgText = data.message || "";

        switch (eventType) {
          case "pricing_low":
            isComplete = true;
            callbacks.onPricingLow(msgText);
            this.cleanup(messageHandler);
            break;
          case "text_body":
            fullContent += msgText;
            callbacks.onContent(msgText);
            break;
          case "process_progress":
            callbacks.onProgressStart(msgText);
            break;
          case "process_done":
            callbacks.onProgressDone(msgText);
            break;
          case "tool_start":
            callbacks.onToolStart(msgText);
            break;
          case "tool_output":
            fullContent += msgText;
            callbacks.onToolOutput(msgText);
            break;
          case "tool_complete":
            callbacks.onToolComplete(msgText);
            break;
          case "tool_error":
            callbacks.onToolError(msgText);
            break;
          case "stream_start":
            callbacks.onStreamStart();
            break;
          case "stream_end":
            if (!isComplete) {
              isComplete = true;
              callbacks.onStreamEnd();
              this.cleanup(messageHandler);
            }
            break;
          case "stream_error":
            if (!isComplete) {
              isComplete = true;
              callbacks.onStreamError(msgText);
              this.cleanup(messageHandler);
            }
            break;
          case "thinking":
            callbacks.onThinking();
            break;
          case "generating":
            callbacks.onGenerating();
            break;
          case "error":
            if (!isComplete) {
              isComplete = true;
              callbacks.onError(new Error(msgText || "Unknown error"));
              this.cleanup(messageHandler);
            }
            break;
          case "success":
            if (!isComplete) {
              isComplete = true;
              callbacks.onSuccess(msgText);
              this.cleanup(messageHandler);
            }
            break;
          case "info":
            callbacks.onInfo(msgText);
            break;
          case "preview":
            callbacks.onPreviewStart(msgText);
            break;
          case "preview_done":
            callbacks.onPreviewDone(msgText);
            break;
          case "preview_error":
            callbacks.onPreviewError(msgText);
            break;
          default:
            if (msgText) {
              fullContent += msgText;
              callbacks.onContent(msgText);
            }
        }
      } catch {
        if (typeof event.data === "string" && event.data.trim() !== "") {
          fullContent += event.data;
          callbacks.onContent(event.data);
        }
      }
    };

    if (this.currentMessageHandler) {
      this.ws?.removeEventListener("message", this.currentMessageHandler);
    }

    this.currentMessageHandler = messageHandler;
    this.ws.addEventListener("message", messageHandler);

    try {
      this.ws.send(
        JSON.stringify({
          model,
          message,
          session_id: this.sessionId,
          stream: true,
        })
      );
    } catch (error) {
      this.cleanup(messageHandler);
      throw error;
    }
  }

  private cleanup(messageHandler: (event: MessageEvent) => void) {
    this.ws?.removeEventListener("message", messageHandler);
  }

  stopGeneration() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ 
        message: "stop",
        model: "Kimik2"
     }));
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}