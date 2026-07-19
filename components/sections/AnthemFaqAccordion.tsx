"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { FAQ } from "@/lib/faq-config";

type AnthemFaqAccordionProps = {
  faqs: FAQ[];
};

export default function AnthemFaqAccordion({ faqs }: AnthemFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex w-full flex-col gap-2" role="region" aria-label="Anthem Henderson FAQ">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={faq.question} className="rounded-lg border border-border bg-card px-5">
            <h3 className="flex">
              <button
                type="button"
                className="flex flex-1 items-start justify-between py-4 text-left text-sm font-medium leading-snug text-foreground transition-colors hover:text-primary"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span>{faq.question}</span>
                {isOpen ? (
                  <ChevronUp className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="ml-4 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            </h3>
            {isOpen && (
              <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
