"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionaries";
import { site } from "@/lib/site";

export default function ContactForm({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("ok");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-brand-border bg-brand-white p-6 md:p-8">
      <div className="text-xl font-semibold tracking-tight">{t.contact.formTitle}</div>
      <div className="mt-2 text-sm text-brand-muted">
        {t.contact.orEmail}{" "}
        <a className="font-medium text-brand-charcoal hover:text-brand-blue" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-brand-muted">{t.contact.name}</span>
          <input
            name="name"
            className="focus-ring rounded-xl border border-brand-border bg-brand-gray px-4 py-3 outline-none focus:border-brand-blue"
            required
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-medium text-brand-muted">{t.contact.email}</span>
          <input
            name="email"
            type="email"
            className="focus-ring rounded-xl border border-brand-border bg-brand-gray px-4 py-3 outline-none focus:border-brand-blue"
            required
          />
        </label>

        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-brand-muted">{t.contact.message}</span>
          <textarea
            name="message"
            rows={5}
            className="focus-ring rounded-xl border border-brand-border bg-brand-gray px-4 py-3 outline-none focus:border-brand-blue"
            required
          />
        </label>
      </div>

      <div className="mt-5">
        <button
          disabled={status === "sending"}
          className="focus-ring pressable inline-flex rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-brand-white hover:bg-[#195dd6] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? t.contact.sending : t.contact.send}
        </button>
      </div>

      {status === "ok" ? <div className="mt-4 text-sm text-brand-muted">{t.contact.success}</div> : null}
      {status === "error" ? <div className="mt-4 text-sm text-brand-muted">{t.contact.error}</div> : null}
    </form>
  );
}
