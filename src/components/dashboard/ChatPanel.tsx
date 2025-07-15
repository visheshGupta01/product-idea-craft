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

// Enhanced markdown renderer using react-markdown (simulated)
const MarkdownRenderer = ({ content }: { content: string }) => {
  // Custom component for rendering markdown elements
  const renderMarkdown = (text: string) => {
    // Split text into lines for processing
    const lines = text.split("\n");
    const elements: React.ReactElement[] = [];
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) {
        elements.push(<br key={currentIndex++} />);
        continue;
      }

      // Headers
      if (line.startsWith("# ")) {
        elements.push(
          <h1
            key={currentIndex++}
            className="text-2xl font-bold mb-4 mt-6 text-slate-900 border-b border-slate-300 pb-2"
          >
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2
            key={currentIndex++}
            className="text-xl font-bold mb-3 mt-6 text-slate-900 border-b border-slate-300 pb-2"
          >
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <h3
            key={currentIndex++}
            className="text-lg font-bold mb-3 mt-6 text-slate-900 border-b border-slate-300 pb-1"
          >
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <h4
            key={currentIndex++}
            className="text-md font-semibold mb-2 mt-4 text-slate-800"
          >
            {line.substring(5)}
          </h4>
        );
      } else if (line.startsWith("##### ")) {
        elements.push(
          <h5
            key={currentIndex++}
            className="text-sm font-semibold mb-2 mt-4 text-slate-800"
          >
            {line.substring(6)}
          </h5>
        );
      } else if (line.startsWith("###### ")) {
        elements.push(
          <h6
            key={currentIndex++}
            className="text-sm font-semibold mb-2 mt-4 text-slate-700"
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
          <hr
            key={currentIndex++}
            className="my-6 border-t-2 border-slate-300"
          />
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
          <div key={currentIndex++} className="my-4">
            <div className="bg-slate-100 border border-slate-200 rounded-lg overflow-hidden">
              {language && (
                <div className="bg-slate-200 px-4 py-2 text-sm font-mono text-slate-600 border-b border-slate-300">
                  {language}
                </div>
              )}
              <pre className="p-4 overflow-x-auto">
                <code className="text-sm font-mono text-slate-800">
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
            className="border-l-4 border-blue-500 bg-blue-50 pl-4 py-2 my-4 italic text-slate-700"
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
      // Lists - FIXED VERSION
      else if (line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)) {
        const listItems = [];
        let j = i;
        const firstMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
        const isOrdered = firstMatch && firstMatch[2].match(/\d+\./);
        const baseIndent = firstMatch ? firstMatch[1].length : 0;

        // Process all consecutive list items
        while (j < lines.length) {
          const currentLine = lines[j];
          const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);

          if (listMatch) {
            const indent = listMatch[1].length;
            const marker = listMatch[2];
            const content = listMatch[3];

            // Check if this is the same type of list and similar indentation
            const isCurrentOrdered = marker.match(/\d+\./);
            if ((!!isCurrentOrdered === !!isOrdered) && indent >= baseIndent) {
              listItems.push(content);
              j++;
            } else {
              break;
            }
          } else if (currentLine.match(/^\s*$/) && j > i) {
            // Empty line - check if next line continues the list
            const nextLine = lines[j + 1];
            if (nextLine && nextLine.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/)) {
              j++; // Skip empty line
              continue;
            } else {
              break;
            }
          } else if (currentLine.match(/^\s{2,}/) && listItems.length > 0) {
            // Continuation of previous item (indented content)
            listItems[listItems.length - 1] += " " + currentLine.trim();
            j++;
          } else {
            break;
          }
        }

        const ListComponent = isOrdered ? "ol" : "ul";
        elements.push(
          <ListComponent
            key={currentIndex++}
            className={`my-4 ${
              isOrdered ? "list-decimal" : "list-disc"
            } list-inside space-y-2`}
          >
            {listItems.map((item, idx) => (
              <li key={idx} className="text-slate-700 leading-relaxed">
                {processInlineFormatting(item)}
              </li>
            ))}
          </ListComponent>
        );

        i = j - 1; // Skip processed lines
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
            <table className="min-w-full border border-slate-300 rounded-lg">
              {headerRow && (
                <thead className="bg-slate-100">
                  <tr>
                    {headerRow.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-4 py-2 text-left font-semibold text-slate-900 border-b border-slate-300"
                      >
                        {processInlineFormatting(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {dataRows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="even:bg-slate-50">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-2 text-slate-700 border-b border-slate-200"
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

        i = j - 1; // Skip processed lines
      }
      // Regular paragraphs
      else {
        elements.push(
          <p
            key={currentIndex++}
            className="mb-4 leading-relaxed text-slate-700"
          >
            {processInlineFormatting(line)}
          </p>
        );
      }
    }

    return elements;
  };

  // Process inline formatting (bold, italic, code, links)
  const processInlineFormatting = (text: string) => {
    // Handle inline code first
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-sm">$1</code>'
    );

    // Handle bold
    text = text.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-bold text-slate-900">$1</strong>'
    );

    // Handle italic
    text = text.replace(
      /\*([^*]+)\*/g,
      '<em class="italic text-slate-700">$1</em>'
    );

    // Handle links
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Handle strikethrough
    text = text.replace(
      /~~([^~]+)~~/g,
      '<del class="line-through text-slate-500">$1</del>'
    );

    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <div className="prose prose-sm max-w-none">{renderMarkdown(content)}</div>
  );
};

const ChatPanel = ({
  userIdea,
  mcpServerUrl = "https://1946dc82ab95.ngrok-free.app/chat",
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([
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
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatResearchOutput = (output: string): string => {
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

        const researchTool = data.tools.find(
          (tool) => tool.name && tool.name.toLowerCase().includes("research")
        );

        if (researchTool && researchTool.output) {
          console.log("✓ Research tool found with output");
          const formattedOutput = formatResearchOutput(researchTool.output);

          if (aiContent) {
            aiContent += "\n\n## Research Report\n\n" + formattedOutput;
          } else {
            aiContent = "## Research Report\n\n" + formattedOutput;
          }
          console.log("✓ Research output added to AI content");
        } else {
          console.log("✗ No research tool found or no output");
          const anyToolWithOutput = data.tools.find((tool) => tool.output);
          if (anyToolWithOutput) {
            console.log(`✓ Found tool with output: ${anyToolWithOutput.name}`);
            const formattedOutput = formatResearchOutput(
              anyToolWithOutput.output
            );

            if (aiContent) {
              aiContent +=
                `\n\n## ${anyToolWithOutput.name} Output\n\n` + formattedOutput;
            } else {
              aiContent =
                `## ${anyToolWithOutput.name} Output\n\n` + formattedOutput;
            }
          }
        }
      } else {
        console.log("✗ No tools found in response");
      }

      if (!aiContent) {
        aiContent = `## Error Response

I received your message but couldn't generate a proper response. Please check the debug info below.

### Raw server response:
\`\`\`json
${JSON.stringify(data, null, 2)}
\`\`\``;
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-gray-900">
              AI Assistant
            </h3>
            <p className="text-xs text-gray-500">
              Guiding your build process with enhanced markdown support
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "ai" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-blue-600">
                    <Bot className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  message.type === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                }`}
              >
                {message.type === "user" ? (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
                <p
                  className={`text-xs mt-3 ${
                    message.type === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {message.type === "user" && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-600">
                    <User className="w-4 h-4 text-white" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex space-x-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600">
                  <Bot className="w-4 h-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600">
                    AI is processing your request...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <Input
            placeholder="Describe your idea or ask a question..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isLoading && sendMessage()}
            className="flex-1 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="sm"
            disabled={!newMessage.trim() || isLoading}
            className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
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
