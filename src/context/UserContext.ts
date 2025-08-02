
import React, { createContext, useContext } from "react";
import { User, InitialResponse } from "@/types";

interface UserContextType {
  user: User | null;
  userIdea: string | null;
  initialResponse: InitialResponse | null;
  isProcessingIdea: boolean;
  isAuthenticated: boolean;
  sessionId: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  setUserIdea: (idea: string) => void;
  sendIdeaWithAuth: (idea: string) => Promise<{ success: boolean; session_id?: string; message?: string }>;
  clearInitialResponse: () => void;
}

// Create context with default
export const UserContext = createContext<UserContextType>({
  user: null,
  userIdea: null,
  initialResponse: null,
  isProcessingIdea: false,
  isAuthenticated: false,
  sessionId: null,
  login: async () => ({ success: false }),
  logout: () => {},
  signup: async () => ({ success: false }),
  setUserIdea: () => {},
  sendIdeaWithAuth: async () => ({ success: false }),
  clearInitialResponse: () => {},
});

// Hook
export const useUser = () => useContext(UserContext);
