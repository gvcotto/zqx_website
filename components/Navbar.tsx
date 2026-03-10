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

  const isActive = (segment: "services" | "about" | "contact") => {
    const base = `/${locale}/${segment}`;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  const localeBase = `/${locale}`;
  const strippedRaw = pathname.startsWith(localeBase) ? pathname.slice(localeBase.length) : pathname;
  const switchPath = strippedRaw === "/" || strippedRaw === "" ? "" : strippedRaw;

  const linkClass = (segment: "services" | "about" | "contact") =>
    `focus-ring pressable nav-link ${isActive(segment) ? "nav-link-active text-brand-charcoal" : "text-brand-muted hover:text-brand-charcoal"}`;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        isScrolled ? "border-brand-border bg-brand-white/95" : "border-brand-border/80 bg-brand-white/90"
      }`}
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link
          href={`/${locale}`}
          className="focus-ring pressable inline-flex items-center gap-2.5 rounded-md px-1 py-0.5 text-base font-semibold tracking-tight sm:text-lg"
        >
          <Image
            src="/images/ZQX_logo.svg"
            alt="ZQX Digital Consulting"
            width={144}
            height={72}
            className="h-7 w-auto sm:h-8"
            priority
          />
          <span>{site.name}</span>
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          <nav className="flex items-center gap-5 text-sm">
            <Link href={`/${locale}/services`} className={linkClass("services")}>
              {t.nav.services}
            </Link>
            <Link href={`/${locale}/about`} className={linkClass("about")}>
              {t.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} className={linkClass("contact")}>
              {t.nav.contact}
            </Link>
          </nav>

          <a
            href={`mailto:${site.email}`}
            className="focus-ring pressable text-sm font-medium text-brand-muted hover:text-brand-charcoal"
          >
            {site.email}
          </a>

          <a
            href={site.whatsapp}
            className="focus-ring pressable inline-flex rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-medium text-brand-charcoal hover:border-brand-blue"
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
            className="focus-ring pressable inline-flex rounded-full border border-brand-border bg-brand-white px-4 py-2 text-sm font-medium text-brand-charcoal hover:border-brand-blue"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? t.nav.close : t.nav.menu}
          </button>
        </div>
      </div>

      {isMenuOpen ? (
        <div id="mobile-nav" className="border-t border-brand-border bg-brand-white md:hidden">
          <div className="container flex flex-col gap-4 py-5">
            <Link href={`/${locale}/services`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.services}
            </Link>
            <Link href={`/${locale}/about`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm font-medium text-brand-charcoal">
              {t.nav.contact}
            </Link>
            <a href={`mailto:${site.email}`} className="text-sm font-medium text-brand-charcoal">
              {site.email}
            </a>
            <a href={site.whatsapp} target="_blank" rel="noreferrer" className="text-sm font-medium text-brand-charcoal">
              {t.nav.whatsapp}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
