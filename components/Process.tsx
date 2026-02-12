import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {t.process.map((p, index) => (
        <li key={p.title}>
          <Reveal delay={index * 70}>
            <div className="hover-lift rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs text-zinc-400">{index + 1}</div>
              <div className="mt-2 font-semibold">{p.title}</div>
              <div className="mt-2 text-sm text-zinc-300">{p.desc}</div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
