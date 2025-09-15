import React, { useState } from "react";
import FileExplorer, { FileNode } from "./FileExplorer";
import CodeEditor from "./CodeEditor";

const IDE: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);

  return (
    <div className="flex mb-3 h-screen p-3">
      <div className="w-64 border-r rounded-lg overflow-hidden">
        <FileExplorer
          onFileSelect={(file) => setSelectedFile(file)}
          selectedFile={selectedFile?.path || null}
        />
      </div>

      <div className="flex-1 ml-3 rounded-lg overflow-hidden">
        <CodeEditor file={selectedFile} />
      </div>
    </div>
  );
};

export default IDE;
