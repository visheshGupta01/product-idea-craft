import { WS_BASE_URL } from "@/config/api";

export interface StreamingMessage {
  type: "done" | "error";
  tool?: string;
  text?: string;
  message?: string;
  success?: boolean;
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
    callbacks: StreamingCallbacks
  ): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }

    let fullContent = "";
    let isComplete = false;
    let isInToolMode = false;

    const messageHandler = (event: MessageEvent) => {
      if (isComplete) return;


      // Handle JSON messages (completion signals)
      try {
        const data: any = JSON.parse(event.data);

        // Handle completion signal from backend
        if (data.success) {
          if (!isComplete) {
            isComplete = true;
            if (isInToolMode) {
              callbacks.onToolEnd();
            }
            callbacks.onComplete(fullContent);
            this.cleanup(messageHandler);
          }
          return;
        }

        // Handle error messages
        if (data.type === "error") {
          if (!isComplete) {
            isComplete = true;
            this.cleanup(messageHandler);
            callbacks.onError(
              new Error(data.message || "WebSocket streaming error")
            );
          }
          return;
        }
      } catch (parseError) {
        // Not JSON, handle as text content
        if (typeof event.data === "string" && !isComplete) {
          const content = event.data;

          // Detect tool output by looking for tool output patterns
          if (content.includes("[Tool Use Started]:")) {
        //    console.log("Detected tool usage start");
            isInToolMode = true;
            callbacks.onToolStart();
            fullContent += content;
            callbacks.onContent(content);
          } else if (
            content.includes("[Tool Output for") &&
            content.includes("]:")
          ) {
            if (isInToolMode) {
              callbacks.onToolEnd();
              isInToolMode = false;
            }
            fullContent += content;
            callbacks.onContent(content);
          } else {
            // Regular streaming text content
            fullContent += content;
            callbacks.onContent(content);
          }
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
