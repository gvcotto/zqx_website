"use client";

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

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (segment: "services" | "about" | "contact") => {
    const base = `/${locale}/${segment}`;
    return pathname === base || pathname.startsWith(`${base}/`);
  };

  const localeBase = `/${locale}`;
  const strippedRaw = pathname.startsWith(localeBase) ? pathname.slice(localeBase.length) : pathname;
  const switchPath = strippedRaw === "/" || strippedRaw === "" ? "" : strippedRaw;

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur transition-colors duration-300 ${
        isScrolled
          ? "border-white/20 bg-zinc-950/85 shadow-sm shadow-black/30"
          : "border-white/10 bg-zinc-950/60"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="focus-ring pressable rounded-md px-1 py-0.5 font-semibold tracking-tight">
          {site.name}
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-300">
          <Link
            href={`/${locale}/services`}
            className={`focus-ring pressable nav-link ${isActive("services") ? "nav-link-active text-zinc-100" : ""}`}
          >
            {t.nav.services}
          </Link>
          <Link
            href={`/${locale}/about`}
            className={`focus-ring pressable nav-link ${isActive("about") ? "nav-link-active text-zinc-100" : ""}`}
          >
            {t.nav.about}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className={`focus-ring pressable nav-link ${isActive("contact") ? "nav-link-active text-zinc-100" : ""}`}
          >
            {t.nav.contact}
          </Link>

          <a
            href={site.whatsapp}
            className="focus-ring pressable hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-white hover:bg-white/10 sm:inline-flex"
            target="_blank"
            rel="noreferrer"
          >
            {t.nav.whatsapp}
          </a>

          <LocaleSwitcher locale={locale} pathname={switchPath} />
        </nav>
      </div>
    </header>
  );
}
