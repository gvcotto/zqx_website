"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";
import { buildLocalAnswer, CHAT_TEXT, detectChatLocale, type ChatRole } from "@/lib/chat";

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

export default function SiteChat({ locale }: { locale: Locale }) {
  const [uiLocale, setUiLocale] = useState<Locale>(locale);
  const chat = CHAT_TEXT[uiLocale];
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 1, role: "assistant", text: CHAT_TEXT[locale].intro }]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const nextIdRef = useRef(2);

  const contactHref = `/${uiLocale}/contact`;
  const suggestions = useMemo(() => chat.suggestions, [chat.suggestions]);

  useEffect(() => {
    setUiLocale(locale);
    setMessages([{ id: 1, role: "assistant", text: CHAT_TEXT[locale].intro }]);
    setInput("");
    setIsTyping(false);
    nextIdRef.current = 2;
  }, [locale]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages, isTyping]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isTyping) return;

    const responseLocale = detectChatLocale(trimmed, uiLocale);
    setUiLocale(responseLocale);
    const userMessage: ChatMessage = { id: nextIdRef.current++, role: "user", text: trimmed };
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          locale: responseLocale,
          history: messages.slice(-6).map(({ role, text }) => ({ role, text })),
        }),
      });

      if (!response.ok) throw new Error("Chat request failed.");

      const data = (await response.json()) as { answer?: string; locale?: Locale };
      const answerLocale = data.locale === "en" || data.locale === "es" ? data.locale : responseLocale;
      setUiLocale(answerLocale);
      const answer: ChatMessage = { id: nextIdRef.current++, role: "assistant", text: data.answer?.trim() || buildLocalAnswer(trimmed, answerLocale) };
      setMessages((current) => [...current, answer]);
    } catch {
      const answer: ChatMessage = { id: nextIdRef.current++, role: "assistant", text: buildLocalAnswer(trimmed, responseLocale) };
      setMessages((current) => [...current, answer]);
    } finally {
      setIsTyping(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] sm:bottom-5 sm:right-5">
      {isOpen ? (
        <section
          className="surface-panel flex h-[min(42rem,calc(100vh-2rem))] w-[calc(100vw-2rem)] max-w-[25rem] flex-col overflow-hidden rounded-[1.7rem] border border-brand-border shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
          role="dialog"
          aria-labelledby="zqx-chat-title"
          aria-describedby="zqx-chat-subtitle"
        >
          <header className="flex items-center justify-between gap-3 border-b border-brand-border bg-white/70 px-4 py-3 backdrop-blur-xl">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-brand-charcoal text-sm font-semibold text-white">ZQX</div>
              <div className="min-w-0">
                <div id="zqx-chat-title" className="truncate text-sm font-semibold text-brand-charcoal">
                  {chat.name}
                </div>
                <div id="zqx-chat-subtitle" className="truncate text-xs text-brand-muted">
                  {chat.subtitle}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="focus-ring pressable grid h-9 w-9 place-items-center rounded-full text-brand-muted hover:bg-brand-gray hover:text-brand-charcoal"
              aria-label={chat.close}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] whitespace-pre-line rounded-[1.3rem] px-4 py-3 text-sm leading-6 ${
                    message.role === "user" ? "bg-brand-blue text-white" : "bg-white/82 text-brand-charcoal shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping ? (
              <div className="flex justify-start">
                <div className="rounded-[1.3rem] bg-white/82 px-4 py-3 text-sm text-brand-muted shadow-[0_10px_26px_rgba(15,23,42,0.08)]">{chat.typing}...</div>
              </div>
            ) : null}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-brand-border bg-white/66 p-4 backdrop-blur-xl">
            <div className="mb-3">
              <div className="mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-muted">{chat.quickLabel}</div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => ask(suggestion)}
                    className="focus-ring pressable shrink-0 rounded-full border border-brand-border bg-white/74 px-3 py-2 text-xs font-medium text-brand-charcoal hover:border-brand-blue"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 rounded-[1.3rem] border border-brand-border bg-white/86 p-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={chat.input}
                aria-label={chat.input}
                className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-brand-charcoal outline-none placeholder:text-brand-muted"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="focus-ring pressable grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-blue text-white hover:bg-[#0043ce] disabled:bg-brand-gray disabled:text-brand-muted"
                aria-label={chat.send}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                  <path d="M5 12H18M13 7L18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>

            <div className="mt-3 flex items-center justify-end gap-3 text-xs text-brand-muted">
              <div className="flex shrink-0 items-center gap-3 font-medium text-brand-charcoal">
                <Link href={contactHref} className="hover:text-brand-blue" onClick={() => setIsOpen(false)}>
                  {chat.contactButton}
                </Link>
                <a href={site.whatsapp} target="_blank" rel="noreferrer" className="hover:text-brand-blue">
                  {chat.whatsapp}
                </a>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="focus-ring pressable flex items-center gap-3 rounded-full bg-brand-charcoal px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_46px_rgba(15,23,42,0.28)] hover:bg-black"
          aria-label={chat.launcher}
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-brand-blue">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M5 7.5C5 5.6 6.6 4 8.5 4H15.5C17.4 4 19 5.6 19 7.5V12.5C19 14.4 17.4 16 15.5 16H11L7.5 19V16H8.5C6.6 16 5 14.4 5 12.5V7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-brand-charcoal bg-[#24D68A]" />
          </span>
          <span className="hidden sm:inline">{chat.launcher}</span>
        </button>
      )}
    </div>
  );
}
