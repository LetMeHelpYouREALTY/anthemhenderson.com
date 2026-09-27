import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Phone } from "lucide-react";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import SchemaScript from "@/components/SchemaScript";
import { createPageMetadata } from "@/lib/page-seo";
import { agentInfo } from "@/lib/site-config";
import {
  AMENITIES_PAGE_FAQS,
  ANTHEM_COMMUNITY_MAP,
  CURATED_ANTHEM_PLACES,
} from "@/lib/amenities/anthem-amenities";
import {
  combineSchemas,
  generateBreadcrumbSchema,
  generateCommunityPlaceSchema,
  generateItemListSchema,
} from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

export const metadata = createPageMetadata("/amenities");

const AmenityMap = dynamic(() => import("@/components/amenities/AmenityMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full animate-pulse rounded-xl border border-border bg-muted"
      style={{ minHeight: 420, height: 420 }}
      aria-hidden="true"
    />
  ),
});

const breadcrumbs = [
  { name: "Home", url: "/" },
  { name: "Nearby Amenities", url: "/amenities" },
];

const pageSchemas = combineSchemas(
  generateBreadcrumbSchema(breadcrumbs),
  generateItemListSchema(
    "Nearby amenities in Anthem Henderson",
    CURATED_ANTHEM_PLACES.map((p) => ({
      name: p.name,
      address: p.address,
      schemaType: p.schemaType,
      lat: p.lat,
      lng: p.lng,
    }))
  ),
  generateCommunityPlaceSchema({
    name: "Anthem Henderson, Nevada",
    description:
      "4,775-acre master-planned community in Henderson, NV — Sun City Anthem, Solera, Anthem Country Club, and Anthem Highlands.",
    address: ANTHEM_COMMUNITY_MAP.centerAddress,
    lat: ANTHEM_COMMUNITY_MAP.lat,
    lng: ANTHEM_COMMUNITY_MAP.lng,
  }),
  {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${siteConfig.url}#organization`,
    areaServed: [
      { "@type": "Place", name: "Anthem Henderson, NV" },
      { "@type": "Place", name: "Sun City Anthem" },
      { "@type": "Place", name: "Solera at Anthem" },
      { "@type": "Place", name: "Anthem Country Club" },
      { "@type": "Place", name: "Anthem Highlands" },
    ],
  }
);

const writtenSections = [
  {
    id: "dining",
    title: "Dining near Anthem Henderson",
    body: [
      "Sun City Anthem residents often start at Yorktown Grill inside the Anthem Center on Hampton Road — on-site dining without leaving the 55+ village.",
      "For broader choices, Horizon Marketplace on South Eastern Avenue and The District at Green Valley Ranch add national chains and local restaurants within a short drive of most Anthem addresses.",
    ],
  },
  {
    id: "recreation",
    title: "Parks & recreation",
    body: [
      "Three Sun City Anthem recreation centers — Anthem Center, Independence Center, and Liberty Center — anchor active-adult life with pools, fitness, pickleball, and club programming.",
      "Sloan Canyon National Conservation Area sits west of Anthem with petroglyph trails and desert scenery; foothill neighborhoods connect via designated trail access points.",
    ],
  },
  {
    id: "golf",
    title: "Golf",
    body: [
      "Revere Golf Club on Anthem Club Drive is the public course along the Country Club corridor. Anthem Country Club remains a separate private, guard-gated club for members and guests.",
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    body: [
      "St. Rose Dominican Hospital — Siena Campus on St Rose Parkway provides emergency and specialty services southeast of Anthem.",
      "Henderson Hospital near Galleria Drive serves the greater Henderson basin for additional inpatient and outpatient care.",
    ],
  },
  {
    id: "shopping",
    title: "Shopping & errands",
    body: [
      "Smith's Food and Drug at 10616 S Eastern Ave is the everyday grocery anchor in Horizon Marketplace.",
      "Galleria at Sunset and The District at Green Valley Ranch add department stores, boutiques, and dining clusters for larger shopping trips.",
    ],
  },
  {
    id: "commute",
    title: "Commute & regional access",
    body: [
      "The Las Vegas Strip is roughly 20–25 miles northwest of Anthem; in typical traffic, plan on an approximate 25–45 minute drive depending on time of day (approximate).",
      "Harry Reid International Airport is approximately 15–20 miles away — often roughly 20–35 minutes by car in normal conditions (approximate).",
      "Downtown Summerlin and the 215 Beltway connect Anthem to west Las Vegas medical, retail, and entertainment without crossing the Strip corridor.",
    ],
  },
];

export default function AmenitiesPage() {
  return (
    <>
      <SchemaScript id="amenities-page-schema" schema={pageSchemas} />
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
            <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary">Home</Link>
              <span aria-hidden="true"> / </span>
              <span className="text-foreground">Nearby Amenities</span>
            </nav>

            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nearby Amenities in Anthem Henderson, Nevada
            </h1>
            <p
              data-speakable
              className="mt-4 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground"
            >
              Interactive map of healthcare, golf, recreation, grocery, and shopping around Anthem
              Henderson — centered on the Sun City Anthem Anthem Center at 2450 Hampton Road. Use the
              filters to explore what is close to Sun City Anthem, Solera, Country Club, and
              Highlands addresses.
            </p>

            <div className="mt-10">
              <AmenityMap defaultCategory="healthcare" showFilters />
            </div>

            <div className="mt-14 space-y-10">
              {writtenSections.map((section) => (
                <section key={section.id} aria-labelledby={`${section.id}-heading`}>
                  <h2
                    id={`${section.id}-heading`}
                    className="text-xl font-semibold text-foreground sm:text-2xl"
                  >
                    {section.title}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mt-3 text-base leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <section className="mt-14" aria-labelledby="amenities-faq-heading">
              <h2 id="amenities-faq-heading" className="text-2xl font-bold text-foreground">
                Anthem amenities FAQ
              </h2>
              <dl className="mt-6 space-y-6">
                {AMENITIES_PAGE_FAQS.map((faq) => (
                  <div key={faq.question} className="rounded-lg border border-border bg-card p-4">
                    <dt className="font-semibold text-foreground">{faq.question}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section
              className="mt-14 overflow-hidden rounded-xl border border-border bg-card"
              aria-labelledby="amenities-agent-heading"
            >
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border-[3px] border-primary sm:mx-0">
                  <Image
                    src="/realty/dr-jan-duffy.jpg"
                    alt="Dr. Jan Duffy, REALTOR® — Anthem Henderson specialist"
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 id="amenities-agent-heading" className="text-xl font-bold text-foreground">
                    Your Anthem Henderson REALTOR®
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {agentInfo.name}, {agentInfo.title} · NV Lic. {agentInfo.license} ·{" "}
                    {agentInfo.brokerage}. Hyperlocal guidance for Sun City Anthem, Solera, Country
                    Club, and Highlands — live comps before you tour.
                  </p>
                  <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
                    <a
                      href={agentInfo.phoneTel}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      <Phone className="h-4 w-4" aria-hidden="true" />
                      {agentInfo.phoneFormatted}
                    </a>
                    <Link
                      href="/contact"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Send a message
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
