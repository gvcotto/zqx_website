"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Navbar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (segment: "services" | "platform" | "about" | "contact") => {
    const base = `/${locale}/${segment}`;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  const localeBase = `/${locale}`;
  const strippedRaw = pathname.startsWith(localeBase) ? pathname.slice(localeBase.length) : pathname;
  const switchPath = strippedRaw === "/" || strippedRaw === "" ? "" : strippedRaw;

  const linkClass = (segment: "services" | "platform" | "about" | "contact") =>
    `focus-ring pressable nav-link ${isActive(segment) ? "nav-link-active text-brand-charcoal" : "text-brand-muted hover:text-brand-charcoal"}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        isScrolled
          ? "surface-panel border-brand-border shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
          : "border-brand-border/70 bg-[rgba(255,255,255,0.42)] backdrop-blur-xl"
      }`}
    >
      <div className="container flex h-24 items-center justify-between gap-6">
        <div className="inline-flex items-center gap-3">
          <Link
            href={`/${locale}/ai-game`}
            className="focus-ring pressable inline-flex items-center gap-2 rounded-md px-1 py-0.5"
            aria-label="Open AI game"
            title="Open AI game"
          >
            <Image
              src="/zqx.svg"
              alt="ZQX"
              width={88}
              height={64}
              className="h-8 w-auto sm:h-10"
              priority
            />
          </Link>
          <Link href={`/${locale}`} className="focus-ring pressable rounded-md px-1 py-0.5" aria-label="Go to home">
            <span className="text-base font-semibold tracking-tight md:hidden">ZQX</span>
            <span className="hidden text-xl font-semibold tracking-tight md:inline">ZQX Digital Consulting</span>
          </Link>
        </div>

        <div className="hidden items-center gap-5 md:flex">
          <nav className="flex items-center gap-5 text-sm">
            <Link href={`/${locale}/services`} className={linkClass("services")}>
              {t.nav.services}
            </Link>
            <Link href={`/${locale}/platform`} className={linkClass("platform")}>
              {t.nav.platform}
            </Link>
            <Link href={`/${locale}/about`} className={linkClass("about")}>
              {t.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} className={linkClass("contact")}>
              {t.nav.contact}
            </Link>
          </nav>

          <a
            href={site.whatsapp}
            className="focus-ring pressable surface-soft inline-flex rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-charcoal hover:border-brand-blue"
            target="_blank"
            rel="noreferrer"
          >
            {t.nav.whatsapp}
          </a>

          <LocaleSwitcher locale={locale} pathname={switchPath} />
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LocaleSwitcher locale={locale} pathname={switchPath} />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="focus-ring pressable surface-soft inline-flex rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-charcoal hover:border-brand-blue"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="mobile-nav" className="surface-panel border-t border-brand-border md:hidden">
          <div className="container flex flex-col gap-4 py-5">
            <Link href={`/${locale}/services`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.services}
            </Link>
            <Link href={`/${locale}/platform`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.platform}
            </Link>
            <Link href={`/${locale}/about`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.contact}
            </Link>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-charcoal">
              {t.nav.whatsapp}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
