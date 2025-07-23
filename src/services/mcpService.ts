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
    console.log("Sending message to MCP server:", message);
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
      console.log("Received response from MCP server:", data);
      
      return this.processServerResponse(data, message);
    } catch (error) {
      console.error("Error sending message to MCP server:", error);
      return this.createFallbackResponse(message);
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
          console.log("Tool output:", cleanedOutput);
          if (cleanedOutput) {
            const sectionTitle = tool.name
              .replace(/[_-]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            if (aiContent) {
              aiContent += `\n\n## ${sectionTitle}\n\n` + cleanedOutput;
              console.log("Final Output:", aiContent);
            } else {
              aiContent = `## ${sectionTitle}\n\n` + cleanedOutput;
              console.log("Final Output:", aiContent);
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
    console.log("Creating fallback response for:", originalMessage);
    return `## Welcome! 🚀

I've received your message: "${originalMessage}"

I'm unable to process it at this time as MCP serve is not working.`;
  }
}

// Singleton instance
export const mcpService = new McpService();