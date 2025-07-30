// Core type definitions
export interface User {
  name: string;
  email: string;
  avatar: string;
  verified?: boolean;
}

export interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface InitialMcpResponse {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
}

export interface ServerResponse {
  assistant: string;
  tools?: Array<{
    name: string;
    output: string | null;
  }>;
}

export interface ChatPanelProps {
  userIdea: string;
  mcpServerUrl?: string;
}