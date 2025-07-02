import React, { createContext, useContext, useState, ReactNode } from "react";

// Define types
interface User {
    name: string;
    email: string;
    avatar: string;
    verified?: boolean
  }

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string, verified: boolean) => Promise<void>;
}

// Create context with default
export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  signup: async () => {},
});

// Hook
export const useUser = () => useContext(UserContext);