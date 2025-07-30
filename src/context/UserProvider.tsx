
import { ReactNode, useState } from "react";
import { UserContext } from "./UserContext";
import { User, InitialMcpResponse } from "@/types";
import { mcpService } from "@/services/mcpService";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userIdea, setUserIdea] = useState<string | null>(null);
  const [initialMcpResponse, setInitialMcpResponse] = useState<InitialMcpResponse | null>(null);
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);

  const login = async (email: string, password: string) => {
    // In real app: send request to backend
    const userData = {
      name: email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    };
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const signup = async (name: string, email: string, password: string) => {
    // In real app: send signup request to backend
    const userData = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      verified: false, // Initially not verified
    };
    setUser(userData);
  };

  const sendIdeaToMcp = async (idea: string) => {
    setIsProcessingIdea(true);
    
    // Create initial response object for streaming
    const initialResponse: InitialMcpResponse = {
      userMessage: idea,
      aiResponse: "",
      timestamp: new Date(),
    };
    setInitialMcpResponse(initialResponse);
    
    try {
      let streamingContent = "";
      
      await mcpService.sendMessageStream(
        idea,
        // onChunk: update response as chunks arrive
        (chunk: string) => {
          streamingContent += chunk;
          setInitialMcpResponse({
            userMessage: idea,
            aiResponse: streamingContent,
            timestamp: new Date(),
          });
        },
        // onComplete: final processing
        (fullResponse: string) => {
          setInitialMcpResponse({
            userMessage: idea,
            aiResponse: fullResponse,
            timestamp: new Date(),
          });
        }
      );
      
    } catch (error) {
      console.error("Error sending idea to MCP server:", error);
      
      // Fallback response
      setInitialMcpResponse({
        userMessage: idea,
        aiResponse: `## Welcome! 🚀

I've received your idea: "${idea}"

I'm ready to help you build it step by step. Let's start by analyzing your requirements and creating a comprehensive development plan.

Please let me know if you'd like to:
- Discuss the technical architecture
- Plan the user interface
- Define the core features
- Explore implementation options`,
        timestamp: new Date(),
      });
    } finally {
      setIsProcessingIdea(false);
    }
  };

  const clearInitialResponse = () => {
    setInitialMcpResponse(null);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      userIdea, 
      initialMcpResponse,
      isProcessingIdea,
      login, 
      logout, 
      signup, 
      setUserIdea,
      sendIdeaToMcp,
      clearInitialResponse
    }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
