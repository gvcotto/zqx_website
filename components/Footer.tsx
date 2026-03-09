import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-brand-border bg-brand-white py-10">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-medium text-brand-charcoal">
            Copyright {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </div>
          <div className="mt-1 text-sm text-brand-muted">{t.footer.tagline}</div>
        </div>
        <div className="text-sm font-medium text-brand-charcoal">
          <a className="focus-ring pressable hover:text-brand-blue" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
