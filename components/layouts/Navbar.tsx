"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Menu, Phone, X } from "lucide-react";

const navLinks = [
  { href: "/#listings", label: "Homes for Sale" },
  { href: "/55-plus-communities/sun-city-anthem", label: "Sun City Anthem" },
  { href: "/55-plus-communities/solera-anthem", label: "Solera" },
  { href: "/luxury-homes", label: "Country Club" },
  { href: "/buyers", label: "Buyers" },
  { href: "/sellers", label: "Sellers" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          aria-label="Anthem Henderson | Homes By Dr. Jan Duffy — home"
        >
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary text-primary-foreground"
          >
            <Home className="h-4 w-4" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">Anthem Henderson</span>
            <span className="hidden text-[11px] text-muted-foreground sm:block">
              Homes By Dr. Jan Duffy
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:+17022221964"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-3 text-[0.8rem] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            (702) 222-1964
          </a>
        </div>

        <button
          type="button"
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-4" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+17022221964"
              className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call (702) 222-1964
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
