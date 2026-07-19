import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo">
      <div className="w-full border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-[3px] border-primary">
                <Image
                  src="/realty/dr-jan-duffy.jpg"
                  alt="Dr. Jan Duffy, REALTOR® with Berkshire Hathaway HomeServices Nevada Properties"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Ready to Make Your Move?
                </p>
                <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Talk to Dr. Jan Duffy Today
                </h2>
                <p className="mt-2 max-w-md text-pretty text-sm text-muted-foreground">
                  Buying or selling in Anthem Henderson — Sun City Anthem, Solera, Country Club, or
                  Highlands — start with a live comps call.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 sm:items-end">
              <a
                href="tel:+17022221964"
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                (702) 222-1964
              </a>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Or send a message
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-background">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground">
                Anthem Henderson | Homes By Dr. Jan Duffy
              </p>
              <p className="text-xs text-muted-foreground">
                © {currentYear} Dr. Jan Duffy · NV Lic. #S.0197614.LLC · Berkshire Hathaway
                HomeServices Nevada Properties · 9406 W Lake Mead Blvd, Suite 100, Las Vegas, NV
                89134
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-8 w-8 shrink-0"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M12 3L2 12h3v9h6v-5h2v5h6v-9h3L12 3zm0 2.5l7 6.3V20h-4v-5H9v5H5v-8.2l7-6.3z" />
                <rect x="8" y="13" width="8" height="1.5" />
                <rect x="8" y="15.5" width="8" height="1.5" />
              </svg>
              <span className="max-w-[220px] text-left leading-snug">
                Equal Housing Opportunity. We are pledged to the letter and spirit of U.S. policy
                for the achievement of equal housing opportunity.
              </span>
            </div>
          </div>
          <div className="my-4 h-px w-full bg-border" />
          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            Market statistics on this page are aggregate figures and structural community facts
            believed accurate as of their stated date, but are not guaranteed and should be
            independently verified. For current, live Anthem Henderson MLS listings, contact Dr.
            Jan Duffy at (702) 222-1964.
          </p>
        </div>
      </div>
    </footer>
  );
}
