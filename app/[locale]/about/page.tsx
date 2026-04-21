import Link from "next/link";
import MissionVision from "@/components/sections/MissionVision";
import TeamSpotlight from "@/components/sections/TeamSpotlight";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <section className="border-b border-brand-border/80 py-14 md:py-24">
        <div className="container">
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{t.aboutPage.title}</h1>
            <p className="mt-5 text-lg leading-8 text-brand-muted md:text-xl">{t.aboutPage.subtitle}</p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.aboutPage.pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 60}>
                <article className="surface-soft rounded-3xl border border-brand-border p-6">
                  <h2 className="text-xl font-semibold tracking-tight">{pillar.title}</h2>
                  <p className="mt-3 text-base leading-7 text-brand-muted">{pillar.desc}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mt-12">
            <Link
              href={`/${locale}/contact`}
              className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#0043ce]"
            >
              {t.aboutPage.contactCta}
            </Link>
          </Reveal>
        </div>
      </section>

      <TeamSpotlight team={t.team} />
      <MissionVision about={t.about} />
    </main>
  );
}
