import React, { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Square, Mic, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import { FileUploader, UploadedFile } from "@/components/ui/file-uploader";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onStopGeneration?: () => void;
}

interface Tool {
  name: string;
  description: string;
}

const availableTools: Tool[] = [
  {
    name: "@analyse",
    description: "Analyze the provided text or code for insights.",
  },
  {
    name: "@research",
    description: "Conduct a web search to gather information on a topic.",
  },
  {
    name: "@icp",
    description: "Identify Ideal Customer Profile based on project details.",
  },
  { name: "@mvp", description: "Generate a Minimum Viable Product plan." },
  {
    name: "@sitemap",
    description:
      "Create a sitemap for a given website or application structure.",
  },
  {
    name: "@scope of work",
    description: "Define the scope of work for a project.",
  },
  {
    name: "@frontend code making",
    description: "Generate frontend code snippets or components.",
  },
  {
    name: "@backend code",
    description: "Generate backend code snippets or API logic.",
  },
];

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStopGeneration,
}) => {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // State for uploaded files
  const [showToolList, setShowToolList] = useState(false);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [toolInput, setToolInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sessionId } = useUser();

  useEffect(() => { 
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // Max height 120px
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [message]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    const atIndex = value.lastIndexOf("@");
    if (
      atIndex !== -1 &&
      (atIndex === 0 ||
        value[atIndex - 1] === " " ||
        value[atIndex - 1] === "\n")
    ) {
      const currentToolInput = value.substring(atIndex + 1);
      setToolInput(currentToolInput);
      const filtered = availableTools.filter((tool) =>
        tool.name.toLowerCase().includes(currentToolInput.toLowerCase())
      );
      setFilteredTools(filtered);
      setShowToolList(true);
    } else {
      setShowToolList(false);
      setToolInput("");
    }
  };

  const handleToolSelect = (tool: Tool) => {
    const atIndex = message.lastIndexOf("@");
    if (atIndex !== -1) {
      const newMessage = message.substring(0, atIndex) + tool.name + " ";
      setMessage(newMessage);
      setShowToolList(false);
      setToolInput("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleFileUploaded = (file: UploadedFile) => {
    setUploadedFiles((prev) => [...prev, file]);
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
  };

  const handleSendMessage = () => {
    if (message.trim() || (uploadedFiles.length > 0 && !isLoading)) {
      // Allow sending with only files
      let combinedMessage = message.trim();
      if (uploadedFiles.length > 0) {
        const fileContents = uploadedFiles
          .map(
            (file) =>
              `\n\n--- Content from ${file.name} ---\n${file.extractedText}`
          )
          .join("\n");
        combinedMessage += fileContents;
      }
      onSendMessage(combinedMessage);
      setMessage("");
      setUploadedFiles([]); // Clear uploaded files after sending
      setShowToolList(false);
      setToolInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTranscript = (transcript: string) => {
    setMessage((prev) => (prev ? prev + " " : "") + transcript);
  };

  return (
    <div className="relative w-full">
      {/* Chat Input Container */}
      <div className="bg-chat-background border border-sidebar-border rounded-lg p-3 shadow-lg">
        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="mb-3 space-y-2">
            <div className="text-xs text-chat-foreground/70 font-medium">
              Attached Files:
            </div>
            <div className="flex flex-wrap gap-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center gap-2 bg-sidebar-accent/50 border border-sidebar-border rounded-md px-3 py-2 text-sm"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span
                    className="text-chat-foreground truncate max-w-[200px]"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  <button
                    onClick={() => handleRemoveFile(file.name)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                    title="Remove file"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message or use '@' to call a tool..."
            className={cn(
              "min-h-[50px] max-h-[120px] pr-[150px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              "text-chat-foreground placeholder:text-chat-foreground/50",
              "custom-scroll"
            )}
            rows={1}
            disabled={isLoading}
          />

          {/* Action Buttons */}
          <div className="absolute bottom-2 right-2 flex items-center space-x-2 px-2">
            <FileUploader
              onFileUploaded={handleFileUploaded}
              uploadedFiles={uploadedFiles}
              onRemoveFile={handleRemoveFile}
              disabled={isLoading}
            />
            <VoiceRecorder
              onTranscript={handleTranscript}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              onClick={isLoading ? onStopGeneration : handleSendMessage}
              disabled={
                !isLoading && !message.trim() && uploadedFiles.length === 0
              }
              className={cn(
                "w-[36px] h-[36px]",
                isLoading
                  ? "bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/50"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
            >
              {isLoading ? (
                <Square className="h-4 w-4 fill-current" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tool Suggestions */}
      {showToolList && filteredTools.length > 0 && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-chat-background border border-sidebar-border rounded-lg shadow-xl z-20">
          <div className="p-2 border-b border-sidebar-border">
            <div className="text-xs text-chat-foreground/70 font-medium">
              Available Tools:
            </div>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {filteredTools.map((tool) => (
              <div
                key={tool.name}
                className="px-4 py-3 cursor-pointer hover:bg-sidebar-accent/50 transition-colors flex flex-col items-start border-b border-sidebar-border/50 last:border-b-0"
                onClick={() => handleToolSelect(tool)}
              >
                <span className="font-medium text-primary text-sm">
                  {tool.name}
                </span>
                <span className="text-xs text-chat-foreground/70 mt-1">
                  {tool.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
