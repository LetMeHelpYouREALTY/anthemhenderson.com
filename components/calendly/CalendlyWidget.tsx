"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { type CalendlyEvent, calendlyEventForPath, calendlyUrl } from "@/lib/calendly";

interface CalendlyWidgetProps {
  /** Booking event; defaults to the event for the current page. */
  event?: CalendlyEvent;
  minWidth?: string;
  height?: string;
}

type CalendlyWindow = Window & {
  Calendly?: { initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void };
};

export default function CalendlyWidget({ event, minWidth = "320px", height = "700px" }: CalendlyWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname() || "/";
  const url = calendlyUrl(event ?? calendlyEventForPath(pathname), "inline", pathname);

  // The widget script was never loaded on these pages, so the embed stayed blank.
  // onReady fires after first load and on every later mount (client navigation).
  const init = () => {
    const calendly = (window as CalendlyWindow).Calendly;
    if (!widgetRef.current || !calendly) return;
    widgetRef.current.innerHTML = "";
    calendly.initInlineWidget({ url, parentElement: widgetRef.current });
  };

  return (
    <>
      <div ref={widgetRef} style={{ minWidth, height, width: "100%" }} />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" onReady={init} />
    </>
  );
}
