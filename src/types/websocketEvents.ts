// WebSocket Event Types from backend
export type WebSocketEventType =
  | "pricing_low"
  | "text_body"
  | "process_progress"
  | "process_done"
  | "tool_start"
  | "tool_output"
  | "tool_complete"
  | "tool_error"
  | "stream_start"
  | "stream_end"
  | "stream_error"
  | "thinking"
  | "generating"
  | "error"
  | "success"
  | "info"
  | "preview"
  | "preview_done"
  | "preview_error";

// WebSocket message structure from backend
export interface WebSocketMessage {
  Event: WebSocketEventType;
  Message: string;
  CreatedAt: string;
}

// UI Status types for different states
export type ChatStatus =
  | "idle"
  | "thinking"
  | "generating"
  | "streaming"
  | "tool_running"
  | "preview_generating"
  | "error";

// Extended callbacks for all events
export interface StreamingCallbacks {
  onContent: (text: string) => void;
  onToolStart: (message?: string) => void;
  onToolOutput: (message: string) => void;
  onToolComplete: (message?: string) => void;
  onToolError: (message: string) => void;
  onStreamStart: () => void;
  onStreamEnd: () => void;
  onStreamError: (message: string) => void;
  onThinking: () => void;
  onGenerating: () => void;
  onPreviewStart: (message?: string) => void;
  onPreviewDone: (message?: string) => void;
  onPreviewError: (message: string) => void;
  onProgressStart: (message?: string) => void;
  onProgressDone: (message?: string) => void;
  onPricingLow: (message: string) => void;
  onError: (error: Error) => void;
  onSuccess: (message?: string) => void;
  onInfo: (message: string) => void;
}
