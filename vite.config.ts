import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8000,
    cors: true,
    allowedHosts: ['65a428fbbd04.ngrok-free.app'], // ✅ Updated ngrok subdomain
    // proxy: {
    //   '/api': {
    //     target: 'https://713f60dd7948.ngrok-free.app',
    //     changeOrigin: true,
    //     secure: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     headers: {
    //       // 'ngrok-skip-browser-warning': 'true'
    //     }
    //   }
    // }
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
}));
