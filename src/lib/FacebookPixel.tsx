// components/FacebookPixel.tsx
import { useEffect } from "react";

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

type Props = {
  pixelId?: string;
  enabled?: boolean;
};

export default function FacebookPixel({
  pixelId = "25373752758899975",
  enabled = true,
}: Props) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled) return;

    // if already initialized, just track page view
    if (window.fbq) {
      try {
        window.fbq("init", pixelId);
        window.fbq("track", "PageView");
      } catch {
        /* ignore */
      }
      return;
    }

    // Create the script element (lint-safe)
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";

    // Attach script to head
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);

    // Create a minimal fbq shim BEFORE the external script loads so calls don't break
    if (!window._fbq) {
      const n: any = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      } as any;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      window._fbq = n;
      window.fbq = n;
    }

    // Once loaded (best-effort: track after a tiny timeout allowing external script to initialize)
    const readyTimeout = window.setTimeout(() => {
      try {
        if (window.fbq) {
          window.fbq("init", pixelId);
          window.fbq("track", "PageView");
        }
      } catch {
        // ignore
      }
    }, 200); // 200ms is normally enough; you can increase if needed

    return () => {
      clearTimeout(readyTimeout);
      // do not remove script or fbq global — removing can break other pages or future events
    };
  }, [pixelId, enabled]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        alt="fb-pixel"
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
      />
    </noscript>
  );
}
