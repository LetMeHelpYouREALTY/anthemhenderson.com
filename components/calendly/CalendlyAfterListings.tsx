"use client";

import { usePathname } from "next/navigation";
import { calendlyEventForPath, calendlyUrl } from "@/lib/calendly";

/** Booking strip shown directly under the RealScout office listings. */
export default function CalendlyAfterListings() {
  const pathname = usePathname() || "/";
  const href = calendlyUrl(calendlyEventForPath(pathname), "after-listings", pathname);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-6 text-center md:flex-row md:text-left">
      <p className="text-lg font-semibold text-slate-900">See a home you like? Pick a time with Dr. Jan Duffy.</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Schedule time with me
      </a>
    </div>
  );
}
