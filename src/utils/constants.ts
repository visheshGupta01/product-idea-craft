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
      features: [
        "5 prompts free per month (hard cap)",
        "Basic prompt-to-build flow",
        "Public projects only",
        "Limited AI generations",
        "Watermarked 'Built with imagine.bo'",
        "Community support",
      ],
      button: "Get Starter Plan",
      planId: 1,
      credits: 6,
    },
    {
      name: "Pro",
      price: 25,
      desc: "For **creators and indie founders** who want more flexibility and privacy.",
      features: [
        "150 credits / month",
        "Custom domains",
        "Remove imagine.bo badge",
        "Private projects",
        "10GB storage",
        "Rollover enabled",
        "SDE support in 24 hrs",
      ],
      button: "Get Pro Plan",
      planId: 2,
      credits: 150,
    },
    {
      name: "Enterprise",
      price: 250,
      desc: "For **teams and businesses** that need advanced features, scalability, and priority support.",
      features: [
        "2000 credits",
        "200GB storage",
        "Dedicated CSM for onboarding",
        "SDE support within 12 hours",
      ],
      button: "Get Enterprise Plan",
      planId: 3,
      credits: 2000,
    },
  ],
} as const;