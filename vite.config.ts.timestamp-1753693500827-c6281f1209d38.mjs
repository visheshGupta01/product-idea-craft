// vite.config.ts
import { defineConfig } from "file:///D:/Vishesh%20Gupta/product-idea-craft/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Vishesh%20Gupta/product-idea-craft/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///D:/Vishesh%20Gupta/product-idea-craft/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "D:\\Vishesh Gupta\\product-idea-craft";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8e3,
    cors: true,
    allowedHosts: ["65a428fbbd04.ngrok-free.app"]
    // ✅ Updated ngrok subdomain
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
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxWaXNoZXNoIEd1cHRhXFxcXHByb2R1Y3QtaWRlYS1jcmFmdFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcVmlzaGVzaCBHdXB0YVxcXFxwcm9kdWN0LWlkZWEtY3JhZnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L1Zpc2hlc2glMjBHdXB0YS9wcm9kdWN0LWlkZWEtY3JhZnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XHJcbiAgc2VydmVyOiB7XHJcbiAgICBob3N0OiBcIjAuMC4wLjBcIixcclxuICAgIHBvcnQ6IDgwMDAsXHJcbiAgICBjb3JzOiB0cnVlLFxyXG4gICAgYWxsb3dlZEhvc3RzOiBbJzY1YTQyOGZiYmQwNC5uZ3Jvay1mcmVlLmFwcCddLCAvLyBcdTI3MDUgVXBkYXRlZCBuZ3JvayBzdWJkb21haW5cclxuICAgIC8vIHByb3h5OiB7XHJcbiAgICAvLyAgICcvYXBpJzoge1xyXG4gICAgLy8gICAgIHRhcmdldDogJ2h0dHBzOi8vNzEzZjYwZGQ3OTQ4Lm5ncm9rLWZyZWUuYXBwJyxcclxuICAgIC8vICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAvLyAgICAgc2VjdXJlOiB0cnVlLFxyXG4gICAgLy8gICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAvLyAgICAgaGVhZGVyczoge1xyXG4gICAgLy8gICAgICAgLy8gJ25ncm9rLXNraXAtYnJvd3Nlci13YXJuaW5nJzogJ3RydWUnXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9XHJcbiAgfSxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJlxyXG4gICAgY29tcG9uZW50VGFnZ2VyKCksXHJcbiAgXS5maWx0ZXIoQm9vbGVhbiksXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pKTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFtUyxTQUFTLG9CQUFvQjtBQUNoVSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsdUJBQXVCO0FBSGhDLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxPQUFPO0FBQUEsRUFDekMsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sY0FBYyxDQUFDLDZCQUE2QjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLEVBWTlDO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixTQUFTLGlCQUNULGdCQUFnQjtBQUFBLEVBQ2xCLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
