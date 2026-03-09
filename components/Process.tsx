import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <ol className="grid gap-4 md:grid-cols-5">
      {t.process.map((step, index) => (
        <li key={step.title}>
          <Reveal delay={index * 60}>
            <div className="hover-lift rounded-2xl border border-brand-border bg-brand-white p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-blue">{index + 1}</div>
              <div className="mt-3 font-semibold">{step.title}</div>
              <div className="mt-2 text-sm leading-6 text-brand-muted">{step.desc}</div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
