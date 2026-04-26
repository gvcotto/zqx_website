import AIGame from "@/components/AIGame";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);

  return <AIGame locale={locale} />;
}
