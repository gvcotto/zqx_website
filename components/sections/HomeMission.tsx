import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function HomeMission({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section aria-labelledby="home-mission-title" className="border-b border-brand-border bg-brand-white py-12 md:py-20">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{t.mission.label}</p>
            <h2 id="home-mission-title" className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {t.mission.short}
            </h2>
            <p className="mt-5 text-base leading-8 text-brand-muted">{t.mission.standard}</p>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">{t.scalability.phrase}</p>
          </Reveal>

          <Reveal delay={60}>
            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="overflow-hidden rounded-3xl border border-brand-border bg-brand-gray">
                {/* TODO: replace placeholder with approved production image at /public/images/ai-network.jpg if available. */}
                <Image
                  src="/images/ai-network.svg"
                  alt="Abstract AI network visualization"
                  width={960}
                  height={720}
                  className="h-full w-full object-cover"
                  priority
                />
              </figure>
              <figure className="overflow-hidden rounded-3xl border border-brand-border bg-brand-gray">
                {/* TODO: replace placeholder with approved production image at /public/images/neural-brain-tech.jpg if available. */}
                <Image
                  src="/images/neural-brain-tech.svg"
                  alt="Digital neural systems visualization"
                  width={960}
                  height={720}
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
