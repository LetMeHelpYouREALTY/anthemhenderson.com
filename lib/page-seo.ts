/**
 * Anthem Henderson page SEO / GEO / AEO registry
 * Single source for titles, descriptions, breadcrumbs, FAQs, and JSON-LD builders.
 */

import type { Metadata } from "next";
import { siteConfig, agentInfo, officeInfo } from "@/lib/site-config";
import {
  combineSchemas,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateWebPageSchema,
  type BreadcrumbItem,
  type FAQItem,
} from "@/lib/schema";
import { FAQ_DOMAIN_OVERRIDES, FAQ_BY_PAGE_TYPE } from "@/lib/faq-config";

const BASE_URL = siteConfig.url;
const BRAND = "Anthem Henderson | Homes By Dr. Jan Duffy";
const PHONE = agentInfo.phoneFormatted;

export type PageSeoEntry = {
  path: string;
  title: string;
  description: string;
  keywords?: string[];
  breadcrumbs: BreadcrumbItem[];
  faqs?: FAQItem[];
  /** GEO focus phrase for local intent */
  geoFocus?: string;
  /** Direct answer for AEO (shown via data-speakable / FAQ lead) */
  directAnswer?: string;
};

const anthemFaqs = FAQ_DOMAIN_OVERRIDES["anthemhenderson.com"] ?? FAQ_BY_PAGE_TYPE.community;
const buyerFaqs = FAQ_BY_PAGE_TYPE.search;
const sellerFaqs = FAQ_BY_PAGE_TYPE.search;
const plusFaqs = FAQ_BY_PAGE_TYPE["55plus"];
const luxuryFaqs = FAQ_BY_PAGE_TYPE.luxury;

function crumbs(...items: BreadcrumbItem[]): BreadcrumbItem[] {
  return [{ name: "Home", url: "/" }, ...items];
}

function page(
  path: string,
  title: string,
  description: string,
  breadcrumbs: BreadcrumbItem[],
  extras: Partial<PageSeoEntry> = {}
): PageSeoEntry {
  return {
    path,
    title,
    description,
    breadcrumbs,
    faqs: anthemFaqs.slice(0, 4),
    geoFocus: "Anthem Henderson, NV",
    ...extras,
  };
}

/** Full route registry — every public page */
export const PAGE_SEO: Record<string, PageSeoEntry> = {
  "/": page(
    "/",
    "Homes for Sale in Anthem Henderson, NV",
    `Browse Anthem Henderson homes for sale — Sun City Anthem, Solera, Country Club, and Highlands. ${BRAND}. Call ${PHONE}.`,
    [{ name: "Home", url: "/" }],
    {
      keywords: [
        "Anthem Henderson homes for sale",
        "Sun City Anthem",
        "Solera at Anthem",
        "Homes By Dr. Jan Duffy",
      ],
      faqs: anthemFaqs,
      directAnswer:
        "Anthem Henderson is a 4,775-acre master plan in Henderson, NV with 14,000+ homes across Sun City Anthem, Solera, Country Club, Highlands, and more. Call Dr. Jan Duffy at 702-222-1964 for live comps.",
    }
  ),
  "/about": page(
    "/about",
    "About Dr. Jan Duffy — Anthem Henderson REALTOR®",
    `Meet Dr. Jan Duffy, BHHS Nevada Properties — Anthem Henderson specialist for buyers and sellers. License ${agentInfo.license}. Call ${PHONE}.`,
    crumbs({ name: "About", url: "/about" }),
    { faqs: anthemFaqs.slice(0, 3) }
  ),
  "/contact": page(
    "/contact",
    "Contact Dr. Jan Duffy — Anthem Henderson Real Estate",
    `Call or text ${PHONE} to buy or sell in Anthem Henderson. Office: ${officeInfo.address.full}.`,
    crumbs({ name: "Contact", url: "/contact" }),
    {
      faqs: [
        {
          question: "How do I reach Dr. Jan Duffy?",
          answer: `Call or text ${PHONE}. She answers her own phone. Office visits at ${officeInfo.address.full}, Mon–Fri 9am–6pm, Sat 10am–4pm.`,
        },
        ...anthemFaqs.slice(0, 2),
      ],
    }
  ),
  "/faq": page(
    "/faq",
    "Anthem Henderson Real Estate FAQ",
    `Answers about buying and selling in Anthem Henderson — HOAs, Sun City Anthem vs Solera, pricing, and working with Dr. Jan Duffy.`,
    crumbs({ name: "FAQ", url: "/faq" }),
    { faqs: anthemFaqs }
  ),
  "/listings": page(
    "/listings",
    "Anthem Henderson MLS Listings",
    `Live MLS homes for sale serving Anthem Henderson and Henderson NV. Search with ${BRAND}.`,
    crumbs({ name: "Listings", url: "/listings" })
  ),
  "/buyers": page(
    "/buyers",
    "Buy a Home in Anthem Henderson",
    `Buyer representation for Anthem Henderson — comps, private showings, and offer strategy. ${BRAND}. Call ${PHONE}.`,
    crumbs({ name: "Buyers", url: "/buyers" }),
    { faqs: buyerFaqs.slice(0, 4) }
  ),
  "/buyers/california-relocator": page(
    "/buyers/california-relocator",
    "California to Anthem Henderson Relocation",
    `Relocating from California to Anthem Henderson? Dr. Jan Duffy handles tours, comps, and closing. Call ${PHONE}.`,
    crumbs(
      { name: "Buyers", url: "/buyers" },
      { name: "California Relocator", url: "/buyers/california-relocator" }
    ),
    { faqs: FAQ_BY_PAGE_TYPE.lifestyle?.slice(0, 4) ?? buyerFaqs.slice(0, 4) }
  ),
  "/buyers/first-time-buyers": page(
    "/buyers/first-time-buyers",
    "First-Time Buyers in Anthem & Henderson",
    `First-time buyer guidance for Henderson and Anthem — financing paths, comps, and inspection support. Call ${PHONE}.`,
    crumbs(
      { name: "Buyers", url: "/buyers" },
      { name: "First-Time Buyers", url: "/buyers/first-time-buyers" }
    )
  ),
  "/buyers/luxury-homes-las-vegas": page(
    "/buyers/luxury-homes-las-vegas",
    "Luxury Homes — Anthem Country Club & Henderson",
    `Luxury buyer representation for Anthem Country Club and Henderson estates. Discreet showings. Call ${PHONE}.`,
    crumbs(
      { name: "Buyers", url: "/buyers" },
      { name: "Luxury Homes", url: "/buyers/luxury-homes-las-vegas" }
    ),
    { faqs: luxuryFaqs.slice(0, 4) }
  ),
  "/sellers": page(
    "/sellers",
    "Sell Your Anthem Henderson Home",
    `List and sell in Anthem Henderson with floor-plan pricing and Anthem buyer targeting. ${BRAND}. Call ${PHONE}.`,
    crumbs({ name: "Sellers", url: "/sellers" }),
    { faqs: sellerFaqs.slice(0, 4) }
  ),
  "/sellers/move-up": page(
    "/sellers/move-up",
    "Move-Up Sellers in Anthem Henderson",
    `Sell and buy up within Anthem or Henderson — coordinated timing and comps. Call ${PHONE}.`,
    crumbs(
      { name: "Sellers", url: "/sellers" },
      { name: "Move-Up", url: "/sellers/move-up" }
    )
  ),
  "/sellers/downsizing": page(
    "/sellers/downsizing",
    "Downsizing to Sun City Anthem or Solera",
    `Downsizing from a larger home into Anthem 55+ communities? Dr. Jan maps Sun City Anthem vs Solera. Call ${PHONE}.`,
    crumbs(
      { name: "Sellers", url: "/sellers" },
      { name: "Downsizing", url: "/sellers/downsizing" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
  "/sellers/divorce-probate": page(
    "/sellers/divorce-probate",
    "Divorce & Probate Sales — Anthem Henderson",
    `Confidential divorce and probate real estate in Anthem Henderson and Henderson NV. Call ${PHONE}.`,
    crumbs(
      { name: "Sellers", url: "/sellers" },
      { name: "Divorce & Probate", url: "/sellers/divorce-probate" }
    )
  ),
  "/sellers/relocation": page(
    "/sellers/relocation",
    "Sell & Relocate from Anthem Henderson",
    `Selling your Anthem home for a move out of state? Timeline, pricing, and coordination with Dr. Jan. Call ${PHONE}.`,
    crumbs(
      { name: "Sellers", url: "/sellers" },
      { name: "Relocation", url: "/sellers/relocation" }
    )
  ),
  "/luxury-homes": page(
    "/luxury-homes",
    "Anthem Country Club & Luxury Homes",
    `Guard-gated Anthem Country Club and Henderson luxury listings. Private tours with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs({ name: "Luxury Homes", url: "/luxury-homes" }),
    { faqs: luxuryFaqs.slice(0, 4), geoFocus: "Anthem Country Club, Henderson NV" }
  ),
  "/new-construction": page(
    "/new-construction",
    "New Construction Near Anthem Henderson",
    `Buyer representation for new construction near Anthem and Henderson — incentives and contract review. Call ${PHONE}.`,
    crumbs({ name: "New Construction", url: "/new-construction" })
  ),
  "/investment-properties": page(
    "/investment-properties",
    "Investment Properties — Henderson & Anthem",
    `Investment property guidance in Henderson and the Anthem corridor. ROI analysis with Dr. Jan. Call ${PHONE}.`,
    crumbs({ name: "Investment Properties", url: "/investment-properties" }),
    { faqs: FAQ_BY_PAGE_TYPE.investment?.slice(0, 4) ?? buyerFaqs.slice(0, 4) }
  ),
  "/relocation": page(
    "/relocation",
    "Relocate to Anthem Henderson, NV",
    `Relocation specialist for moves into Anthem Henderson — neighborhood tours and live MLS. Call ${PHONE}.`,
    crumbs({ name: "Relocation", url: "/relocation" })
  ),
  "/home-valuation": page(
    "/home-valuation",
    "Anthem Henderson Home Valuation",
    `Free Anthem Henderson CMA by floor plan and lot. ${BRAND}. Call ${PHONE}.`,
    crumbs({ name: "Home Valuation", url: "/home-valuation" }),
    {
      faqs: [
        {
          question: "How do I get my Anthem home value?",
          answer: `Call ${PHONE}. Dr. Jan pulls live comps by floor plan, lot position, and upgrades — free, no obligation.`,
        },
        ...anthemFaqs.slice(0, 2),
      ],
    }
  ),
  "/market-report": page(
    "/market-report",
    "Anthem Henderson Market Report",
    `Anthem and Henderson market context — ask Dr. Jan for live sub-community comps. Call ${PHONE}.`,
    crumbs({ name: "Market Report", url: "/market-report" })
  ),
  "/market-update": page(
    "/market-update",
    "Anthem Henderson Market Update",
    `Current Anthem Henderson market update from Dr. Jan Duffy, BHHS Nevada Properties.`,
    crumbs({ name: "Market Update", url: "/market-update" })
  ),
  "/market-insights": page(
    "/market-insights",
    "Anthem & Henderson Market Insights",
    `Local market insights for Anthem Henderson buyers and sellers. Call ${PHONE}.`,
    crumbs({ name: "Market Insights", url: "/market-insights" })
  ),
  "/services": page(
    "/services",
    "Anthem Henderson Real Estate Services",
    `Buy, sell, 55+, luxury, and valuation services focused on Anthem Henderson. ${BRAND}.`,
    crumbs({ name: "Services", url: "/services" })
  ),
  "/google-business": page(
    "/google-business",
    "Google Business Profile — Dr. Jan Duffy",
    `GBP details for Dr. Jan Duffy, BHHS Nevada Properties — Anthem Henderson real estate. Call ${PHONE}.`,
    crumbs({ name: "Google Business", url: "/google-business" })
  ),
  "/why-berkshire-hathaway": page(
    "/why-berkshire-hathaway",
    "Why Berkshire Hathaway HomeServices — Anthem",
    `Why work with a BHHS Nevada Properties agent for Anthem Henderson. ${BRAND}.`,
    crumbs({ name: "Why BHHS", url: "/why-berkshire-hathaway" })
  ),
  "/security-policy": page(
    "/security-policy",
    "Security Policy — Anthemhenderson.com",
    `Security and responsible disclosure policy for anthemhenderson.com.`,
    crumbs({ name: "Security Policy", url: "/security-policy" }),
    { faqs: [] }
  ),
  "/neighborhoods": page(
    "/neighborhoods",
    "Anthem & Henderson Neighborhoods",
    `Explore Anthem Henderson sub-communities and greater Henderson neighborhoods with Dr. Jan Duffy.`,
    crumbs({ name: "Neighborhoods", url: "/neighborhoods" })
  ),
  "/neighborhoods/henderson": page(
    "/neighborhoods/henderson",
    "Henderson NV Homes — Including Anthem",
    `Henderson real estate guide with Anthem focus — master-planned communities and live MLS. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Henderson", url: "/neighborhoods/henderson" }
    ),
    { geoFocus: "Henderson, NV" }
  ),
  "/neighborhoods/summerlin": page(
    "/neighborhoods/summerlin",
    "Summerlin Homes — Compared with Anthem",
    `Summerlin homes for sale with guidance from Dr. Jan — compare with Anthem Henderson options. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Summerlin", url: "/neighborhoods/summerlin" }
    ),
    { geoFocus: "Summerlin, Las Vegas NV" }
  ),
  "/neighborhoods/green-valley": page(
    "/neighborhoods/green-valley",
    "Green Valley Henderson Homes",
    `Green Valley Henderson homes — nearby to Anthem. Expert guidance from Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Green Valley", url: "/neighborhoods/green-valley" }
    )
  ),
  "/neighborhoods/the-ridges": page(
    "/neighborhoods/the-ridges",
    "The Ridges Summerlin Luxury Homes",
    `The Ridges Summerlin luxury homes with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "The Ridges", url: "/neighborhoods/the-ridges" }
    ),
    { faqs: luxuryFaqs.slice(0, 3) }
  ),
  "/neighborhoods/southern-highlands": page(
    "/neighborhoods/southern-highlands",
    "Southern Highlands Homes for Sale",
    `Southern Highlands Las Vegas homes — compare with Anthem Henderson. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Southern Highlands", url: "/neighborhoods/southern-highlands" }
    )
  ),
  "/neighborhoods/north-las-vegas": page(
    "/neighborhoods/north-las-vegas",
    "North Las Vegas Homes for Sale",
    `North Las Vegas homes for sale with Dr. Jan Duffy, BHHS Nevada Properties. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "North Las Vegas", url: "/neighborhoods/north-las-vegas" }
    )
  ),
  "/neighborhoods/skye-canyon": page(
    "/neighborhoods/skye-canyon",
    "Skye Canyon Homes for Sale",
    `Skye Canyon Las Vegas homes — new construction and resale. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Skye Canyon", url: "/neighborhoods/skye-canyon" }
    )
  ),
  "/neighborhoods/centennial-hills": page(
    "/neighborhoods/centennial-hills",
    "Centennial Hills Homes for Sale",
    `Centennial Hills Las Vegas homes with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Centennial Hills", url: "/neighborhoods/centennial-hills" }
    )
  ),
  "/neighborhoods/inspirada": page(
    "/neighborhoods/inspirada",
    "Inspirada Henderson Homes for Sale",
    `Inspirada Henderson homes — master-planned living near Anthem. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Inspirada", url: "/neighborhoods/inspirada" }
    ),
    { geoFocus: "Inspirada, Henderson NV" }
  ),
  "/neighborhoods/mountains-edge": page(
    "/neighborhoods/mountains-edge",
    "Mountain's Edge Homes for Sale",
    `Mountain's Edge Las Vegas homes with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs(
      { name: "Neighborhoods", url: "/neighborhoods" },
      { name: "Mountain's Edge", url: "/neighborhoods/mountains-edge" }
    )
  ),
  "/55-plus-communities": page(
    "/55-plus-communities",
    "55+ Communities — Sun City Anthem & Solera",
    `Compare Anthem 55+ communities — Sun City Anthem and Solera at Anthem — with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs({ name: "55+ Communities", url: "/55-plus-communities" }),
    { faqs: plusFaqs.slice(0, 4), geoFocus: "Sun City Anthem & Solera, Henderson NV" }
  ),
  "/55-plus-communities/sun-city-anthem": page(
    "/55-plus-communities/sun-city-anthem",
    "Sun City Anthem Homes for Sale",
    `Sun City Anthem 55+ homes in Henderson — Del Webb resort amenities, live MLS, and comps. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Sun City Anthem", url: "/55-plus-communities/sun-city-anthem" }
    ),
    {
      faqs: anthemFaqs,
      geoFocus: "Sun City Anthem, Henderson NV",
      directAnswer:
        "Sun City Anthem is a Del Webb 55+ community in Anthem Henderson with 7,000+ homes and multiple recreation centers. Call 702-222-1964 for live listings.",
    }
  ),
  "/55-plus-communities/solera-anthem": page(
    "/55-plus-communities/solera-anthem",
    "Solera at Anthem Homes for Sale",
    `Solera at Anthem guard-gated 55+ homes — boutique scale vs Sun City Anthem. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Solera at Anthem", url: "/55-plus-communities/solera-anthem" }
    ),
    { faqs: anthemFaqs, geoFocus: "Solera at Anthem, Henderson NV" }
  ),
  "/55-plus-communities/sun-city-summerlin": page(
    "/55-plus-communities/sun-city-summerlin",
    "Sun City Summerlin Homes for Sale",
    `Sun City Summerlin 55+ homes — compare with Sun City Anthem. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Sun City Summerlin", url: "/55-plus-communities/sun-city-summerlin" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
  "/55-plus-communities/del-webb-lake-las-vegas": page(
    "/55-plus-communities/del-webb-lake-las-vegas",
    "Del Webb Lake Las Vegas Homes",
    `Del Webb Lake Las Vegas 55+ homes with Dr. Jan Duffy. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Del Webb Lake Las Vegas", url: "/55-plus-communities/del-webb-lake-las-vegas" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
  "/55-plus-communities/heritage-stonebridge": page(
    "/55-plus-communities/heritage-stonebridge",
    "Heritage Stonebridge Homes for Sale",
    `Heritage at Stonebridge 55+ Summerlin homes. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Heritage Stonebridge", url: "/55-plus-communities/heritage-stonebridge" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
  "/55-plus-communities/trilogy-summerlin": page(
    "/55-plus-communities/trilogy-summerlin",
    "Trilogy at Summerlin Homes for Sale",
    `Trilogy at Sunstone / Summerlin 55+ homes. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Trilogy Summerlin", url: "/55-plus-communities/trilogy-summerlin" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
  "/55-plus-communities/sun-city-aliante": page(
    "/55-plus-communities/sun-city-aliante",
    "Sun City Aliante Homes for Sale",
    `Sun City Aliante 55+ homes in North Las Vegas. Call ${PHONE}.`,
    crumbs(
      { name: "55+ Communities", url: "/55-plus-communities" },
      { name: "Sun City Aliante", url: "/55-plus-communities/sun-city-aliante" }
    ),
    { faqs: plusFaqs.slice(0, 4) }
  ),
};

export function normalizePath(pathname: string): string {
  if (!pathname) return "/";
  const clean = pathname.split("?")[0].split("#")[0];
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function getPageSeo(pathname: string): PageSeoEntry {
  const path = normalizePath(pathname);
  if (PAGE_SEO[path]) return PAGE_SEO[path];

  // Dynamic listings
  if (path.startsWith("/listings/")) {
    return page(
      path,
      "Anthem Henderson Property Details",
      `Property details and Anthem Henderson market context from ${BRAND}. Call ${PHONE}.`,
      crumbs(
        { name: "Listings", url: "/listings" },
        { name: "Property", url: path }
      )
    );
  }

  return page(
    path,
    BRAND,
    siteConfig.description,
    crumbs({ name: "Page", url: path }),
    { faqs: anthemFaqs.slice(0, 3) }
  );
}

export function createPageMetadata(pathname: string): Metadata {
  const seo = getPageSeo(pathname);
  const canonical = `${BASE_URL}${seo.path === "/" ? "" : seo.path}`;
  // Homepage uses absolute title (avoids Next template edge cases on `/`).
  // Other routes use a short title; layout template appends the brand.
  const ogTitle = `${seo.title} | ${BRAND}`;
  const title =
    seo.path === "/"
      ? { absolute: ogTitle }
      : seo.title;

  return {
    title,
    description: seo.description,
    keywords: seo.keywords ?? [
      seo.geoFocus ?? "Anthem Henderson",
      "Homes By Dr. Jan Duffy",
      "Henderson NV real estate",
    ],
    authors: [{ name: "Dr. Jan Duffy" }],
    creator: BRAND,
    publisher: "Berkshire Hathaway HomeServices Nevada Properties",
    alternates: {
      canonical,
    },
    openGraph: {
      title: ogTitle,
      description: seo.description,
      url: canonical,
      siteName: BRAND,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${BASE_URL}/realty/heroes/hero-homes-for-sale.png`,
          width: 1536,
          height: 1024,
          alt: "Anthem Henderson homes — Homes By Dr. Jan Duffy",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: seo.description,
      images: [`${BASE_URL}/realty/heroes/hero-homes-for-sale.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": "US-NV",
      "geo.placename": seo.geoFocus ?? "Anthem Henderson, NV",
      "geo.position": `${officeInfo.coordinates.lat};${officeInfo.coordinates.lng}`,
      ICBM: `${officeInfo.coordinates.lat}, ${officeInfo.coordinates.lng}`,
      "llms-txt": `${BASE_URL}/llms.txt`,
    },
  };
}

export function buildPageSchemas(pathname: string): Record<string, unknown> {
  const seo = getPageSeo(pathname);
  const schemas: Record<string, unknown>[] = [
    generateWebPageSchema({
      name: seo.title,
      description: seo.description,
      url: seo.path,
      dateModified: new Date().toISOString().slice(0, 10),
      speakable: true,
    }),
    generateBreadcrumbSchema(seo.breadcrumbs),
  ];

  if (seo.faqs && seo.faqs.length > 0) {
    schemas.push(generateFAQSchema(seo.faqs));
  }

  return combineSchemas(...schemas);
}

export function getAllSeoPaths(): string[] {
  return Object.keys(PAGE_SEO);
}
