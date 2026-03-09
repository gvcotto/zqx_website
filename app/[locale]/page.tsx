import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import HomeMission from "@/components/sections/HomeMission";
import StrategicInnovation from "@/components/sections/StrategicInnovation";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  const aboutCards = [
    { title: t.aboutVision.about.title, paragraphs: t.aboutVision.about.paragraphs },
    { title: t.aboutVision.vision.title, paragraphs: t.aboutVision.vision.paragraphs },
  ] as const;

  return (
    <main>
      <Hero locale={locale} />
      <HomeMission locale={locale} />
      <StrategicInnovation locale={locale} />

      <Section title={t.sections.servicesTitle} subtitle={t.sections.servicesSubtitle}>
        <ServicesGrid locale={locale} />
      </Section>

      <Section title={t.sections.processTitle} subtitle={t.sections.processSubtitle}>
        <Process locale={locale} />
      </Section>

      <Section title={t.sections.aboutVisionTitle}>
        <div className="grid gap-6 md:grid-cols-2">
          {aboutCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 60}>
              <article className="rounded-3xl border border-brand-border bg-brand-white p-7 md:p-8">
                <h3 className="text-xl font-semibold tracking-tight">{card.title}</h3>
                <div className="mt-4 space-y-3 text-base leading-7 text-brand-muted">
                  {card.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <section className="py-12 md:py-20">
        <div className="container">
          <Reveal>
            <CTA locale={locale} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
