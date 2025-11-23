import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackEvent } from "@/utils/metaPixel";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Always track page view
    trackPageView();

    // Track pricing page visit
    if (location.pathname === "/pricing") {
      trackEvent("ViewContent", {
        page: "Pricing Page",
      });
    }
  }, [location.pathname]);

  return null;
};

export default RouteTracker;
