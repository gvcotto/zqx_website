import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function LocaleSwitcher({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string; // pathname without locale prefix
}) {
  const t = getDictionary(locale);
  const other = locale === "en" ? "es" : "en";
  const label = other === "en" ? t.language.en : t.language.es;

  return (
    <Link
      href={`/${other}${pathname}`}
      className="focus-ring pressable rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-200 hover:bg-white/10"
      aria-label={t.language.label}
      title={t.language.label}
    >
      {label}
    </Link>
  );
}
