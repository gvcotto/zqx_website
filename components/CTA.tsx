import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function CTA({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="hover-lift rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div>
        <div className="text-2xl font-semibold tracking-tight">{t.cta.title}</div>
        <div className="mt-2 text-zinc-300">{t.cta.desc}</div>
      </div>
      <Link
        href={`/${locale}/contact`}
        className="focus-ring pressable hover-lift rounded-full bg-white text-zinc-900 px-6 py-3 text-sm font-semibold hover:bg-zinc-200 text-center"
      >
        {t.cta.button}
      </Link>
    </div>
  );
}
