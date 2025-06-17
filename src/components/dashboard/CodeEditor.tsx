
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { FileNode } from './FileExplorer';

interface CodeEditorProps {
  file: FileNode | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file }) => {
  const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'jsx':
        return 'jsx';
      case 'ts':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'html':
        return 'html';
      case 'json':
        return 'json';
      default:
        return 'text';
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-muted-foreground">Select a file to view its contents</p>
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

      {/* Code content */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          <pre className="text-sm leading-relaxed">
            <code className="block whitespace-pre-wrap break-words">
              {file.content || '// No content available'}
            </code>
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
};

export default CodeEditor;
