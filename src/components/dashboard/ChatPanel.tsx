import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Loader2, Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";

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
    output: string | null;
  }>;
}

// Enhanced markdown renderer with improved list handling
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];
    let currentIndex = 0;
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        i++;
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={currentIndex++}
            className="text-2xl font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={currentIndex++}
            className="text-xl font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={currentIndex++}
            className="text-lg font-bold mb-2 mt-3 text-foreground border-b border-border pb-1"
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={currentIndex++}
            className="text-md font-semibold mb-1 mt-2 text-foreground"
          >
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("##### ")) {
        elements.push(
          <h5
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-foreground"
          >
            {line.substring(6)}
          </h5>
        );
      } else if (line.startsWith("###### ")) {
        elements.push(
          <h6
            key={currentIndex++}
            className="text-sm font-semibold mb-1 mt-2 text-muted-foreground"
          >
            {line.substring(7)}
          </h6>
        );
      }
      // Horizontal rules
      else if (
        line.trim() === "---" ||
        line.trim() === "***" ||
        line.trim() === "___"
      ) {
        elements.push(
          <hr key={currentIndex++} className="my-3 border-t-2 border-border" />
        );
      }
      // Code blocks (fenced)
      else if (line.startsWith("```")) {
        const language = line.substring(3).trim();
        const codeLines = [];
        let j = i + 1;

        while (j < lines.length && !lines[j].startsWith("```")) {
          codeLines.push(lines[j]);
          j++;
        }

        elements.push(
          <div key={currentIndex++} className="my-2">
            <div className="bg-muted border border-border rounded-lg overflow-hidden">
              {language && (
                <div className="bg-muted/50 px-4 py-2 text-sm font-mono text-muted-foreground border-b border-border">
                  {language}
                </div>
              )}
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-foreground">
                  {codeLines.join("\n")}
                </code>
              </pre>
            </div>
          </div>
        );

        i = j; // Skip to end of code block
      }
      // Blockquotes
      else if (line.startsWith("> ")) {
        const quoteLines = [line.substring(2)];
        let j = i + 1;

        while (j < lines.length && lines[j].startsWith("> ")) {
          quoteLines.push(lines[j].substring(2));
          j++;
        }

        elements.push(
          <blockquote
            key={currentIndex++}
            className="border-l-4 border-primary bg-primary/10 pl-4 py-2 my-2 italic text-muted-foreground"
          >
            {quoteLines.map((quoteLine, idx) => (
              <p key={idx} className="mb-1 last:mb-0">
                {processInlineFormatting(quoteLine)}
              </p>
            ))}
          </blockquote>
        );

        i = j - 1; // Skip processed lines
      }
      // Enhanced Lists with proper nesting and indentation
      else if (line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)) {
        const { listElement, nextIndex } = processNestedList(lines, i);
        elements.push(React.cloneElement(listElement, { key: currentIndex++ }));
        i = nextIndex - 1;
      }
      // Tables
      else if (line.includes("|") && line.split("|").length > 2) {
        const tableLines = [line];
        let j = i + 1;

        while (
          j < lines.length &&
          lines[j].includes("|") &&
          lines[j].split("|").length > 2
        ) {
          tableLines.push(lines[j]);
          j++;
        }

        const rows = tableLines.map((row) =>
          row
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell)
        );

        const hasHeader =
          rows.length > 1 && rows[1].some((cell) => cell.includes("---"));
        const headerRow = hasHeader ? rows[0] : null;
        const dataRows = hasHeader ? rows.slice(2) : rows;

        elements.push(
          <div key={currentIndex++} className="my-4 overflow-x-auto">
            <table className="min-w-full border border-border rounded-lg">
              {headerRow && (
                <thead className="bg-muted">
                  <tr>
                    {headerRow.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-2 text-left font-semibold text-foreground border-b border-border"
                      >
                        {processInlineFormatting(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="even:bg-muted/50">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 text-foreground border-b border-border"
                      >
                        {processInlineFormatting(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

        i = j - 1;
      }
      // Regular paragraphs
      else {
        elements.push(
          <p
            key={currentIndex++}
            className="mb-4 leading-relaxed text-foreground"
          >
            {processInlineFormatting(line)}
          </p>
        );
      }

      i++;
    }

    return elements;
  };

  // Enhanced nested list processing
  const processNestedList = (lines: string[], startIndex: number) => {
    const listItems: Array<{
      content: string;
      level: number;
      isOrdered: boolean;
      originalNumber?: string;
      children?: any[];
    }> = [];

    let i = startIndex;

    while (i < lines.length) {
      const line = lines[i];

      // Skip empty lines
      if (line.match(/^\s*$/)) {
        i++;
        continue;
      }

      const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);

      if (!listMatch) {
        // Check if it's a continuation line (indented but not a list item)
        if (line.match(/^\s{2,}/) && listItems.length > 0) {
          const lastItem = listItems[listItems.length - 1];
          lastItem.content += " " + line.trim();
          i++;
          continue;
        }
        break;
      }

      const indent = listMatch[1];
      const marker = listMatch[2];
      const content = listMatch[3];
      const level = Math.floor(indent.length / 2); // 2 spaces per level
      const isOrdered = marker.match(/\d+\./) !== null;

      listItems.push({
        content,
        level,
        isOrdered,
        originalNumber: isOrdered ? marker.replace(".", "") : undefined,
      });

      i++;
    }

    // Build nested structure
    const buildNestedList = (
      items: typeof listItems,
      currentLevel: number = 0
    ): React.ReactElement => {
      const currentLevelItems = items.filter(
        (item) => item.level === currentLevel
      );
      const isOrdered =
        currentLevelItems.length > 0 && currentLevelItems[0].isOrdered;

      const ListComponent = isOrdered ? "ol" : "ul";
      const listProps =
        isOrdered && currentLevelItems[0]?.originalNumber
          ? { start: parseInt(currentLevelItems[0].originalNumber) || 1 }
          : {};

      return (
        <ListComponent
          className={`my-4 ${isOrdered ? "list-decimal" : "list-disc"} ${
            currentLevel === 0 ? "list-inside" : "list-outside ml-6"
          } space-y-2`}
          {...listProps}
        >
          {currentLevelItems.map((item, idx) => {
            const nextLevelItems = items.filter(
              (nextItem, nextIdx) =>
                nextItem.level === currentLevel + 1 &&
                items.findIndex((i) => i === nextItem) >
                  items.findIndex((i) => i === item) &&
                (idx === currentLevelItems.length - 1 ||
                  items.findIndex((i) => i === nextItem) <
                    items.findIndex((i) => i === currentLevelItems[idx + 1]))
            );

            return (
              <li key={idx} className="text-foreground leading-relaxed">
                {processInlineFormatting(item.content)}
                {nextLevelItems.length > 0 && (
                  <div className="mt-2">
                    {buildNestedList(nextLevelItems, currentLevel + 1)}
                  </div>
                )}
              </li>
            );
          })}
        </ListComponent>
      );
    };

    if (listItems.length === 0) {
      return { listElement: <div />, nextIndex: i };
    }

    return {
      listElement: buildNestedList(listItems),
      nextIndex: i,
    };
  };

  // Process inline formatting (bold, italic, code, links)
  const processInlineFormatting = (text: string) => {
    // Handle inline code first
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted text-foreground px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );

    // Handle bold
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold text-foreground">$1</strong>'
    );

    // Handle italic
    text = text.replace(
      /\*([^*]+)\*/g,
      '<em class="italic text-foreground">$1</em>'
    );

    // Handle links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Handle strikethrough
    text = text.replace(
      /~~([^~]+)~~/g,
      '<del class="line-through text-muted-foreground">$1</del>'
    );

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="prose prose-sm max-w-none">{renderMarkdown(content)}</div>
  );
};

const ChatPanel = ({
  userIdea,
  mcpServerUrl = "https://6c279fd45df5bc2ef9080c91178899c9",
}: ChatPanelProps) => {
  const { toast } = useToast();
  const { initialMcpResponse, clearInitialResponse } = useUser();
  
  // Initialize messages based on whether we have an initial MCP response
  const [messages, setMessages] = useState<Message[]>(() => {
    if (initialMcpResponse) {
      return [
        {
          id: "1",
          type: "user",
          content: initialMcpResponse.userMessage,
          timestamp: initialMcpResponse.timestamp,
        },
        {
          id: "2",
          type: "ai",
          content: initialMcpResponse.aiResponse,
          timestamp: new Date(initialMcpResponse.timestamp.getTime() + 1000),
        },
      ];
    }
    
    return [
      {
        id: "1",
        type: "ai",
        content: `# Welcome! 🚀

Hello Sir, Tell me the **idea** which you want to bring to life. I will help you build it step by step.

## What I can help you with:

- **Research & Analysis**: Market research, competitor analysis, feasibility studies
- **Technical Planning**: Architecture design, technology stack recommendations
- **Implementation**: Step-by-step development guidance
- **Testing & Deployment**: Quality assurance and launch strategies

> Just describe your idea and I'll provide comprehensive guidance!

---

*Ready to start? Share your vision below!*`,
        timestamp: new Date(),
      },
    ];
  });

  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear the initial response from context when component mounts
  useEffect(() => {
    if (initialMcpResponse) {
      clearInitialResponse();
    }
  }, [initialMcpResponse, clearInitialResponse]);

  const formatSitemapJson = (jsonData: any) => {
    let data;
    try {
      // Handle if it's already an object
      if (typeof jsonData === "object" && jsonData !== null) {
        data = jsonData;
      } else {
        // Try to parse as JSON string
        data = JSON.parse(jsonData);
      }
    } catch (e) {
      // If parsing fails, return the original data as string
      return typeof jsonData === "string"
        ? jsonData
        : JSON.stringify(jsonData, null, 2);
    }

    // Format the JSON into readable markdown
    let formatted = `# Project Structure: ${data.project_name}\n\n`;
    formatted += `**Type:** ${data.project_type}\n`;
    formatted += `**Domain:** ${data.domain}\n\n`;
    formatted += `## Description\n${data.description}\n\n`;

    // Tech stack
    formatted += `## Technology Stack\n`;
    formatted += `- **Frontend:** ${data.tech_stack.frontend}\n`;
    formatted += `- **Backend:** ${data.tech_stack.backend}\n`;
    formatted += `- **Database:** ${data.tech_stack.database}\n\n`;

    // Pages
    formatted += `## Pages\n`;
    data.pages.forEach((page, index) => {
      formatted += `### ${index + 1}. ${page.name}\n`;
      formatted += `${page.description}\n\n`;
      formatted += `**Components:** ${page.components.join(", ")}\n\n`;
    });

    // Database models
    formatted += `## Database Models\n`;
    data.database_models.forEach((model, index) => {
      formatted += `### ${index + 1}. ${model.model_name}\n`;
      formatted += `**Fields:**\n`;
      Object.entries(model.fields).forEach(([field, type]) => {
        formatted += `- ${field}: ${type}\n`;
      });
      formatted += `\n**Relationships:**\n`;
      model.relationships.forEach((rel) => {
        formatted += `- ${rel}\n`;
      });
      formatted += `\n`;
    });

    // API Routes
    formatted += `## API Routes\n`;
    data.backend_api_routes.forEach((route, index) => {
      formatted += `### ${index + 1}. ${route.method} ${route.route}\n`;
      formatted += `**Function:** ${route.controller_function}\n`;
      formatted += `**Description:** ${route.description}\n\n`;
    });

    return formatted;
  };

  // Enhanced function to clean tool output and remove tool names
  const cleanToolOutput = (output: string | any, toolName: string): string => {
    if (!output) return "";

    // Convert to string if it's not already
    let cleaned =
      typeof output === "string" ? output : JSON.stringify(output, null, 2);
    cleaned = cleaned.trim();

    // For sitemap_user_idea, try to extract JSON if it's wrapped in other text
    if (toolName === "sitemap_user_idea") {
      if (typeof output === "object") {
        // If it's already an object, stringify it
        cleaned = JSON.stringify(output, null, 2);
      } else {
        // If it's a string, try to extract JSON
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleaned = jsonMatch[0];
        }
      }
    }
    // Remove tool name from the beginning if present
    const toolNameVariations = [
      toolName,
      toolName.toLowerCase(),
      toolName.toUpperCase(),
      toolName.replace(/[_-]/g, " "),
      toolName.replace(/[_-]/g, " ").toLowerCase(),
    ];

    for (const variation of toolNameVariations) {
      const patterns = [
        new RegExp(`^${variation}:?\\s*`, "i"),
        new RegExp(`^\\[${variation}\\]:?\\s*`, "i"),
        new RegExp(`^${variation}\\s+output:?\\s*`, "i"),
        new RegExp(`^${variation}\\s+result:?\\s*`, "i"),
      ];

      for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, "");
      }
    }

    // Remove common prefixes that might indicate tool output
    const commonPrefixes = [
      /^Tool output:?\s*/i,
      /^Result:?\s*/i,
      /^Response:?\s*/i,
      /^Output:?\s*/i,
      /^\[.*?\]:?\s*/,
    ];

    for (const prefix of commonPrefixes) {
      cleaned = cleaned.replace(prefix, "");
    }

    return cleaned.trim();
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
        },
        body: JSON.stringify({
          message: currentMessage,
          session_id: "a8c11c8223b5bc2ef9080c91178899c9",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ServerResponse = await response.json();

      console.log("=== FULL SERVER RESPONSE ===");
      console.log(JSON.stringify(data, null, 2));

      setDebugInfo(JSON.stringify(data, null, 2));

      let aiContent = "";

      if (data.assistant) {
        aiContent = data.assistant;
        console.log(
          "✓ Assistant content found:",
          aiContent.substring(0, 100) + "..."
        );
      } else {
        console.log("✗ No assistant content found");
      }

      if (data.tools && Array.isArray(data.tools) && data.tools.length > 0) {
        console.log(`✓ Found ${data.tools.length} tools`);

        // Filter out tools with null or empty output
        const validTools = data.tools.filter((tool) => {
          const hasValidOutput =
            tool.output !== null &&
            tool.output !== undefined &&
            tool.output.toString().trim() !== "";

          console.log(
            `Tool "${tool.name}": ${
              hasValidOutput ? "valid" : "invalid"
            } output`
          );
          return hasValidOutput;
        });

        console.log(`✓ Valid tools after filtering: ${validTools.length}`);

        validTools.forEach((tool, index) => {
          console.log(`Valid Tool ${index + 1}:`);
          console.log(`  Name: "${tool.name}"`);
          console.log(`  Output type: ${typeof tool.output}`);
          console.log(
            `  Output length: ${tool.output?.toString().length || 0}`
          );
          if (tool.output) {
            const outputStr = tool.output.toString();
            console.log(
              `  Output preview: "${outputStr.substring(0, 100)}..."`
            );
          }
        });

        // Process all valid tools equally (no prioritization)
        validTools.forEach((tool, index) => {
          let cleanedOutput = cleanToolOutput(tool.output, tool.name);

          // Special handling for sitemap_user_idea
          if (tool.name === "sitemap_user_idea" && cleanedOutput) {
            try {
              cleanedOutput = formatSitemapJson(cleanedOutput);
            } catch (e) {
              console.log("Failed to format sitemap JSON:", e);
              // Keep the original output if formatting fails
            }
          }

          if (cleanedOutput) {
            const sectionTitle = tool.name
              .replace(/[_-]/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase());

            if (aiContent) {
              aiContent += `\n\n## ${sectionTitle}\n\n` + cleanedOutput;
            } else {
              aiContent = `## ${sectionTitle}\n\n` + cleanedOutput;
            }
            console.log(`✓ Tool "${tool.name}" output added to AI content`);
          }
        });
      } else {
        console.log("✗ No valid tools found in response");
      }

      if (!aiContent) {
        aiContent = `## No Response Available

I received your message but couldn't generate a proper response. This might be due to:

- All tools returned null or empty output
- Server response format issues
- Network connectivity problems

Please try rephrasing your request or check the connection.`;
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
        content: `## Error ❌

Sorry, I encountered an error while processing your request:

\`\`\`
${error}
\`\`\`

Please try again or check your connection.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTopOfNewMessage = () => {
    const messageElements = document.querySelectorAll("[data-message-id]");
    if (messageElements.length > 0) {
      const lastMessage = messageElements[messageElements.length - 1];
      lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard.",
    });
  };

  const downloadAsText = (content: string, messageId: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `message-${messageId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Message has been downloaded as a text file.",
    });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToTopOfNewMessage();
    }
  }, [messages, isLoading]);

  return (
    <div
      className="h-full flex flex-col"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      {/* Messages */}
      <ScrollArea
        className="flex-1 pt-4 pl-4 pr-4"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="w-full">
          {messages.map((message, index) => (
            <div
              key={message.id}
              data-message-id={message.id}
              className={`group flex items-start space-x-3 ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              } ${index === messages.length - 1 ? "mb-[-1rem]" : "mb-4"}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.type === "ai" ? (
                  <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`max-w-[70%] ${
                  message.type === "user" ? "text-right" : ""
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.type === "user"
                      ? "bg-blue-300 text-black rounded-br-md"
                      : "bg-[#D9D9D9] text-black rounded-bl-md backdrop-blur-sm"
                  }`}
                >
                  {message.type === "user" ? (
                    <div className="whitespace-pre-wrap text-left">
                      {message.content}
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none !text-black [&_*]:!text-black">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  )}
                </div>

                {/* Copy and Download buttons */}
                {message.id !== "1" && (
                  <div
                    className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1 mt-2 ${
                      message.type === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    {message.type === "user" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                        onClick={() => copyToClipboard(message.content)}
                      >
                        <Copy className="h-3 w-3 text-white" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <Copy className="h-3 w-3 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 bg-white/10 hover:bg-white/20 border-0"
                          onClick={() =>
                            downloadAsText(message.content, message.id)
                          }
                        >
                          <Download className="h-3 w-3 text-white" />
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-sm text-white">AI is typing...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-6" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="w-full">
          <div className="relative">
            <Input
              placeholder="Message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && !isLoading && sendMessage()
              }
              className="w-full bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-full py-3 px-4 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              size="sm"
              disabled={!newMessage.trim() || isLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-transparent text-white rounded-full shadow-sm"
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
    </div>
  );
};

export default ChatPanel;
