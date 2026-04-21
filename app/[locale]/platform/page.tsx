import CTA from "@/components/CTA";
import Reveal from "@/components/Reveal";
import PlatformShowcase from "@/components/platform/PlatformShowcase";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function PlatformPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);
  const t = getDictionary(locale);

  return (
    <main>
      <PlatformShowcase locale={locale} platform={t.platformPage} />

      <section className="pb-12 md:pb-20">
        <div className="container">
          <Reveal>
            <CTA locale={locale} />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
