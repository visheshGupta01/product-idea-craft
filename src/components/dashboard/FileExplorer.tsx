import React, { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  Code,
  Image,
  Music,
  Video,
  Archive,
  Database,
  FileCode,
  Globe,
  Settings,
  Palette,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/apiClient";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: FileNode[];
  content?: string;
  extension?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
  sessionId?: string;
}

// Build file tree from flat file list
const buildFileTree = (files: Array<{ path: string; content: string }>): FileNode[] => {
  const fileMap = new Map<string, FileNode>();
  
  // First pass: create all file and folder nodes
  files.forEach(file => {
    const parts = file.path.split('/');
    
    // Create all parent folders
    for (let i = 0; i < parts.length; i++) {
      const currentPath = parts.slice(0, i + 1).join('/');
      const isFile = i === parts.length - 1;
      
      if (!fileMap.has(currentPath)) {
        fileMap.set(currentPath, {
          name: parts[i],
          type: isFile ? 'file' : 'folder',
          path: currentPath,
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
          extension: isFile ? getFileExtension(parts[i]) : undefined
        });
      } else if (isFile && fileMap.has(currentPath)) {
        // Update existing file node with content
        const existingNode = fileMap.get(currentPath)!;
        existingNode.content = file.content;
      }
    }
  });
  
  // Second pass: build parent-child relationships
  const nodes = Array.from(fileMap.values());
  const rootNodes: FileNode[] = [];
  
  nodes.forEach(node => {
    if (node.path.includes('/')) {
      // Find parent
      const parentPath = node.path.substring(0, node.path.lastIndexOf('/'));
      const parent = fileMap.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    } else {
      // Root level node
      rootNodes.push(node);
    }
  });
  
  // Sort children in each folder (folders first, then files)
  const sortChildren = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  };
  
  nodes.forEach(node => {
    if (node.children) {
      node.children = sortChildren(node.children);
    }
  });
  
  return sortChildren(rootNodes);
};

// File extension to icon mapping
const getFileIcon = (extension: string) => {
  const ext = extension.toLowerCase();

  // Code files
  if (["js", "jsx", "ts", "tsx", "vue", "svelte"].includes(ext)) {
    return { icon: Code, color: "text-yellow-500" };
  }
  if (
    ["py", "rb", "php", "java", "c", "cpp", "cs", "go", "rs", "swift"].includes(
      ext
    )
  ) {
    return { icon: FileCode, color: "text-blue-500" };
  }
  if (["html", "htm", "xml", "xhtml"].includes(ext)) {
    return { icon: Globe, color: "text-orange-500" };
  }
  if (["css", "scss", "sass", "less", "styl"].includes(ext)) {
    return { icon: Palette, color: "text-pink-500" };
  }

  // Documents
  if (["txt", "md", "rst", "rtf"].includes(ext)) {
    return { icon: FileText, color: "text-gray-500" };
  }
  if (["pdf", "doc", "docx", "odt"].includes(ext)) {
    return { icon: FileText, color: "text-red-500" };
  }

  // Images
  if (
    ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp", "ico"].includes(ext)
  ) {
    return { icon: Image, color: "text-green-500" };
  }

  // Audio
  if (["mp3", "wav", "flac", "aac", "ogg", "m4a"].includes(ext)) {
    return { icon: Music, color: "text-purple-500" };
  }

  // Video
  if (["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"].includes(ext)) {
    return { icon: Video, color: "text-red-600" };
  }

  // Archives
  if (["zip", "rar", "7z", "tar", "gz", "bz2", "xz"].includes(ext)) {
    return { icon: Archive, color: "text-amber-600" };
  }

  // Database
  if (["sql", "db", "sqlite", "mdb"].includes(ext)) {
    return { icon: Database, color: "text-indigo-500" };
  }

  // Config files
  if (["json", "yml", "yaml", "toml", "ini", "cfg", "conf"].includes(ext)) {
    return { icon: Settings, color: "text-gray-600" };
  }

  // Executables
  if (["exe", "msi", "deb", "rpm", "dmg", "app"].includes(ext)) {
    return { icon: Download, color: "text-slate-700" };
  }

  // Default
  return { icon: File, color: "text-sidebar-foreground/60" };
};

// Extract file extension from filename
const getFileExtension = (filename: string): string => {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex > 0 ? filename.substring(lastDotIndex + 1) : "";
};

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}> = ({ node, level, onFileSelect, selectedFile }) => {
const [isExpanded, setIsExpanded] = useState(
  level === 0 && node.type === "folder"
);

  const handleClick = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(node);
    }
  };

  const isSelected = selectedFile === node.path;

  // Get file icon and color based on extension
  const fileIconData =
    node.type === "file" ? getFileIcon(node.extension || "") : null;
  const FileIcon = fileIconData?.icon || File;
  const iconColor = fileIconData?.color || "text-sidebar-foreground/60";

  return (
    <div>
      <div
        className={cn(
          "flex items-center py-1 px-2 cursor-pointer hover:bg-sidebar-accent rounded-sm transition-colors",
          "text-sidebar-foreground",
          isSelected && "bg-sidebar-accent text-sidebar-foreground"
        )}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 mr-1 text-sidebar-foreground/60" />
            ) : (
              <ChevronRight className="w-4 h-4 mr-1 text-sidebar-foreground/60" />
            )}
            {isExpanded ? (
              <FolderOpen className="w-4 h-4 mr-2 text-accent" />
            ) : (
              <Folder className="w-4 h-4 mr-2 text-accent" />
            )}
          </>
        ) : (
          <>
            <div className="w-5 mr-1" />
            <FileIcon className={cn("w-4 h-4 mr-2", iconColor)} />
          </>
        )}
        <span className="text-sm truncate flex items-center gap-1">
          {node.name}
        </span>
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
  sessionId,
}) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [files, setFiles] = useState<Array<{ path: string; content: string }>>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!sessionId) {
        setFileTree([]);
        setFiles([]);
        return;
      }

      try {
        const response = await apiClient.get(`/project/code?session_id=${sessionId}`);
        
        if (response.data.files) {
          const filesWithContent = response.data.files.map((file: { path: string; content: string }) => ({
            path: file.path,
            content: file.content
          }));
          
          setFiles(filesWithContent);
          const tree = buildFileTree(filesWithContent);
          setFileTree(tree);
        }
      } catch (error) {
        console.error('Error fetching project files:', error);
        setFileTree([]);
        setFiles([]);
      }
    };

    fetchFiles();
  }, [sessionId]);

  const handleFileSelect = (node: FileNode) => {
    if (node.type !== "file") return;
    
    // Find the file content from our fetched files
    const fileWithContent = files.find(f => f.path === node.path);
    if (fileWithContent) {
      onFileSelect({ ...node, content: fileWithContent.content });
    }
  };

  return (
    <div className="h-full bg-sidebar-background border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border">
        <h3 className="text-sm font-medium text-sidebar-foreground">
          Explorer
        </h3>
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
