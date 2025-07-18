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
import { supabase } from "@/lib/supabaseClient";
import { buildFileTreeFromPathsWithFullPaths } from "@/lib/transformSupabase";

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
}

const BUCKET_NAME = "test-bucket";
const FOLDER_PREFIX = "user1/project23";

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
          {node.type === "file" && node.extension && (
            <span className="text-xs text-sidebar-foreground/50 font-mono">
              .{node.extension}
            </span>
          )}
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

      // Add extension information to file nodes
      const addExtensions = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.type === "file") {
            return {
              ...node,
              extension: getFileExtension(node.name),
            };
          } else if (node.children) {
            return {
              ...node,
              children: addExtensions(node.children),
            };
          }
          return node;
        });
      };

      setFileTree(addExtensions(tree));
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
