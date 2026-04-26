import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { titleCase } from "@/lib/text";

export default function CTA({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="surface-card rounded-3xl border border-brand-border p-8 md:flex md:items-center md:justify-between md:gap-6 md:p-10">
      <div className="max-w-3xl">
        <div className="text-2xl font-semibold tracking-tight">{titleCase(t.cta.title)}</div>
        <div className="mt-3 text-base leading-7 text-brand-muted">{t.cta.desc}</div>
      </div>
      <Link
        href={`/${locale}/contact`}
        className="focus-ring pressable mt-6 inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#0043ce] md:mt-0"
      >
        {t.cta.button}
      </Link>
    </div>
  );
}
