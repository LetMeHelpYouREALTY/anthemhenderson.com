import { MetadataRoute } from "next";
import { getAllSeoPaths } from "@/lib/page-seo";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const lastModified = new Date();

  const priorityFor = (path: string): number => {
    if (path === "/") return 1;
    if (
      path.startsWith("/55-plus-communities/sun-city-anthem") ||
      path.startsWith("/55-plus-communities/solera-anthem") ||
      path === "/listings" ||
      path === "/contact" ||
      path === "/buyers" ||
      path === "/sellers"
    ) {
      return 0.9;
    }
    if (path.startsWith("/55-plus") || path.startsWith("/neighborhoods/henderson")) {
      return 0.85;
    }
    if (path.startsWith("/buyers") || path.startsWith("/sellers") || path === "/luxury-homes") {
      return 0.8;
    }
    return 0.7;
  };

  const changeFor = (path: string): MetadataRoute.Sitemap[0]["changeFrequency"] => {
    if (path === "/" || path === "/listings" || path.startsWith("/market")) return "weekly";
    return "monthly";
  };

  return getAllSeoPaths()
    .filter((path) => path !== "/security-policy")
    .map((path) => ({
      url: path === "/" ? baseUrl : `${baseUrl}${path}`,
      lastModified,
      changeFrequency: changeFor(path),
      priority: priorityFor(path),
    }));
}
