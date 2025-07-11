import React from "react";
import Editor from "@monaco-editor/react";
import type { FileNode } from "./FileExplorer";

interface CodeEditorProps {
  file: FileNode | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file }) => {
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
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-muted-foreground">
            Select a file to view its contents
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* File tab */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center px-4 py-2">
          <span className="text-sm font-medium">{file.name}</span>
          <span className="ml-2 text-xs text-muted-foreground">
            {getLanguageFromExtension(file.name)}
          </span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={getLanguageFromExtension(file.name)} // ← use `language`, not `defaultLanguage`
          value={file.content || "// No content available"} // ← use `value`, not `defaultValue`
          theme="vs-dark"
          options={{
            readOnly: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
