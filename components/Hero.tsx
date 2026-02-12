import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <section className="glow border-b border-white/10">
      <div className="container py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200">
            {t.hero.badge}
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
            {t.hero.title}
          </h1>

          <p className="mt-5 text-lg text-zinc-300">{t.hero.tagline}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/contact`}
              className="focus-ring pressable hover-lift rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="focus-ring pressable hover-lift rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold hover:bg-white/10"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {t.hero.highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 70}>
              <div className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="font-semibold">{item.title}</div>
                <div className="mt-2 text-sm text-zinc-300">{item.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
