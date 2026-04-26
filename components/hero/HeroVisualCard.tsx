import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function HeroVisualCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const cards =
    locale === "es"
      ? [
          { label: "Entrada", value: "Sistemas y flujos del negocio" },
          { label: "Modelo", value: "Gobierno y diseño operativo" },
          { label: "Salida", value: "Entrega conectada a operaciones" },
        ]
      : [
          { label: "Input", value: "Business systems and workflows" },
          { label: "Model", value: "Governance and operating design" },
          { label: "Output", value: "Delivery connected to operations" },
        ];
  const orchestrationLabel = locale === "es" ? "Mapa de orquestación" : "Orchestration map";
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
          <defs>
            <linearGradient id="orchestration-active-line" x1="80" x2="440" y1="60" y2="340" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgba(15,98,254,0.95)" />
              <stop offset="100%" stopColor="rgba(36,214,138,0.9)" />
            </linearGradient>
            <filter id="orchestration-node-shadow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="rgba(15,23,42,0.18)" />
            </filter>
          </defs>

          <g stroke="#525252" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.34">
            <path id="orchestration-route-input-model" d="M116 100L282 72" />
            <path d="M116 100L188 222" />
            <path id="orchestration-route-model-signal" d="M282 72L418 136" />
            <path d="M282 72L284 208" />
            <path d="M188 222L284 208" />
            <path d="M188 222L120 324" />
            <path id="orchestration-route-core-signal" d="M284 208L418 136" />
            <path id="orchestration-route-core-output" d="M284 208L386 302" />
            <path d="M284 208L230 338" />
            <path d="M418 136L386 302" />
            <path id="orchestration-route-bottom" d="M120 324L230 338" />
            <path d="M230 338L386 302" />
          </g>

          <g stroke="url(#orchestration-active-line)" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeDasharray="10 16" opacity="0.9">
            <path d="M116 100L282 72">
              <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="3.2s" repeatCount="indefinite" />
            </path>
            <path d="M282 72L418 136">
              <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="3.8s" repeatCount="indefinite" />
            </path>
            <path d="M284 208L418 136">
              <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="3.5s" repeatCount="indefinite" />
            </path>
            <path d="M284 208L386 302">
              <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="4s" repeatCount="indefinite" />
            </path>
            <path d="M120 324L230 338">
              <animate attributeName="stroke-dashoffset" from="0" to="-52" dur="4.3s" repeatCount="indefinite" />
            </path>
          </g>

          <g>
            {[
              { route: "orchestration-route-input-model", color: "#0F62FE", delay: "0s", duration: "4.2s" },
              { route: "orchestration-route-model-signal", color: "#24D68A", delay: "0.8s", duration: "4.6s" },
              { route: "orchestration-route-core-output", color: "#0F62FE", delay: "1.5s", duration: "4.8s" },
              { route: "orchestration-route-bottom", color: "#24D68A", delay: "2.2s", duration: "5.1s" },
            ].map((signal) => (
              <circle key={signal.route} r="7" fill={signal.color}>
                <animateMotion dur={signal.duration} begin={signal.delay} repeatCount="indefinite" rotate="auto">
                  <mpath href={`#${signal.route}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" dur={signal.duration} begin={signal.delay} repeatCount="indefinite" />
              </circle>
            ))}
          </g>

          <g filter="url(#orchestration-node-shadow)">
            {[
              { x: 116, y: 100, r: 18, fill: "#f4f4f4", delay: "0s" },
              { x: 282, y: 72, r: 20, fill: "#ffffff", delay: "0.3s" },
              { x: 418, y: 136, r: 18, fill: "#f4f4f4", delay: "0.6s" },
              { x: 188, y: 222, r: 16, fill: "#ffffff", delay: "0.9s" },
              { x: 284, y: 208, r: 22, fill: "#f4f4f4", delay: "1.2s" },
              { x: 386, y: 302, r: 18, fill: "#ffffff", delay: "1.5s" },
              { x: 230, y: 338, r: 16, fill: "#f4f4f4", delay: "1.8s" },
              { x: 120, y: 324, r: 14, fill: "#ffffff", delay: "2.1s" },
            ].map((node) => (
              <g key={`${node.x}-${node.y}`}>
                <circle cx={node.x} cy={node.y} r={node.r + 11} fill="rgba(15,98,254,0.12)">
                  <animate attributeName="r" values={`${node.r + 5};${node.r + 13};${node.r + 5}`} dur="4.6s" begin={node.delay} repeatCount="indefinite" />
                </circle>
                <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} stroke="#0F62FE" strokeWidth="6" />
                <circle cx={node.x} cy={node.y} r="5" fill="#24D68A">
                  <animate attributeName="opacity" values="0.35;1;0.35" dur="3.4s" begin={node.delay} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
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
