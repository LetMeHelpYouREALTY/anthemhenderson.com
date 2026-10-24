export const CALENDLY_EVENTS = {
  showing: "https://calendly.com/drjanduffy/showing",
  buyer: "https://calendly.com/drjanduffy/buyer-consultation-30-min",
  listing: "https://calendly.com/drjanduffy/listing-consultation",
  strategy: "https://calendly.com/drjanduffy/15min",
} as const;

export type CalendlyEvent = keyof typeof CALENDLY_EVENTS;

const SELLER_PATHS = ["/home-valuation", "/sellers", "/market-report", "/market-insights"];
const BUYER_PATHS = ["/buyers", "/luxury-homes"];

export function calendlyEventForPath(pathname: string): CalendlyEvent {
  if (SELLER_PATHS.some((p) => pathname.startsWith(p))) return "listing";
  if (BUYER_PATHS.some((p) => pathname.startsWith(p))) return "buyer";
  if (pathname.startsWith("/contact")) return "strategy";
  return "showing";
}

/** Booking URL with UTMs; utm_source = bare domain for the Calendly → FUB worker. */
export function calendlyUrl(event: CalendlyEvent, medium: string, pathname: string): string {
  const path = pathname.replace(/^\/|\/$/g, "");
  const params = new URLSearchParams({
    hide_gdpr_banner: "1",
    utm_source: "anthemhenderson.com",
    utm_medium: medium,
    utm_campaign: path || "home",
  });
  return `${CALENDLY_EVENTS[event]}?${params.toString()}`;
}
