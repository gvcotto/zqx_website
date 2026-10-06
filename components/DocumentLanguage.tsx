"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

// Shared root layouts persist across locale navigation. Keep assistive
// technology's document language in sync with the validated route locale.
export default function DocumentLanguage({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
