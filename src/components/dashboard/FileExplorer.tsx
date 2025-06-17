
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
  content?: string;
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}

const mockFileStructure: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          {
            name: 'App.tsx',
            type: 'file',
            path: 'src/components/App.tsx',
            content: `import React from 'react';
import { Header } from './Header';
import { MainContent } from './MainContent';
import { Footer } from './Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default App;`
          },
          {
            name: 'Header.tsx',
            type: 'file',
            path: 'src/components/Header.tsx',
            content: `import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My App
        </h1>
      </div>
    </header>
  );
};`
          }
        ]
      },
      {
        name: 'styles',
        type: 'folder',
        path: 'src/styles',
        children: [
          {
            name: 'globals.css',
            type: 'file',
            path: 'src/styles/globals.css',
            content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`
          }
        ]
      },
      {
        name: 'main.tsx',
        type: 'file',
        path: 'src/main.tsx',
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
      }
    ]
  },
  {
    name: 'public',
    type: 'folder',
    path: 'public',
    children: [
      {
        name: 'index.html',
        type: 'file',
        path: 'public/index.html',
        content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
      }
    ]
  },
  {
    name: 'package.json',
    type: 'file',
    path: 'package.json',
    content: `{
  "name": "my-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`
  }
];

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  onFileSelect: (file: FileNode) => void;
  selectedFile: string | null;
}> = ({ node, level, onFileSelect, selectedFile }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0 ? true : false);

  const handleClick = () => {
    if (node.type === 'folder') {
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
        {node.type === 'folder' ? (
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
      {node.type === 'folder' && isExpanded && node.children && (
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

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect, selectedFile }) => {
  return (
    <div className="h-full bg-card border-r border-border">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Explorer</h3>
      </div>
      <div className="p-2 overflow-y-auto h-full">
        {mockFileStructure.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            level={0}
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </div>
    </div>
  );
};

export default FileExplorer;
export type { FileNode };
