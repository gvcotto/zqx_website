import type { Metadata } from "next";
import { site } from "@/lib/site";
import { isLocale, type Locale } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: "ZQX Consulting S.A.",
  openGraph: {
    title: site.name,
    description: "ZQX Consulting S.A.",
    url: `https://${site.domain}`,
    siteName: site.name,
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? (localeParam as Locale) : ("en" as Locale);

  return (
    <div>
      <Navbar locale={locale} />
      <PageTransition>{children}</PageTransition>
      <Footer locale={locale} />
    </div>
  );
}
