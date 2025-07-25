// MCP Server Configuration
export const MCP_CONFIG = {
  DEFAULT_SERVER_URL: "https://mcp-l1mh.onrender.com/chat",
  DEFAULT_SESSION_ID: "a8c11c8223b5bc2ef9080c91178899c9",
  TIMEOUT: 30000, // 30 seconds
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 10000,
  AUTO_SCROLL_DELAY: 100,
  DEFAULT_WELCOME_MESSAGE: `# Welcome! 🚀

Hello Sir, Tell me the **idea** which you want to bring to life. I will help you build it step by step.

## What I can help you with:

- **Research & Analysis**: Market research, competitor analysis, feasibility studies
- **Technical Planning**: Architecture design, technology stack recommendations
- **Implementation**: Step-by-step development guidance
- **Testing & Deployment**: Quality assurance and launch strategies

> Just describe your idea and I'll provide comprehensive guidance!

---

*Ready to start? Share your vision below!*`,
} as const;

// UI Configuration
export const UI_CONFIG = {
  IDEA_BOX_MAX_HEIGHT: "120px",
  CHAT_PANEL_MIN_HEIGHT: "400px",
  BUTTON_SIZES: {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  },
} as const;