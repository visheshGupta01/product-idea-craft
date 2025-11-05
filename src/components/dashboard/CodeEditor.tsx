import React from "react";
  import Editor from "@monaco-editor/react";
import type { FileNode } from "./FileExplorer";

interface CodeEditorProps {
  file: FileNode | null;
  onContentChange?: (content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onContentChange }) => {
  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "tsx":
        return "typescript";
      case "jsx":
        return "javascript";
      case "ts":
        return "typescript";
      case "js":
        return "javascript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      default:
        return "plaintext";
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-sidebar-background">
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-sidebar-foreground/60">
            Select a file to view its contents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-sidebar-background">
      {/* File tab */}
      <div className="border-b border-sidebar-border bg-sidebar-background">
        <div className="flex items-center px-4 py-2">
          <span className="text-sm font-medium text-sidebar-foreground">{file.name}</span>
          <span className="ml-2 text-xs text-sidebar-foreground/60">
            {getLanguageFromExtension(file.name)}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getLanguageFromExtension(file.name)}
          value={file.content || "// No content available"}
          theme="vs-dark"
          onChange={(value) => onContentChange?.(value || '')}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            theme: 'vs-dark',
            readOnly: true,
            contextmenu: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            suggestOnTriggerCharacters: false,
            acceptSuggestionOnEnter: "off",
            tabCompletion: "off",
            wordBasedSuggestions: "off"
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
