import type { Locale } from "@/lib/i18n";
import { en } from "./en";
import { es } from "./es";

const dictionaries = { en, es } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
