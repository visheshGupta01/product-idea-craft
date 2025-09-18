
import React, { createContext, useContext } from "react";
import { User, InitialResponse } from "@/types";
import { ProfileData } from "@/services/profileService";

interface UserContextType {
  user: User | null;
  profile: ProfileData | null;
  userIdea: string | null;
  initialResponse: InitialResponse | null;
  isProcessingIdea: boolean;
  isAuthenticated: boolean;
  sessionId: string | null;
  userRole: 'admin' | 'user' | 'developer' | null;
  isLoading: boolean;
  userPlan: {
    planId: number;
    planName: string;
    isActive: boolean;
    expiresAt: string | null;
  } | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: 'admin' | 'user' | 'developer' }>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  verifyEmail: (token: string) => Promise<{ success: boolean; message?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (token: string, newPassword: string, confirm_password: string) => Promise<{ success: boolean; message?: string }>;
  refreshToken: () => Promise<{ success: boolean; message?: string }>;
  setUserIdea: (idea: string) => void;
  setSessionId: (sessionId: string) => void;
  sendIdeaWithAuth: (idea: string) => Promise<{ success: boolean; session_id?: string; message?: string }>;
  clearInitialResponse: () => void;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<{ success: boolean; message?: string }>;
}

// Create context with default
export const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  userIdea: null,
  initialResponse: null,
  isProcessingIdea: false,
  isAuthenticated: false,
  sessionId: null,
  userRole: null,
  isLoading: true,
  userPlan: null,
  login: async () => ({ success: false }),
  logout: () => {},
  signup: async () => ({ success: false }),
  verifyEmail: async () => ({ success: false }),
  forgotPassword: async () => ({ success: false }),
  resetPassword: async () => ({ success: false }),
  refreshToken: async () => ({ success: false }),
  setUserIdea: () => {},
  setSessionId: () => {},
  sendIdeaWithAuth: async () => ({ success: false }),
  clearInitialResponse: () => {},
  fetchProfile: async () => {},
  updateProfile: async () => ({ success: false }),
});

// Hook
export const useUser = () => useContext(UserContext);
