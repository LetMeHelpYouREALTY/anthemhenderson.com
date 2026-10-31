"use client";

import { usePathname } from "next/navigation";
import SchemaScript from "@/components/SchemaScript";
import {
  combineSchemas,
  generateOrganizationSchema,
  generateRealEstateAgentSchema,
  generateWebSiteSchema,
} from "@/lib/schema";
import { buildPageSchemas, normalizePath } from "@/lib/page-seo";

/**
 * Injects sitewide LocalBusiness/WebSite schema plus per-route
 * WebPage + Breadcrumb + FAQ JSON-LD on every page.
 */
export default function RouteJsonLd() {
  // usePathname() resolves during prerender, so this JSON-LD is still in the
  // initial HTML without making the route dynamic.
  const pathname = normalizePath(usePathname() || "/");
  const sitewide = combineSchemas(
    generateRealEstateAgentSchema(),
    generateWebSiteSchema(),
    generateOrganizationSchema(),
  );
  const pageSchemas = buildPageSchemas(pathname);

  return (
    <>
      <SchemaScript id="sitewide-seo-schema" schema={sitewide} />
      <SchemaScript id="route-seo-schema" schema={pageSchemas} />
    </>
  );
}
