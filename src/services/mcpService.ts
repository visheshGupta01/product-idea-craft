import { ServerResponse } from "@/types";
import { MCP_CONFIG } from "@/utils/constants";

export class McpService {
  private serverUrl: string;
  private sessionId: string

  constructor(serverUrl?: string, sessionId?: string) {
    this.serverUrl = serverUrl || MCP_CONFIG.DEFAULT_SERVER_URL;
    this.sessionId = sessionId || MCP_CONFIG.DEFAULT_SESSION_ID;
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
      let fullResponseContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          accumulatedData += chunk;
          
          // Parse lines from accumulated data
          const lines = accumulatedData.split('\n');
          accumulatedData = lines.pop() || ''; // Keep incomplete line
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                // Handle MCP streaming format
                let jsonData;
                if (line.startsWith('data: ')) {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr === '[DONE]') continue;
                  jsonData = JSON.parse(jsonStr);
                } else {
                  jsonData = JSON.parse(line);
                }
                
                // Process different types of streaming data
                if (jsonData.type === 'text' && jsonData.content) {
                  // Regular text content - stream it immediately
                  onChunk(jsonData.content);
                  fullResponseContent += jsonData.content;
                } else if (jsonData.type === 'tool_result' && jsonData.tool) {
                  // Tool result - process and add to full response
                  const toolOutput = jsonData.tool.output || '';
                  if (toolOutput) {
                    onChunk(`\n\n${toolOutput}`);
                    fullResponseContent += `\n\n${toolOutput}`;
                  }
                } else if (jsonData.type === 'complete') {
                  // Stream is complete - call onComplete with accumulated content
                  onComplete(fullResponseContent);
                  return;
                }
                // Ignore other types like 'tool_start', 'json', 'block_stop'
                
              } catch (parseError) {
                console.warn("Failed to parse streaming line:", line, parseError);
              }
            }
          }
        }
        
        // If we reach here, streaming is done - call onComplete with accumulated content
        if (fullResponseContent) {
          onComplete(fullResponseContent);
        } else {
          // Handle any remaining data as fallback
          if (accumulatedData.trim()) {
            try {
              const finalData = JSON.parse(accumulatedData);
              const fullResponse = this.processServerResponse(finalData, message);
              onComplete(fullResponse);
            } catch {
              onComplete(accumulatedData);
            }
          } else {
            onComplete(this.createFallbackResponse(message));
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

I'm unable to process it at this time as MCP server is not working.`;
  }
}

// Singleton instance
export const mcpService = new McpService();