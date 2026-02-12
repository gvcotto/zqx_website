"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "ok">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: connect to Formspree/Resend/API
    setStatus("ok");
  }

  return (
    <form onSubmit={onSubmit} className="hover-lift rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="text-lg font-semibold">{t.contact.formTitle}</div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm text-zinc-300">{t.contact.name}</span>
          <input
            name="name"
            className="focus-ring rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 outline-none focus:border-white/30"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-zinc-300">{t.contact.email}</span>
          <input
            name="email"
            type="email"
            className="focus-ring rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 outline-none focus:border-white/30"
            required
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm text-zinc-300">{t.contact.message}</span>
          <textarea
            name="message"
            rows={5}
            className="focus-ring rounded-xl border border-white/10 bg-zinc-950/60 px-4 py-3 outline-none focus:border-white/30"
            required
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="focus-ring pressable hover-lift rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-200">
          {t.contact.send}
        </button>
      </div>

      {status === "ok" ? <div className="mt-4 text-sm text-zinc-200">{t.contact.success}</div> : null}
    </form>
  );
}
