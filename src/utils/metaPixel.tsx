export const trackPageView = () => {
  if (typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  }
};

export const trackEvent = (eventName, data = {}) => {
  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, data);
  }
};
