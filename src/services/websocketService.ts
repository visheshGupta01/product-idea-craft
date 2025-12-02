import { WS_BASE_URL } from "@/config/api";

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
        const token = localStorage.getItem("auth_token");
        const wsUrl =
          WS_BASE_URL +
          `/api/chat/ws?session_id=${this.sessionId}${
            token ? `&token=${token}` : ""
          }`;
        //console.log(wsUrl)
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          //console.log("WebSocket connected");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          //console.error("WebSocket error:", error);
          reject(error);
        };

        this.ws.onclose = () => {
          //console.log("WebSocket disconnected");
          this.handleReconnect();
        };
      } catch (error) {
        //console.error("Error creating WebSocket:", error);
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      // console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

      setTimeout(() => {
        this.connect().catch((error) => console.error(error));
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
        this.ws.send(
          JSON.stringify({
            message,
            session_id: this.sessionId,
          })
        );
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

      let fullResponseContent = "";
      let isComplete = false;

      const messageHandler = (event: MessageEvent) => {
        // Prevent processing after completion
        if (isComplete) return;

        try {
          const data = JSON.parse(event.data);
          const eventType = data.Event;
          const message = data.Message;

          // Handle different event types
          switch (eventType) {
            case "text_body":
              // Regular text content - stream it immediately
              if (message) {
                onChunk(message);
                fullResponseContent += message;
              }
              break;

            case "tool_start":
            case "process_progress":
              // Tool/process started - notify UI
              onToolStart?.();
              break;

            case "tool_output":
              // Tool output - add to response
              if (message) {
                onChunk(message);
                fullResponseContent += message;
              }
              break;

            case "tool_complete":
            case "tool_error":
            case "process_done":
              // Tool/process finished - notify UI
              onToolEnd?.();
              break;

            case "stream_end":
            case "success":
              // Stream is complete
              if (!isComplete) {
                isComplete = true;
                onToolEnd?.();
                onComplete(fullResponseContent);
                this.ws?.removeEventListener("message", messageHandler);
                resolve();
              }
              break;

            case "stream_error":
            case "error":
              // Handle error response
              if (!isComplete) {
                isComplete = true;
                this.ws?.removeEventListener("message", messageHandler);
                reject(new Error(message || "WebSocket error"));
              }
              break;

            case "pricing_low":
              // Balance/pricing issue - treat as error
              if (!isComplete) {
                isComplete = true;
                this.ws?.removeEventListener("message", messageHandler);
                reject(new Error(message || "Insufficient balance"));
              }
              break;

            case "thinking":
            case "generating":
            case "stream_start":
              // Status updates - could be used for UI indicators
              onToolStart?.();
              break;

            case "preview":
            case "preview_done":
              // Preview events - pass through as content if message exists
              if (message) {
                onChunk(message);
                fullResponseContent += message;
              }
              break;

            case "info":
              // Info messages - pass through
              if (message) {
                onChunk(message);
                fullResponseContent += message;
              }
              break;

            default:
              // Fallback for unknown events with message
              if (message) {
                onChunk(message);
                fullResponseContent += message;
              }
          }
        } catch (parseError) {
          console.warn(
            "Failed to parse WebSocket message:",
            event.data,
            parseError
          );
        }
      };

      // Remove any existing listeners to prevent duplicates
      this.ws.removeEventListener("message", messageHandler);

      // Add message listener
      this.ws.addEventListener("message", messageHandler);

      // Send the message
      try {
        this.ws.send(
          JSON.stringify({
            message,
            session_id: this.sessionId,
            stream: true,
          })
        );
      } catch (error) {
        this.ws.removeEventListener("message", messageHandler);
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
