import React, { createContext, useContext } from "react";

// Define types
interface User {
    name: string;
    email: string;
    avatar: string;
    verified?: boolean
  }

interface UserContextType {
  user: User | null;
  userIdea: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, verified: boolean) => Promise<void>;
  setUserIdea: (idea: string) => void;
}

// Create context with default
export const UserContext = createContext<UserContextType>({
  user: null,
  userIdea: null,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
  setUserIdea: () => {},
});

// Hook
export const useUser = () => useContext(UserContext);