import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    // Add CORS configuration if needed
    cors: true,
    // If you need to proxy API requests to avoid CORS issues
    proxy: {
      // Proxy API requests to avoid CORS issues
      '/api': {
        target: 'https://713f60dd7948.ngrok-free.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Remove allowedHosts as it's not a valid Vite config option
  // For ngrok, the main issue is CORS on your backend server
}));