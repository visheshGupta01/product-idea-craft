import { ServerResponse } from "@/types";

const DEFAULT_MCP_SERVER_URL = "https://imaginebo.onrender.com/chat";
const DEFAULT_SESSION_ID = "a8c11c8223b5bc2ef9080c91178899c9";

export class McpService {
  private serverUrl: string;
  private sessionId: string;

  constructor(serverUrl?: string, sessionId?: string) {
    this.serverUrl = serverUrl || DEFAULT_MCP_SERVER_URL;
    this.sessionId = sessionId || DEFAULT_SESSION_ID;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          session_id: this.sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServerResponse = await response.json();
      
      return this.processServerResponse(data, message);
    } catch (error) {
      console.error("Error sending message to MCP server:", error);
      return this.createFallbackResponse(message);
    }
  }

  async sendMessageStream(
    message: string, 
    onChunk: (chunk: string) => void,
    onComplete: (fullResponse: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(this.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          session_id: this.sessionId,
          stream: true, // Request streaming if server supports it
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response supports streaming
      if (!response.body) {
        // Fallback to regular response
        const data: ServerResponse = await response.json();
        const fullResponse = this.processServerResponse(data, message);
        onComplete(fullResponse);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedData = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;
          
          // Try to parse complete JSON responses from the stream
          const lines = accumulatedData.split('\n');
          accumulatedData = lines.pop() || ''; // Keep incomplete line
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                // Handle different streaming formats
                let jsonData;
                if (line.startsWith('data: ')) {
                  // SSE format
                  const jsonStr = line.slice(6);
                  if (jsonStr === '[DONE]') continue;
                  jsonData = JSON.parse(jsonStr);
                } else {
                  // Direct JSON format
                  jsonData = JSON.parse(line);
                }
                
                // Process streaming chunk
                if (jsonData.assistant) {
                  onChunk(jsonData.assistant);
                } else if (jsonData.content) {
                  onChunk(jsonData.content);
                } else if (typeof jsonData === 'string') {
                  onChunk(jsonData);
                }
              } catch (parseError) {
                // If not JSON, treat as direct text
                onChunk(line);
              }
            }
          }
        }
        
        // Handle any remaining data
        if (accumulatedData.trim()) {
          try {
            const finalData = JSON.parse(accumulatedData);
            const fullResponse = this.processServerResponse(finalData, message);
            onComplete(fullResponse);
          } catch {
            // If final data isn't JSON, it might be the complete response
            onComplete(accumulatedData);
          }
        }
        
      } finally {
        reader.releaseLock();
      }
      
    } catch (error) {
      console.error("Error in streaming message:", error);
      const fallbackResponse = this.createFallbackResponse(message);
      onComplete(fallbackResponse);
    }
  }

  private processServerResponse(data: ServerResponse, originalMessage: string): string {
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
        if (tool.name === "sitemap_user_idea" && typeof tool.output === "object") {
          // Handle structured sitemap data
          const sitemapData = tool.output;
          if (aiContent) {
            aiContent += `\n\n## Project Sitemap\n\n__SITEMAP_DATA__${JSON.stringify(sitemapData)}__SITEMAP_DATA__`;
          } else {
            aiContent = `## Project Sitemap\n\n__SITEMAP_DATA__${JSON.stringify(sitemapData)}__SITEMAP_DATA__`;
          }
        } else {
          // Handle regular string output
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
        }
      });
    }

    if (!aiContent) {
      aiContent = this.createFallbackResponse(originalMessage);
    }

    return aiContent;
  }

  private createFallbackResponse(originalMessage: string): string {
    return `## Welcome! 🚀

I've received your message: "${originalMessage}"

I'm processing your request and will help you build it step by step. Let me analyze your requirements and provide you with a comprehensive plan.`;
  }
}

// Singleton instance
export const mcpService = new McpService();