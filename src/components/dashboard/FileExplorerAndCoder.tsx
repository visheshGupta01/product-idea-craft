import React, { useState } from "react";
import FileExplorer, { FileNode } from "./FileExplorer";
import CodeEditor from "./CodeEditor";

const IDE: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar: File Explorer */}
      <div className="w-64 border-r">
        <FileExplorer
          onFileSelect={(file) => setSelectedFile(file)}
          selectedFile={selectedFile?.path || null}
        />
      </div>

      {/* Main Panel: Code Editor */}
      <div className="flex-1">
        <CodeEditor file={selectedFile} />
      </div>
    </div>
  );
};

export default IDE;
