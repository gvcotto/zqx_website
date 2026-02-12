"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

type AccordionItem = {
  id: string;
  title: string;
  deliverables: readonly string[];
  tools: readonly string[];
  engagement: string;
};

type AccordionProps = {
  items: readonly AccordionItem[];
  labels: {
    deliverables: string;
    tools: string;
    engagement: string;
  };
};

export default function Accordion({ items, labels }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const buttonId = `${item.id}-trigger`;
        const panelId = `${item.id}-panel`;

        return (
          <Reveal key={item.id} delay={index * 70}>
            <section className="glass rounded-3xl border border-white/10">
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                  className="focus-ring pressable hover-lift flex w-full items-center justify-between gap-4 rounded-3xl px-5 py-4 text-left"
                >
                  <span className="text-base font-semibold text-zinc-100 md:text-lg">{item.title}</span>
                  <svg
                    className={`h-5 w-5 shrink-0 text-zinc-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`accordion-panel ${isOpen ? "is-open" : "is-closed"}`}
                data-state={isOpen ? "open" : "closed"}
              >
                <div className="accordion-panel-inner px-5 pb-5 pt-1">
                  <div className="grid gap-5 md:grid-cols-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{labels.deliverables}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                        {item.deliverables.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{labels.tools}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-300">
                        {item.tools.map((entry) => (
                          <li key={entry}>{entry}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{labels.engagement}</p>
                      <p className="mt-2 text-sm text-zinc-300">{item.engagement}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
}
