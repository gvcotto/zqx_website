import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";
import HeroVisualCard from "@/components/hero/HeroVisualCard";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="glow relative overflow-hidden border-b border-brand-border/80">
      <div className="container relative z-10 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <Reveal className="max-w-4xl">
            <p className="surface-soft inline-flex items-center rounded-full border border-brand-border px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-muted">
              {t.home.hero.badge}
            </p>

            <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl lg:text-[4.5rem]">
              {t.home.hero.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-brand-muted md:text-xl">{t.home.hero.subtitle}</p>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">{t.home.hero.designedToScale}</p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/contact`}
                className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#0043ce]"
              >
                {t.hero.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="focus-ring pressable surface-soft inline-flex rounded-full border border-brand-border px-6 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-blue"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={40}>
            <HeroVisualCard locale={locale} />
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {t.hero.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <div className="hover-lift surface-card rounded-[1.75rem] border border-brand-border p-5 md:p-6">
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand-blue">{item.title}</div>
                <div className="mt-3 text-sm leading-6 text-brand-muted">{item.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
