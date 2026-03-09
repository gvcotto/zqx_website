import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function StrategicInnovation({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section aria-labelledby="strategic-innovation-title" className="border-b border-brand-border py-12 md:py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-brand-border bg-brand-white">
              {/* TODO: replace placeholder with approved production image at /public/images/ai-network.jpg if available. */}
              <Image
                src="/images/ai-network.svg"
                alt="Strategic technology systems illustration"
                width={1440}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={60} className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{t.strategicInnovation.label}</p>
            <h2 id="strategic-innovation-title" className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {t.strategicInnovation.title}
            </h2>
            <p className="mt-5 text-base leading-8 text-brand-muted">{t.strategicInnovation.body}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
