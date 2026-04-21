import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import Reveal from "@/components/Reveal";

export default function ServicesGrid({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {t.services.map((service, index) => (
          <Reveal key={service.title} delay={index * 60}>
            <div className="hover-lift surface-card rounded-[1.75rem] border border-brand-border p-6">
              <div className="text-lg font-semibold tracking-tight">{service.title}</div>
              <p className="mt-3 text-sm leading-6 text-brand-muted">{service.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={60}>
        <div className="surface-soft rounded-[1.75rem] border border-brand-border px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-blue">{t.scalability.phrase}</p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-brand-muted">{t.scalability.support}</p>
        </div>
      </Reveal>
    </div>
  );
}
