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
            <div className="hover-lift h-fit rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="font-semibold">{t.contact.details}</div>
              <div className="mt-3 text-sm text-zinc-300">
                <div>
                  <span className="text-zinc-400">Email:</span>{" "}
                  <a className="hover:text-white" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </div>
                <div className="mt-2">
                  <a className="hover:text-white" href={site.whatsapp} target="_blank" rel="noreferrer">
                    {t.nav.whatsapp}
                  </a>
                </div>
                <div className="mt-2">
                  <span className="text-zinc-400">{t.contact.location}:</span> {site.location}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
