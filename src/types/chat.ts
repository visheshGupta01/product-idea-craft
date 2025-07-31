export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isStreaming?: boolean;
  toolOutputs?: ToolOutput[];
}

export interface ToolOutput {
  toolName: string;
  content: string;
  timestamp: Date;
  status: 'success' | 'error' | 'running';
}

export interface WebSocketMessage {
  type: 'message' | 'tool_output' | 'error' | 'stream_start' | 'stream_end' | 'auth' | 'mcp_request' | 'mcp_response';
  data: any;
  messageId?: string;
}

export interface MCPRequest {
  id: string;
  method: string;
  params: any;
}

export interface MCPResponse {
  id: string;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export interface StreamingState {
  isConnected: boolean;
  isStreaming: boolean;
  currentMessageId: string | null;
  error: string | null;
}