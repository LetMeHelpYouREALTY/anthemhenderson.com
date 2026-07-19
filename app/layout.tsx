import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import RouteJsonLd from "@/components/seo/RouteJsonLd";
import { createPageMetadata, normalizePath } from "@/lib/page-seo";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(): Promise<Metadata> {
  const pathname = normalizePath(headers().get("x-pathname") || "/");
  const pageMeta = createPageMetadata(pathname);
  const pageTitle =
    typeof pageMeta.title === "string"
      ? pageMeta.title
      : "Homes for Sale in Anthem Henderson, NV";

  return {
    ...pageMeta,
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${pageTitle} | Anthem Henderson | Homes By Dr. Jan Duffy`,
      template: "%s | Anthem Henderson | Homes By Dr. Jan Duffy",
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.className} dark`}>
      <body className="antialiased">
        <RouteJsonLd />
        <Script
          src="https://em.realscout.com/widgets/realscout-web-components.umd.js"
          type="module"
          strategy="afterInteractive"
        />
        <Script id="widget-tracker" strategy="afterInteractive">{`
          (function(w,i,d,g,e,t){w["WidgetTrackerObject"]=g;(w[g]=w[g]||function()
          {(w[g].q=w[g].q||[]).push(arguments);}),(w[g].ds=1*new Date());(e="script"),
          (t=d.createElement(e)),(e=d.getElementsByTagName(e)[0]);t.async=1;t.src=i;
          e.parentNode.insertBefore(t,e);})
          (window,"https://widgetbe.com/agent",document,"widgetTracker");
          window.widgetTracker("create","WT-XQHVYQWW");
          window.widgetTracker("send","pageview");
        `}</Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
