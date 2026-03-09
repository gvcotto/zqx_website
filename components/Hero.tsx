import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";
import HeroVisualCard from "@/components/hero/HeroVisualCard";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="glow relative overflow-hidden border-b border-brand-border">
      <div className="container relative z-10 py-12 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
          <Reveal>
            <HeroVisualCard locale={locale} />
          </Reveal>

          <Reveal className="max-w-3xl" delay={40}>
            <p className="inline-flex items-center rounded-full border border-brand-border bg-brand-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-muted">
              {t.home.hero.badge}
            </p>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">{t.home.hero.title}</h1>

            <p className="mt-5 text-lg leading-8 text-brand-muted">{t.home.hero.subtitle}</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-brand-blue">{t.home.hero.designedToScale}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/contact`}
                className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#195dd6]"
              >
                {t.hero.ctaPrimary}
              </Link>
              <Link
                href={`/${locale}/services`}
                className="focus-ring pressable inline-flex rounded-full border border-brand-border bg-brand-white px-6 py-3 text-sm font-semibold text-brand-charcoal hover:border-brand-blue"
              >
                {t.hero.ctaSecondary}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {t.hero.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <div className="hover-lift rounded-2xl border border-brand-border bg-brand-white p-5">
                <div className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-blue">{item.title}</div>
                <div className="mt-3 text-sm leading-6 text-brand-muted">{item.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
