
import { ReactNode, useState } from "react";
import { UserContext } from "./UserContext";

type User = {
  name: string;
  email: string;
  avatar: string;
  verified?: boolean;
};

interface InitialMcpResponse {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
}

interface ServerResponse {
  assistant: string;
  tools?: Array<{
    name: string;
    output: string | null;
  }>;
}

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
    
    try {
      const mcpServerUrl = "https://6c279fd45df5bc2ef9080c91178899c9";
      
      const response = await fetch(mcpServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: idea,
          session_id: "a8c11c8223b5bc2ef9080c91178899c9",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServerResponse = await response.json();
      
      let aiContent = "";
      
      if (data.assistant) {
        aiContent = data.assistant;
      }

      // Process tools if available
      if (data.tools && Array.isArray(data.tools) && data.tools.length > 0) {
        const validTools = data.tools.filter((tool) => 
          tool.output !== null && 
          tool.output !== undefined && 
          tool.output.toString().trim() !== ""
        );

        validTools.forEach((tool) => {
          let cleanedOutput = tool.output?.toString().trim() || "";
          
          if (cleanedOutput) {
            const sectionTitle = tool.name
              .replace(/[_-]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            if (aiContent) {
              aiContent += `\n\n## ${sectionTitle}\n\n` + cleanedOutput;
            } else {
              aiContent = `## ${sectionTitle}\n\n` + cleanedOutput;
            }
          }
        });
      }

      if (!aiContent) {
        aiContent = `## Welcome! 🚀

I've received your idea: "${idea}"

I'm processing your request and will help you build it step by step. Let me analyze your requirements and provide you with a comprehensive plan.`;
      }

      setInitialMcpResponse({
        userMessage: idea,
        aiResponse: aiContent,
        timestamp: new Date(),
      });

      setUserIdea(idea);
      
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
      
      setUserIdea(idea);
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
