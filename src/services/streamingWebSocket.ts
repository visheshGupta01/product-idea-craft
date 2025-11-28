import { WS_BASE_URL } from "@/config/api";
import { WebSocketMessage, StreamingCallbacks } from "@/types/websocketEvents";

export type { StreamingCallbacks } from "@/types/websocketEvents";

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
        const token = localStorage.getItem("auth_token");
        const wsUrl =
          WS_BASE_URL +
          `/api/chat/ws?session_id=${this.sessionId}${
            token ? `&token=${token}` : ""
          }`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onerror = (error) => {
          reject(error);
        };

        this.ws.onclose = () => {
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;

      setTimeout(() => {
        this.connect().catch();
      }, this.reconnectDelay);
    }
  }

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
        const eventType = data.Event;
        const message = data.Message || "";

        switch (eventType) {
          case "pricing_low":
            // Insufficient balance - trigger popup
            isComplete = true;
            callbacks.onPricingLow(message);
            this.cleanup(messageHandler);
            break;

          case "text_body":
            // Normal text streaming
            fullContent += message;
            callbacks.onContent(message);
            break;

          case "process_progress":
            // Frontend generation in progress
            callbacks.onProgressStart(message);
            break;

          case "process_done":
            // Frontend generation completed
            callbacks.onProgressDone(message);
            break;

          case "tool_start":
            // Tool is called and working
            callbacks.onToolStart(message);
            break;

          case "tool_output":
            // Output from a tool
            fullContent += message;
            callbacks.onToolOutput(message);
            break;

          case "tool_complete":
            // Tool call completed
            callbacks.onToolComplete(message);
            break;

          case "tool_error":
            // Tool error
            callbacks.onToolError(message);
            break;

          case "stream_start":
            // Streaming should start
            callbacks.onStreamStart();
            break;

          case "stream_end":
            // Streaming should end
            if (!isComplete) {
              isComplete = true;
              callbacks.onStreamEnd();
              this.cleanup(messageHandler);
            }
            break;

          case "stream_error":
            // Streaming error
            if (!isComplete) {
              isComplete = true;
              callbacks.onStreamError(message);
              this.cleanup(messageHandler);
            }
            break;

          case "thinking":
            // MCP is thinking
            callbacks.onThinking();
            break;

          case "generating":
            // Frontend is being generated
            callbacks.onGenerating();
            break;

          case "error":
            // General error
            if (!isComplete) {
              isComplete = true;
              callbacks.onError(new Error(message || "Unknown error"));
              this.cleanup(messageHandler);
            }
            break;

          case "success":
            // MCP response completed successfully
            if (!isComplete) {
              isComplete = true;
              callbacks.onSuccess(message);
              this.cleanup(messageHandler);
            }
            break;

          case "info":
            // Info message
            callbacks.onInfo(message);
            break;

          case "preview":
            // Preview is being generated
            callbacks.onPreviewStart(message);
            break;

          case "preview_done":
            // Preview is generated
            callbacks.onPreviewDone(message);
            break;

          case "preview_error":
            // Error generating preview
            callbacks.onPreviewError(message);
            break;

          default:
            // Unknown event - log and pass as content if has message
            console.warn("Unknown WebSocket event:", eventType, message);
            if (message) {
              fullContent += message;
              callbacks.onContent(message);
            }
        }
      } catch (parseError) {
        // Not valid JSON - could be raw text (fallback)
        console.warn("Failed to parse WebSocket message:", event.data);
        if (typeof event.data === "string" && !isComplete) {
          fullContent += event.data;
          callbacks.onContent(event.data);
        }
      }
    };

    // Clean setup
    this.cleanup(messageHandler);
    this.ws.addEventListener("message", messageHandler);

    // Send message
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
      this.ws.send(JSON.stringify({ message: "stop" }));
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
