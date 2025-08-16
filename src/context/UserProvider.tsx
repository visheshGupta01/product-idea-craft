
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
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication and restore chat state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const role = authService.getUserRole();
        const storedSessionId = authService.getSessionId();
        const storedUserIdea = authService.getUserIdea();
        
        if (token && role) {
          setIsAuthenticated(true);
          setUserRole(role);
          if (storedSessionId) {
            setSessionId(storedSessionId);
          }
          if (storedUserIdea) {
            setUserIdea(storedUserIdea);
          }
        }
      } catch (error) {
        console.error('Error during auth check:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setIsAuthenticated(true);
      setUserRole(result.role || null);
      if (result.session_id) {
        setSessionId(result.session_id);
      }
    }
    return { success: result.success, message: result.message, role: result.role };
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
    setSessionId(null);
    setUserIdea(null);
    setInitialResponse(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    const result = await authService.signup(name, email, password);
    console.log('Signup result:', result); 
    return { success: result.success, message: result.message };
  };

  const verifyEmail = async (token: string) => {
    const result = await authService.verifyEmail(token);
    return { success: result.success, message: result.message };
  };

  const forgotPassword = async (email: string) => {
    const result = await authService.forgotPassword(email);
    return { success: result.success, message: result.message };
  };

  const resetPassword = async (token: string, newPassword: string, confirmPassword: string) => {
    const result = await authService.resetPassword(token, newPassword, confirmPassword);
    return { success: result.success, message: result.message };
  };

  const refreshToken = async () => {
    const result = await authService.refreshAccessToken();
    if (result.success) {
      setIsAuthenticated(true);
      setUserRole(result.role || null);
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
        // Persist the user idea to localStorage
        authService.setUserIdea(idea);
        
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
      userRole,
      isLoading,
      login, 
      logout, 
      signup,
      verifyEmail,
      forgotPassword,
      resetPassword,
      refreshToken,
      setUserIdea,
      sendIdeaWithAuth,
      clearInitialResponse
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
