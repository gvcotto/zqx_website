import Section from "@/components/Section";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <Section title={t.sections.contactTitle} subtitle={t.sections.contactSubtitle}>
        <div className="grid gap-6 md:grid-cols-3">
          <Reveal className="md:col-span-2">
            <ContactForm locale={locale} />
          </Reveal>

          <Reveal delay={80}>
            <div className="surface-card h-fit rounded-3xl border border-brand-border p-6">
              <div className="font-semibold">{t.contact.details}</div>
              <div className="mt-4 space-y-3 text-sm leading-6 text-brand-muted">
                <div>
                  <span className="font-medium text-brand-charcoal">{t.contact.autoReply}:</span> {t.contact.autoReplyDetail}
                </div>
                <div>
                  <span className="font-medium text-brand-charcoal">{t.contact.responseTime}:</span> {t.contact.responseWindow}
                </div>
                <div>
                  <a className="font-medium text-brand-charcoal hover:text-brand-blue" href={site.whatsapp} target="_blank" rel="noreferrer">
                    {t.nav.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
