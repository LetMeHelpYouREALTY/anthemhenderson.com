"use client";

import { useEffect } from "react";
import Script from "next/script";
import "./types";

interface CalendlyBadgeProps {
  url?: string;
  text?: string;
  color?: string;
  textColor?: string;
  branding?: boolean;
}

export default function CalendlyBadge({
  url = "https://calendly.com/drjanduffy/showing",
  text = "Schedule time with me",
  color = "#0069ff",
  textColor = "#ffffff",
  branding = true,
}: CalendlyBadgeProps) {
  useEffect(() => {
    // Initialize badge widget when Calendly script is loaded
    const initBadge = () => {
      if (window.Calendly) {
        window.Calendly.initBadgeWidget({
          url,
          text,
          color,
          textColor,
          branding,
        });
      }
    };

    // Check if Calendly is already loaded
    if (window.Calendly) {
      initBadge();
    } else {
      // Wait for script to load
      window.addEventListener("calendly-loaded", initBadge);
    }

    return () => {
      window.removeEventListener("calendly-loaded", initBadge);
    };
  }, [url, text, color, textColor, branding]);

  return (
    <>
      <link
        href="https://assets.calendly.com/assets/external/widget.css"
        rel="stylesheet"
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.Calendly) {
            window.Calendly.initBadgeWidget({
              url,
              text,
              color,
              textColor,
              branding,
            });
          }
        }}
      />
    </>
  );
}
