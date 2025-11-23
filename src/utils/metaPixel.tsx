// Declare fbq on window to fix TypeScript errors
declare global {
  interface Window {
    fbq: (action: string, eventName: string, data?: any) => void;
  }
}

export const trackPageView = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

export const trackEvent = (eventName: string, data = {}) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, data);
  }
};
