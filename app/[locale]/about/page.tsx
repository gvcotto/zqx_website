import Link from "next/link";
import MissionVision from "@/components/sections/MissionVision";
import TeamSpotlight from "@/components/sections/TeamSpotlight";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { titleCase } from "@/lib/text";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <section className="border-b border-brand-border/80 py-14 md:py-24">
        <div className="container">
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{titleCase(t.aboutPage.title)}</h1>
            <p className="mt-5 text-lg leading-8 text-brand-muted md:text-xl">{t.aboutPage.subtitle}</p>
          </Reveal>

          <Reveal delay={60} className="mt-10">
            <article className="surface-card overflow-hidden rounded-3xl border border-brand-border p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-blue">{t.aboutPage.meaning.label}</p>
                  <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] md:text-4xl">ZQX = {t.aboutPage.meaning.title}</h2>
                  <p className="mt-4 text-base leading-7 text-brand-muted md:text-lg">{t.aboutPage.meaning.intro}</p>
                </div>

                <div className="grid gap-3">
                  {t.aboutPage.meaning.points.map((point) => (
                    <div key={point.term} className="surface-soft rounded-[1.4rem] border border-brand-border px-5 py-4">
                      <h3 className="text-base font-semibold tracking-tight text-brand-charcoal">{point.term}</h3>
                      <p className="mt-2 text-sm leading-6 text-brand-muted">{point.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>

          <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
            {t.aboutPage.pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 60} className="h-full">
                <article className="surface-soft h-full min-h-[11rem] rounded-3xl border border-brand-border p-6">
                  <h2 className="text-xl font-semibold tracking-tight">{titleCase(pillar.title)}</h2>
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
