import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function HeroVisualCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const cards =
    locale === "es"
      ? [
          { label: "Entrada", value: "Sistemas y workflows del negocio" },
          { label: "Modelo", value: "Gobierno y diseno operativo" },
          { label: "Salida", value: "Entrega conectada a operaciones" },
        ]
      : [
          { label: "Input", value: "Business systems and workflows" },
          { label: "Model", value: "Governance and operating design" },
          { label: "Output", value: "Delivery connected to operations" },
        ];
  const orchestrationLabel = locale === "es" ? "Mapa de orquestacion" : "Orchestration map";
  const runLabel = locale === "es" ? "Operando hoy" : "Running today";

  return (
    <div className="surface-card relative mx-auto w-full max-w-[38rem] rounded-[2rem] border border-brand-border p-5 shadow-[0_24px_64px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-center justify-between gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-muted">
        <span>{orchestrationLabel}</span>
        <span className="rounded-full border border-brand-border px-3 py-1 text-brand-blue">{runLabel}</span>
      </div>

      <div className="surface-soft relative mt-4 rounded-[1.6rem] border border-brand-border px-4 py-5 sm:px-6 sm:py-6">
        <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label={t.home.hero.visualBadge}>
          <title>{t.home.hero.visualBadge}</title>
          <g stroke="#525252" strokeWidth="4" fill="none" strokeLinecap="round">
            <path d="M116 100L282 72" />
            <path d="M116 100L188 222" />
            <path d="M282 72L418 136" />
            <path d="M282 72L284 208" />
            <path d="M188 222L284 208" />
            <path d="M188 222L120 324" />
            <path d="M284 208L418 136" />
            <path d="M284 208L386 302" />
            <path d="M284 208L230 338" />
            <path d="M418 136L386 302" />
            <path d="M120 324L230 338" />
            <path d="M230 338L386 302" />
          </g>

          <g>
            <circle cx="116" cy="100" r="18" fill="#f4f4f4" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="282" cy="72" r="20" fill="#ffffff" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="418" cy="136" r="18" fill="#f4f4f4" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="188" cy="222" r="16" fill="#ffffff" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="284" cy="208" r="22" fill="#f4f4f4" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="386" cy="302" r="18" fill="#ffffff" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="230" cy="338" r="16" fill="#f4f4f4" stroke="#0F62FE" strokeWidth="6" />
            <circle cx="120" cy="324" r="14" fill="#ffffff" stroke="#0F62FE" strokeWidth="6" />
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center px-7 sm:px-10">
          <div className="surface-dark w-full max-w-[31rem] whitespace-normal rounded-[1.125rem] border border-white/10 px-4 py-3 text-center text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.08em] text-white shadow-[0_10px_20px_rgba(15,23,42,0.18)] sm:px-5 sm:text-[0.67rem]">
            {t.home.hero.visualBadge}
          </div>
        </div>

        <div className="h-20 sm:h-[5.5rem]" />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="surface-soft rounded-[1.3rem] border border-brand-border px-4 py-4">
            <div className="text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-brand-blue">{card.label}</div>
            <div className="mt-2 text-sm leading-6 text-brand-charcoal">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
