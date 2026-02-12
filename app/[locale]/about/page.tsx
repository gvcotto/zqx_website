import Link from "next/link";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <section className="glow border-b border-white/10">
        <div className="container py-20 md:py-24">
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{t.aboutPage.title}</h1>
            <p className="mt-5 text-lg text-zinc-300">{t.aboutPage.subtitle}</p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.aboutPage.pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 70}>
                <article className="hover-lift rounded-3xl border border-white/10 bg-white/5 p-6">
                  <h2 className="text-xl font-semibold tracking-tight">{pillar.title}</h2>
                  <p className="mt-3 text-zinc-300">{pillar.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12">
            <Link
              href={`/${locale}/contact`}
              className="focus-ring pressable hover-lift inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200"
            >
              {t.aboutPage.contactCta}
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
