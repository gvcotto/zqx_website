import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ServicesGrid from "@/components/ServicesGrid";
import Process from "@/components/Process";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
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
      <Section title={t.sections.servicesTitle} subtitle={t.sections.servicesSubtitle}>
        <ServicesGrid locale={locale} />
      </Section>
      <Section title={t.sections.processTitle} subtitle={t.sections.processSubtitle}>
        <Process locale={locale} />
      </Section>
      <Section title={t.sections.aboutVisionTitle}>
        <div className="grid gap-6 md:grid-cols-2">
          {aboutCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 70}>
              <article className="hover-lift rounded-3xl border border-white/10 bg-white/5 p-7 md:p-8">
                <h3 className="text-xl font-semibold tracking-tight">{card.title}</h3>
                <div className="mt-4 space-y-3 text-zinc-300">
                  {card.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>
      <section className="py-16">
        <div className="container">
          <Reveal>
            <CTA locale={locale} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
