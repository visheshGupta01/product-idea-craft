import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2 } from "lucide-react";

interface ChatPanelProps {
  userIdea: string;
  mcpServerUrl?: string;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ServerResponse {
  assistant: string;
  tools?: Array<{
    name: string;
    output: string;
  }>;
}

// Enhanced markdown renderer for research output
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderLine = (line: string, index: number) => {
    // Skip empty lines
    if (!line.trim()) {
      return <br key={index} />;
    }

    // Handle headers
    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const headerText = line.substring(2, line.length - 2);
      return (
        <h2 key={index} className="text-lg font-bold mb-3 mt-4 text-blue-800">
          {headerText}
        </h2>
      );
    }

    if (line.startsWith("# ")) {
      return (
        <h1 key={index} className="text-xl font-bold mb-3 mt-4">
          {line.substring(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={index} className="text-lg font-semibold mb-2 mt-3">
          {line.substring(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={index} className="text-md font-medium mb-2 mt-2">
          {line.substring(4)}
        </h3>
      );
    }

    // Handle bullet points
    if (line.startsWith("- **") || line.startsWith("  - **")) {
      const indent = line.startsWith("  ") ? "ml-8" : "ml-4";
      const content = line
        .replace(/^\s*-\s*/, "")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <div
          key={index}
          className={`${indent} mb-1`}
          dangerouslySetInnerHTML={{ __html: `• ${content}` }}
        />
      );
    }

    if (line.startsWith("- ") || line.startsWith("• ")) {
      const content = line.substring(2);
      return (
        <div key={index} className="ml-4 mb-1">
          • {content}
        </div>
      );
    }

    // Handle numbered lists
    if (/^\d+\.\s/.test(line)) {
      const content = line
        .replace(/^\d+\.\s/, "")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return (
        <div
          key={index}
          className="ml-4 mb-1"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Handle table rows (basic)
    if (line.includes("|") && line.split("|").length > 2) {
      const cells = line
        .split("|")
        .map((cell) => cell.trim())
        .filter((cell) => cell);
      const isHeader = cells.some((cell) => cell.includes("---"));

      if (isHeader) {
        return <div key={index} className="border-b border-gray-300 my-2" />;
      }

      return (
        <div key={index} className="grid grid-cols-4 gap-2 mb-1 text-sm">
          {cells.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className="p-1 border-r border-gray-200 last:border-r-0"
            >
              {cell}
            </div>
          ))}
        </div>
      );
    }

    // Handle regular text with bold formatting
    const processedLine = line
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    return (
      <div
        key={index}
        className="mb-2 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processedLine }}
      />
    );
  };

  return (
    <div className="prose prose-sm max-w-none">
      {content.split("\n").map(renderLine)}
    </div>
  );
};

const ChatPanel = ({
  userIdea,
  mcpServerUrl = "https://808326d1f03d.ngrok-free.app/chat",
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Great idea! I've analyzed your concept: "${userIdea}". Let's start by conducting a competitive analysis. What similar products or services have you seen in the market?`,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const formatResearchOutput = (output: string): string => {
    // Keep the markdown formatting for the enhanced renderer
    return output.trim();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(mcpServerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          message: currentMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServerResponse = await response.json();

      // Enhanced debugging
      console.log("=== FULL SERVER RESPONSE ===");
      console.log(JSON.stringify(data, null, 2));

      setDebugInfo(JSON.stringify(data, null, 2));

      let aiContent = "";

      // Check if assistant field exists and has content
      if (data.assistant) {
        aiContent = data.assistant;
        console.log(
          "✓ Assistant content found:",
          aiContent.substring(0, 100) + "..."
        );
      } else {
        console.log("✗ No assistant content found");
      }

      // Enhanced tools processing
      if (data.tools && Array.isArray(data.tools) && data.tools.length > 0) {
        console.log(`✓ Found ${data.tools.length} tools`);

        data.tools.forEach((tool, index) => {
          console.log(`Tool ${index + 1}:`);
          console.log(`  Name: "${tool.name}"`);
          console.log(`  Has output: ${!!tool.output}`);
          console.log(`  Output length: ${tool.output?.length || 0}`);
          if (tool.output) {
            console.log(
              `  Output preview: "${tool.output.substring(0, 100)}..."`
            );
          }
        });

        // Look for research tool with more flexible matching
        const researchTool = data.tools.find(
          (tool) => tool.name && tool.name.toLowerCase().includes("research")
        );

        if (researchTool && researchTool.output) {
          console.log("✓ Research tool found with output");
          const formattedOutput = formatResearchOutput(researchTool.output);

          if (aiContent) {
            aiContent += "\n\n--- Research Report ---\n\n" + formattedOutput;
          } else {
            aiContent = "--- Research Report ---\n\n" + formattedOutput;
          }
          console.log("✓ Research output added to AI content");
        } else {
          console.log("✗ No research tool found or no output");
          // Try to get any tool output
          const anyToolWithOutput = data.tools.find((tool) => tool.output);
          if (anyToolWithOutput) {
            console.log(`✓ Found tool with output: ${anyToolWithOutput.name}`);
            const formattedOutput = formatResearchOutput(
              anyToolWithOutput.output
            );

            if (aiContent) {
              aiContent +=
                `\n\n--- ${anyToolWithOutput.name} Output ---\n\n` +
                formattedOutput;
            } else {
              aiContent =
                `--- ${anyToolWithOutput.name} Output ---\n\n` +
                formattedOutput;
            }
          }
        }
      } else {
        console.log("✗ No tools found in response");
      }

      // Fallback if no content found
      if (!aiContent) {
        aiContent =
          "I received your message but couldn't generate a proper response. Please check the debug info below.\n\n" +
          "Raw server response:\n" +
          JSON.stringify(data, null, 2);
        console.log("✗ Using fallback content");
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to MCP server:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Sorry, I encountered an error while processing your request: ${error}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col chat-bg">{/* Always use chat background */}
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border chat-bg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-foreground">AI Assistant</h3>
            <p className="text-xs text-foreground/60">
              Guiding your build process
            </p>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      {debugInfo && (
        <div className="p-2 bg-gray-100 border-b text-xs">
          <details>
            <summary className="cursor-pointer font-medium">
              Last Server Response (Click to expand)
            </summary>
            <pre className="mt-2 overflow-auto max-h-40 text-xs">
              {debugInfo}
            </pre>
          </details>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 chat-bg" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-primary">
                    <Bot className="w-3 h-3 text-primary-foreground" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                <MarkdownRenderer content={message.content} />
                <p className={`text-xs mt-1 opacity-70`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.type === "user" && (
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-secondary">
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex space-x-3 justify-start">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="bg-primary">
                  <Bot className="w-3 h-3 text-primary-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-foreground" />
                  <span className="text-sm text-foreground/60">
                    AI is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border chat-bg">
        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about your project..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            className="flex-1 bg-card border-border text-foreground placeholder:text-foreground/50 rounded-2xl"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="sm"
            disabled={!newMessage.trim() || isLoading}
            className="px-3 bg-primary hover:btn-primary text-primary-foreground rounded-2xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
