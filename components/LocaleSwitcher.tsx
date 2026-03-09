import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === "es") {
    return (
      <svg viewBox="0 0 24 16" className="h-3.5 w-5 rounded-[2px] border border-brand-border" aria-hidden="true">
        <rect width="8" height="16" fill="#1F6FFF" />
        <rect x="8" width="8" height="16" fill="#FFFFFF" />
        <rect x="16" width="8" height="16" fill="#1F6FFF" />
        <circle cx="12" cy="8" r="1.8" fill="#1F2328" opacity="0.7" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 16" className="h-3.5 w-5 rounded-[2px] border border-brand-border" aria-hidden="true">
      <rect width="24" height="16" fill="#FFFFFF" />
      <rect width="24" height="2" y="0" fill="#1F2328" />
      <rect width="24" height="2" y="4" fill="#1F2328" />
      <rect width="24" height="2" y="8" fill="#1F2328" />
      <rect width="24" height="2" y="12" fill="#1F2328" />
      <rect width="10" height="8" fill="#1F6FFF" />
    </svg>
  );
}

export default function LocaleSwitcher({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const t = getDictionary(locale);
  const other = locale === "en" ? "es" : "en";
  const label = other === "en" ? t.language.en : t.language.es;

  return (
    <Link
      href={`/${other}${pathname}`}
      className="focus-ring pressable inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-white px-3 py-1.5 text-xs font-medium text-brand-charcoal hover:border-brand-blue"
      aria-label={t.language.label}
      title={t.language.label}
    >
      <FlagIcon locale={other} />
      <span>{label}</span>
    </Link>
  );
}
