
import { ReactNode, useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { User, InitialResponse } from "@/types";
import { authService } from "@/services/authService";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userIdea, setUserIdea] = useState<string | null>(null);
  const [initialResponse, setInitialResponse] = useState<InitialResponse | null>(null);
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const result = await authService.validateToken();
      if (result.success && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        const storedSessionId = authService.getSessionId();
        setSessionId(storedSessionId);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      if (result.session_id) {
        setSessionId(result.session_id);
      }
    }
    return { success: result.success, message: result.message };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setSessionId(null);
    setUserIdea(null);
    setInitialResponse(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await authService.signup(name, email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setIsAuthenticated(true);
      if (result.session_id) {
        setSessionId(result.session_id);
      }
    }
    return { success: result.success, message: result.message };
  };

  const sendIdeaWithAuth = async (idea: string) => {
    if (!isAuthenticated) {
      return { success: false, message: "Please login first" };
    }

    setIsProcessingIdea(true);
    
    try {
      // Create session with the idea
      const result = await authService.createSessionWithIdea(idea);
      
      if (result.success && result.session_id) {
        setSessionId(result.session_id);
        setUserIdea(idea);
        
        // Create initial response for display
        const initialResponse: InitialResponse = {
          userMessage: idea,
          aiResponse: "",
          timestamp: new Date(),
        };
        setInitialResponse(initialResponse);
        
        return { success: true, session_id: result.session_id };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error creating session with idea:", error);
      return { success: false, message: "Failed to process idea" };
    } finally {
      setIsProcessingIdea(false);
    }
  };

  const clearInitialResponse = () => {
    setInitialResponse(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userIdea, 
      initialResponse,
      isProcessingIdea,
      isAuthenticated,
      sessionId,
      login, 
      logout, 
      signup, 
      setUserIdea,
      sendIdeaWithAuth,
      clearInitialResponse
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
