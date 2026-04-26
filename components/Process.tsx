import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { titleCase } from "@/lib/text";
import Reveal from "@/components/Reveal";

export default function Process({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <ol className="grid items-stretch gap-4 md:grid-cols-5">
      {t.process.map((step, index) => (
        <li key={step.title} className="h-full">
          <Reveal delay={index * 60} className="h-full">
            <div className="hover-lift surface-card flex h-full min-h-[12rem] flex-col rounded-[1.75rem] border border-brand-border p-5">
              <div className="h-1.5 w-14 rounded-full bg-brand-blue/90" />
              <div className="mt-4 font-semibold">{titleCase(step.title)}</div>
              <div className="mt-2 text-sm leading-6 text-brand-muted">{step.desc}</div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
