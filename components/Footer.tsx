import { site } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-zinc-400">
          © {new Date().getFullYear()} {site.name}. {t.footer.rights}
        </div>
        <div className="text-sm text-zinc-400">
          <a className="hover:text-white" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
