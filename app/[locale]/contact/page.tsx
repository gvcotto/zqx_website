import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <Section title={t.sections.contactTitle} subtitle={t.sections.contactSubtitle}>
        <Reveal className="max-w-4xl">
          <ContactForm locale={locale} />
        </Reveal>
      </Section>
    </main>
  );
}
