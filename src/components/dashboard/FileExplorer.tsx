import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { buildFileTreeFromPathsWithFullPaths } from "@/lib/transformSupabase";


export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}

const BUCKET_NAME = "test-bucket"
const FOLDER_PREFIX = "user1/project23"

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}> = ({ node, level, onFileSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0 ? true : false);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const isSelected = selectedFile === node.path;

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer hover:bg-muted/50 rounded-sm transition-colors",
          isSelected && "bg-accent text-accent-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            )}
          </>
        ) : (
          <>
            <div className="w-5 mr-1" />
            <File className="w-4 h-4 mr-2 text-muted-foreground" />
          </>
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  onFileSelect,
  selectedFile,
}) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
const allFiles: { relativePath: string; fullPath: string }[] = [];

      const walk = async (prefix: string) => {
        const { data, error } = await supabase.storage
          .from(BUCKET_NAME)
          .list(prefix, { limit: 1000 });

        if (error) {
          console.error("List error:", error);
          return;
        }

        for (const item of data) {
          const fullPath = prefix ? `${prefix}/${item.name}` : item.name;

          if (item.metadata) {
            const relativePath = fullPath.replace(`${FOLDER_PREFIX}/`, "");
            allFiles.push({ relativePath, fullPath });
          } else {
            await walk(fullPath); // recurse into subfolders
          }
        }
      };




      await walk(FOLDER_PREFIX);
const tree = buildFileTreeFromPathsWithFullPaths(allFiles);
      setFileTree(tree);
    };

    fetchFiles();
  }, []);

  const handleFileSelect = async (node: FileNode) => {
    if (node.type !== "file") return;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(node.path);

    if (data) {
      const text = await data.text();
      onFileSelect({ ...node, content: text });
    } else {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Explorer</h3>
      </div>
      <div className="p-2 overflow-y-auto h-full">
        {fileTree.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            level={0}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
