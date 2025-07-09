import type { FileSystemTree } from '@webcontainer/api';

export const files: FileSystemTree = {
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>React + Vite</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>`
    }
  },
  src: {
    directory: {
      'main.jsx': {
        file: {
          contents: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
        }
      },
      'App.jsx': {
        file: {
          contents: `export default function App() {
  return <h1>Hello from React + Vite (WebContainer)</h1>;
}`
        }
      }
    }
  },
  'package.json': {
    file: {
      contents: `{
  "name": "react-vite-app",
  "type": "module",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.0.0"
  }
}`
    }
  },
  'vite.config.js': {
    file: {
      contents: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});`
    }
  }
};
