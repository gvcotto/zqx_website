import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function HeroVisualCard({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <div className="relative mx-auto w-full max-w-[34rem] rounded-[2rem] border border-brand-border bg-brand-white p-6 shadow-[0_18px_40px_rgba(31,35,40,0.08)] sm:p-8">
      <div className="rounded-[1.5rem] border border-brand-border bg-brand-gray px-4 py-5 sm:px-6 sm:py-6">
        <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label={t.home.hero.visualBadge}>
          <title>{t.home.hero.visualBadge}</title>
          <g stroke="#1F2328" strokeWidth="4" fill="none" strokeLinecap="round">
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
            <circle cx="116" cy="100" r="18" fill="#F4F6F8" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="282" cy="72" r="20" fill="#FFFFFF" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="418" cy="136" r="18" fill="#F4F6F8" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="188" cy="222" r="16" fill="#FFFFFF" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="284" cy="208" r="22" fill="#F4F6F8" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="386" cy="302" r="18" fill="#FFFFFF" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="230" cy="338" r="16" fill="#F4F6F8" stroke="#1F6FFF" strokeWidth="6" />
            <circle cx="120" cy="324" r="14" fill="#FFFFFF" stroke="#1F6FFF" strokeWidth="6" />
          </g>
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-6 sm:px-8">
        <div className="w-full max-w-[30rem] whitespace-normal rounded-[1.125rem] border border-brand-border bg-brand-charcoal px-4 py-3 text-center text-[0.56rem] font-semibold uppercase leading-[1.35] tracking-[0.08em] text-brand-white shadow-[0_10px_20px_rgba(31,35,40,0.12)] sm:px-5 sm:text-[0.67rem]">
          {t.home.hero.visualBadge}
        </div>
      </div>

      <div className="h-20 sm:h-[5.5rem]" />
    </div>
  );
}
