// API Configuration - Centralized endpoint management

// Base URLs for different environments
export const API_BASE_URLS = {
  LOCAL: "http://localhost:8000",
  PRODUCTION: "https://dev.imagine.bo",
} as const;

// Current environment - change this to switch between environments
export const CURRENT_ENV = "LOCAL"; // or "PRODUCTION"
export const API_BASE_URL = API_BASE_URLS[CURRENT_ENV];

// WebSocket URLs
export const WS_BASE_URLS = {
  LOCAL: "ws://localhost:8000",
  PRODUCTION: "wss://dev.imagine.bo",
} as const;

export const WS_BASE_URL = WS_BASE_URLS[CURRENT_ENV];

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    VERIFY: "/api/auth/verify",
    FORGOT_PASSWORD: "/api/auth/forget-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    REFRESH_TOKEN: "/api/auth/refresh-token",
  },

  // Chat & Sessions
  CHAT: {
    SESSION_CREATE: "/api/chat/session/create",
    SESSION_CONTENT: "/api/chat/session/content",
    WEBSOCKET: "/api/chat/ws",
  },

  // Projects
  PROJECT: {
    LIST: "/api/projects",
    CODE: "/api/project/code",
    RENAME: "/api/project/rename",
  },

  // Profile
  PROFILE: {
    GET: "/api/profile",
    UPDATE: "/api/profile", // Note: different from GET endpoint
  },

  // Admin
  ADMIN: {
    DASHBOARD: "/api/admin/dashboard",
    USERS: "/api/admin/users",
  },

  // Developer
  DEVELOPER: {
    PROFILE: "/api/developer/profile",
    TASKS: "/api/developer/tasks",
    TASK_STATUS: "/api/task/status",
    LIST: "/api/developers",
  },

  // Task Management
  TASK: {
    CREATE: "/api/task/create",
  },

  // Payment
  PAYMENT: {
    CREATE_SESSION: "/api/payment/create-session",
  },

  // File Upload
  UPLOAD: {
    PDF: "/api/upload-pdf",
    AUDIO: "/api/audio",
  },

  // External Integrations
  INTEGRATIONS: {
    GITHUB: "/api/github",
    VERCEL: "/api/vercel/auth",
  },
} as const;

// Helper functions to build complete URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

export const buildWsUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  let url = `${WS_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }
  return url;
};

// Helper to build integration URLs with session ID
export const buildIntegrationUrl = (
  integration: "github" | "vercel",
  sessionId: string
): string => {
  const endpoint =
    integration === "github"
      ? API_ENDPOINTS.INTEGRATIONS.GITHUB
      : API_ENDPOINTS.INTEGRATIONS.VERCEL;
  return buildApiUrl(`${endpoint}?sessionid=${sessionId}`);
};

// Export for backward compatibility and direct access
export { API_BASE_URL as API_BASE_URL_LEGACY };
