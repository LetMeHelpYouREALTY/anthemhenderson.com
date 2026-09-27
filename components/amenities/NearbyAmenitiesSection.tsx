import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { ANTHEM_COMMUNITY_MAP } from "@/lib/amenities/anthem-amenities";

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

type NearbyAmenitiesSectionProps = {
  /** Section heading — defaults to homepage-style title */
  title?: string;
  description?: string;
  className?: string;
};

export default function NearbyAmenitiesSection({
  title = "Life Near Anthem Henderson",
  description = `Explore healthcare, golf, recreation centers, grocery, and dining around ${ANTHEM_COMMUNITY_MAP.name} in ${ANTHEM_COMMUNITY_MAP.city}, ${ANTHEM_COMMUNITY_MAP.state}. Map centered on ${ANTHEM_COMMUNITY_MAP.centerLabel}.`,
  className = "",
}: NearbyAmenitiesSectionProps) {
  return (
    <section
      aria-labelledby="nearby-amenities-heading"
      className={`w-full border-b border-border bg-background ${className}`}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            What&apos;s Nearby
          </p>
          <h2
            id="nearby-amenities-heading"
            className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {title}
          </h2>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
          <p className="mt-3 text-sm">
            <Link href="/amenities" className="font-medium text-primary hover:underline">
              View full nearby amenities guide →
            </Link>
          </p>
        </div>

        <AmenityMap defaultCategory="healthcare" showFilters />
      </div>
    </section>
  );
}
