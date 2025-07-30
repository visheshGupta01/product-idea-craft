
import React, { createContext, useContext } from "react";
import { User, InitialMcpResponse } from "@/types";

interface UserContextType {
  user: User | null;
  userIdea: string | null;
  initialMcpResponse: InitialMcpResponse | null;
  isProcessingIdea: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, verified: boolean) => Promise<void>;
  setUserIdea: (idea: string) => void;
  sendIdeaToMcp: (idea: string) => Promise<void>;
  clearInitialResponse: () => void;
}

// Create context with default
export const UserContext = createContext<UserContextType>({
  user: null,
  userIdea: null,
  initialMcpResponse: null,
  isProcessingIdea: false,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  setUserIdea: () => {},
  sendIdeaToMcp: async () => {},
  clearInitialResponse: () => {},
});

// Hook
export const useUser = () => useContext(UserContext);
