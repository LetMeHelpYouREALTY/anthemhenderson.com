import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Clock,
  Home as HomeIcon,
  MapPin,
  Phone,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import AnthemFaqAccordion from "@/components/sections/AnthemFaqAccordion";
import { getFaqsForDomain } from "@/lib/faq-config";
import { officeInfo, agentInfo } from "@/lib/site-config";

const REALSCOUT_AGENT_ID = "QWdlbnQtMjI1MDUw";

const snapshot = [
  {
    icon: TrendingUp,
    label: "Master Plan Size",
    value: "4,775 acres",
    note: "McCullough foothills",
  },
  {
    icon: HomeIcon,
    label: "Homes in Anthem",
    value: "14,000+",
    note: "Six sub-communities",
  },
  {
    icon: Clock,
    label: "Sun City Anthem",
    value: "7,000+",
    note: "55+ Del Webb homes",
  },
  {
    icon: BarChart3,
    label: "Live Pricing",
    value: "Call for comps",
    note: "By floor plan & lot",
  },
];

const services = [
  {
    title: "Buy in Anthem Henderson",
    body: "Private showings across Sun City Anthem, Solera, Country Club, Highlands, Coventry, and Madeira Canyon — with live MLS comps before you write.",
    href: "/buyers",
  },
  {
    title: "Sell your Anthem home",
    body: "Floor-plan pricing, HOA/amenity positioning, and marketing that speaks to 55+, golf, and foothill buyers who already know this master plan.",
    href: "/sellers",
  },
  {
    title: "55+ community guidance",
    body: "Side-by-side tours of Sun City Anthem vs Solera — amenities, monthly dues, and which floor plans move fastest right now.",
    href: "/55-plus-communities/sun-city-anthem",
  },
  {
    title: "Country Club & luxury",
    body: "Guard-gated Anthem Country Club access, discreet showings, and offer strategy for custom and semi-custom estates.",
    href: "/luxury-homes",
  },
];

export default function Home() {
  const faqs = getFaqsForDomain("community", "anthemhenderson.com");

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Anthem Henderson | Homes By Dr. Jan Duffy",
    jobTitle: "REALTOR® | BHHS Nevada Properties",
    telephone: "(702) 222-1964",
    url: "https://anthemhenderson.com",
    image: "https://anthemhenderson.com/realty/dr-jan-duffy.jpg",
    areaServed: {
      "@type": "Place",
      name: "Anthem, Henderson, NV",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: officeInfo.address.street,
      addressLocality: officeInfo.address.city,
      addressRegion: officeInfo.address.state,
      postalCode: officeInfo.address.zip,
      addressCountry: "US",
    },
    worksFor: {
      "@type": "RealEstateAgent",
      name: "Berkshire Hathaway HomeServices Nevada Properties",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": "https://anthemhenderson.com/#localbusiness",
    name: "Anthem Henderson | Homes By Dr. Jan Duffy",
    telephone: "+17022221964",
    email: agentInfo.email,
    url: "https://anthemhenderson.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: officeInfo.address.street,
      addressLocality: officeInfo.address.city,
      addressRegion: officeInfo.address.state,
      postalCode: officeInfo.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: officeInfo.coordinates.lat,
      longitude: officeInfo.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "16:00",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">
          {/* Hero — full-bleed, brand-first */}
          <section className="relative w-full overflow-hidden bg-background" aria-label="Hero">
            <div className="absolute inset-0">
              <Image
                src="/realty/heroes/hero-homes-for-sale.png"
                alt="Anthem Henderson foothill homes with desert mountain views at golden hour"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center motion-fade-in"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
              />
            </div>

            <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
              <p className="motion-fade-up mb-3 text-sm font-semibold tracking-tight text-primary sm:text-base">
                Anthem Henderson | Homes By Dr. Jan Duffy
              </p>
              <h1 className="motion-fade-up motion-delay-1 max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Homes for Sale in Anthem Henderson, NV
              </h1>
              <p className="motion-fade-up motion-delay-2 mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
                A local, licensed guide to buying and selling inside Anthem — Sun City Anthem,
                Solera, Country Club, Highlands, and every street in between.
              </p>
              <div className="motion-fade-up motion-delay-2 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#listings"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View Current Listings
                </a>
                <a
                  href="tel:+17022221964"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/40 bg-black/20 px-4 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call (702) 222-1964
                </a>
              </div>
              <p className="mt-5 inline-flex items-center gap-2 text-xs text-white/70">
                <MapPin className="h-3 w-3 text-primary" aria-hidden="true" />
                Anthem, Henderson NV — McCullough Range foothills
              </p>
            </div>
          </section>

          {/* Live MLS */}
          <section
            id="listings"
            aria-labelledby="office-listings-heading"
            className="w-full border-b border-border bg-background"
          >
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
              <div className="mb-8 max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Live MLS Inventory
                </p>
                <h2
                  id="office-listings-heading"
                  className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  Current Homes for Sale in Anthem Henderson
                </h2>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
                  Live MLS inventory from Berkshire Hathaway HomeServices Nevada Properties —
                  updated throughout the day. Ask Dr. Jan to filter to your Anthem sub-community.
                </p>
              </div>
              <div
                className="realscout-office-listings-host min-h-[320px] w-full"
                dangerouslySetInnerHTML={{
                  __html: `<realscout-office-listings agent-encoded-id="${REALSCOUT_AGENT_ID}" sort-order="NEWEST" listing-status="For Sale" property-types=",SFR,MF,TC"></realscout-office-listings>`,
                }}
              />
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                Listing information is provided by RealScout and the Las Vegas REALTORS® MLS and is
                believed accurate but not guaranteed. All information should be independently
                verified. Equal Housing Opportunity.
              </p>
            </div>
          </section>

          {/* Community snapshot */}
          <section
            aria-label="Anthem Henderson community snapshot"
            className="w-full border-b border-border bg-card/40"
          >
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
              <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Anthem Henderson Snapshot
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {snapshot.map(({ icon: Icon, label, value, note }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="flex items-center gap-1.5 text-primary">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                    </div>
                    <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{note}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Article + agent sidebar */}
          <section aria-label="Anthem Henderson guide" className="w-full border-b border-border bg-background">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
              <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
                <article className="min-w-0 flex-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Why Anthem Henderson Buyers Call Dr. Jan First
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Anthem is Henderson&apos;s largest master plan — about 4,775 acres terraced across
                    the McCullough Range foothills with 14,000+ homes. Pricing and lifestyle change by
                    village: Sun City Anthem and Solera for 55+ active adult living, Anthem Country
                    Club for guard-gated golf estates, and Highlands / Coventry / Madeira Canyon for
                    single-family foothill homes.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Dr. Jan Duffy pulls live comps by floor plan, lot position, and upgrades — then
                    schedules private showings on your timeline. No generic valley advice. Anthem
                    streets, Anthem HOAs, Anthem numbers.
                  </p>

                  <h3 className="mt-8 text-xl font-semibold text-foreground">
                    Anthem sub-community map
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Sun City Anthem</strong> — Del Webb 55+ at
                    resort scale (7,000+ homes), multiple recreation centers, golf, pickleball, and
                    clubs.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Solera at Anthem</strong> — smaller
                    guard-gated 55+ alternative with a more intimate amenity set and different HOA
                    scale.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Anthem Country Club</strong> — 24/7
                    guard-gated luxury golf community with custom and semi-custom estates.
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                    <strong className="text-foreground">Anthem Highlands &amp; Coventry</strong> —
                    established single-family neighborhoods with foothill and valley views; Madeira
                    Canyon adds trail-adjacent gated options.
                  </p>

                  <h3 className="mt-8 text-xl font-semibold text-foreground">
                    Realtor services for Anthem Henderson
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2" role="list">
                    {services.map((service) => (
                      <li key={service.title}>
                        <Link
                          href={service.href}
                          className="block h-full rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
                        >
                          <p className="text-sm font-semibold text-foreground">{service.title}</p>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {service.body}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-8 text-xl font-semibold text-foreground">Explore Anthem</h3>
                  <ul className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground" role="list">
                    <li>
                      <Link
                        href="/55-plus-communities/sun-city-anthem"
                        className="text-primary hover:underline"
                      >
                        Sun City Anthem homes for sale
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/55-plus-communities/solera-anthem"
                        className="text-primary hover:underline"
                      >
                        Solera at Anthem homes for sale
                      </Link>
                    </li>
                    <li>
                      <Link href="/luxury-homes" className="text-primary hover:underline">
                        Anthem Country Club &amp; luxury listings
                      </Link>
                    </li>
                    <li>
                      <Link href="/home-valuation" className="text-primary hover:underline">
                        Free Anthem home valuation
                      </Link>
                    </li>
                    <li>
                      <Link href="/sellers" className="text-primary hover:underline">
                        Sell your Anthem Henderson home
                      </Link>
                    </li>
                  </ul>

                  <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                    Community size and amenity facts compiled from public Anthem / Sun City Anthem
                    sources; pricing changes monthly. Contact Dr. Jan Duffy for a current comparative
                    market analysis and live listing search.
                  </p>
                </article>

                <aside className="w-full shrink-0 lg:w-72 xl:w-80">
                  <div className="lg:sticky lg:top-24">
                    <div className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card py-4 text-sm text-card-foreground shadow-none">
                      <div className="px-4 pb-0">
                        <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-[3px] border-primary shadow-sm">
                          <Image
                            src="/realty/dr-jan-duffy.jpg"
                            alt="Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties"
                            fill
                            sizes="112px"
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-3 text-center">
                          <p className="text-base font-semibold text-foreground">Dr. Jan Duffy</p>
                          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                            REALTOR® | BHHS Nevada Properties
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Anthem Henderson specialist
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-col gap-3 px-4">
                        <div className="h-px w-full bg-border" />
                        <a
                          href="tel:+17022221964"
                          className="flex items-center gap-2 text-sm text-foreground transition-colors hover:text-primary"
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          (702) 222-1964
                        </a>
                        <a
                          href="tel:+17022221964"
                          className="mt-1 inline-flex h-9 w-full cursor-pointer items-center justify-center rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Call Dr. Jan
                        </a>
                        <p className="text-center text-xs text-muted-foreground">
                          Free consultation · No obligation
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg border border-border bg-card p-4 text-center">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Licensed in Nevada
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        NV Lic. #S.0197614.LLC · Brokered by Berkshire Hathaway HomeServices Nevada
                        Properties
                      </p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        {officeInfo.address.full}
                      </p>
                      <div className="mt-3 flex flex-wrap justify-center gap-2">
                        <a
                          href="tel:+17022221964"
                          className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
                        >
                          Call
                        </a>
                        <a
                          href="https://www.google.com/maps/dir/?api=1&destination=9406+W+Lake+Mead+Blvd+Suite+100+Las+Vegas+NV+89134"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
                        >
                          Directions
                        </a>
                        <a
                          href="https://www.google.com/search?q=Dr+Jan+Duffy+Berkshire+Hathaway+reviews"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40"
                        >
                          Google Reviews
                        </a>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section
            aria-labelledby="faq-heading"
            className="w-full border-b border-border bg-card/40"
          >
            <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
              <div className="mb-10 text-center">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Common Questions
                </p>
                <h2
                  id="faq-heading"
                  className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
                >
                  Buying in Anthem Henderson: Frequently Asked Questions
                </h2>
              </div>
              <AnthemFaqAccordion faqs={faqs} />
            </div>
          </section>

          {/* NAP + map */}
          <section
            aria-label="Office location"
            className="w-full border-b border-border bg-background"
          >
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Visit / Contact
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Berkshire Hathaway HomeServices Nevada Properties
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {officeInfo.address.full} · Call{" "}
                <a href="tel:+17022221964" className="text-primary hover:underline">
                  (702) 222-1964
                </a>{" "}
                · Mon–Fri 9am–6pm, Sat 10am–4pm, Sun by appointment
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border">
                <iframe
                  title="Map to Dr. Jan Duffy office at 9406 W Lake Mead Blvd"
                  src="https://www.google.com/maps?q=9406+W+Lake+Mead+Blvd+Suite+100,+Las+Vegas,+NV+89134&output=embed"
                  className="h-64 w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
