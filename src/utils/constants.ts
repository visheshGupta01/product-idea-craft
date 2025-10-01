// WebSocket Configuration
export const WS_CONFIG = {
  BASE_URL: "ws://http://98.87.215.219:8000/ws",
  RECONNECT_ATTEMPTS: 3,
  RECONNECT_DELAY: 2000,
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

// Pricing Plans Configuration
export const PRICING_PLANS = {
  MONTHLY: [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for **early-stage builders** exploring AI-generated sites.",
      features: ["Generate up to 3 projects/month", "Access to core AI prompts"],
      button: "Get Starter Plan",
      planId: 1,
      credits: 5,
    },
    {
      name: "Pro",
      price: 19,
      desc: "For **creators and indie founders** who want more flexibility.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
      ],
      button: "Get Pro Plan",
      planId: 2,
      credits: 150,
    },
    {
      name: "Team",
      price: 49,
      desc: "For **growing businesses** with advanced needs.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
        "Export code (HTML/CSS)",
      ],
      button: "Get Team Plan",
      planId: 3,
      credits: 5000,
    },
  ],
  YEARLY: [
    {
      name: "Free",
      price: 0,
      desc: "Perfect for **early-stage builders** exploring AI-generated sites.",
      features: ["Generate up to 3 projects/month", "Access to core AI prompts"],
      button: "Get Starter Plan",
      planId: 1,
      credits: 5,
    },
    {
      name: "Pro",
      price: 190,
      desc: "Annual Pro plan for **creators and indie founders** with 2 months free.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
      ],
      button: "Get Pro Plan",
      planId: 2,
      credits: 1800,
    },
    {
      name: "Team",
      price: 490,
      desc: "Best value for **growing businesses** and fast-growing teams.",
      features: [
        "Unlimited projects",
        "Custom domains",
        "Full prompt library access",
        "Export code (HTML/CSS)",
      ],
      button: "Get Team Plan",
      planId: 3,
      credits: 60000,
    },
  ],
} as const;