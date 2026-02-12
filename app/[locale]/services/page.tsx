import Section from "@/components/Section";
import ServicesGrid from "@/components/ServicesGrid";
import Accordion from "@/components/Accordion";
import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <Section title={t.sections.servicesTitle} subtitle={t.sections.servicesSubtitle}>
        <ServicesGrid locale={locale} />

        <Reveal className="mt-10">
          <div className="mb-4 max-w-2xl">
            <h3 className="text-xl font-semibold tracking-tight">{t.servicesAccordion.title}</h3>
            <p className="mt-2 text-zinc-300">{t.servicesAccordion.subtitle}</p>
          </div>

          <Accordion
            items={t.servicesAccordion.items}
            labels={{
              deliverables: t.servicesAccordion.deliverables,
              tools: t.servicesAccordion.tools,
              engagement: t.servicesAccordion.engagement,
            }}
          />
        </Reveal>
      </Section>

      <section className="pb-16">
        <div className="container">
          <Reveal>
            <CTA locale={locale} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
