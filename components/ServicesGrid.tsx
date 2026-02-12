import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function ServicesGrid({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {t.services.map((s, index) => (
        <Reveal key={s.title} delay={index * 70}>
          <div className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">{s.title}</div>
            <p className="mt-2 text-sm text-zinc-300">{s.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
