import Link from "next/link";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="surface-panel border-t border-brand-border py-10">
      <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-sm font-medium text-brand-charcoal">
            Copyright {new Date().getFullYear()} {site.name}. {t.footer.rights}
          </div>
          <div className="mt-1 text-sm text-brand-muted">{t.footer.tagline}</div>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-brand-charcoal">
          <Link className="focus-ring pressable hover:text-brand-blue" href={`/${locale}/services`}>
            {t.nav.services}
          </Link>
          <Link className="focus-ring pressable hover:text-brand-blue" href={`/${locale}/platform`}>
            {t.nav.platform}
          </Link>
          <Link className="focus-ring pressable hover:text-brand-blue" href={`/${locale}/about`}>
            {t.nav.about}
          </Link>
          <Link className="focus-ring pressable hover:text-brand-blue" href={`/${locale}/contact`}>
            {t.nav.contact}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
