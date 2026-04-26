import { NextResponse } from "next/server";
import { buildLocalAnswer, buildSiteContext, detectChatLocale, type ChatHistoryItem } from "@/lib/chat";
import { isLocale, type Locale } from "@/lib/i18n";

type ChatPayload = {
  message?: string;
  locale?: string;
  history?: ChatHistoryItem[];
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = process.env.OPENAI_CHAT_MODEL ?? "gpt-5.4-mini";

function cleanHistory(history: unknown): ChatHistoryItem[] {
  if (!Array.isArray(history)) return [];

  return history
    .filter((item): item is ChatHistoryItem => {
      if (!item || typeof item !== "object") return false;
      const candidate = item as Partial<ChatHistoryItem>;
      return (candidate.role === "assistant" || candidate.role === "user") && typeof candidate.text === "string";
    })
    .slice(-6)
    .map((item) => ({
      role: item.role,
      text: item.text.slice(0, 900),
    }));
}

function extractOpenAIText(data: OpenAIResponse) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  return (
    data.output
      ?.flatMap((item) => item.content ?? [])
      .map((content) => content.text)
      .filter((text): text is string => Boolean(text?.trim()))
      .join("\n")
      .trim() ?? ""
  );
}

function buildPrompt(message: string, locale: Locale, history: ChatHistoryItem[]) {
  const language = locale === "es" ? "Spanish" : "English";
  const contactInstruction =
    locale === "es"
      ? "Siempre ofrece Contacto o WhatsApp como siguiente paso cuando el usuario necesite detalle, alcance, precios o una reunion."
      : "Always offer Contact or WhatsApp as the next step when the user needs details, scope, pricing, or a meeting.";

  const historyText = history.length
    ? history.map((item) => `${item.role === "assistant" ? "Assistant" : "User"}: ${item.text}`).join("\n")
    : "No prior messages.";

  return [
    `User preferred language: ${language}. Reply only in ${language}.`,
    "You are the ZQX Digital Consulting website assistant.",
    "Use only the site context below. Do not invent pricing, guarantees, client names, certifications, or timelines that are not present.",
    "Keep replies concise, practical, and helpful. If information is missing, say that the team can clarify it.",
    contactInstruction,
    "",
    "Recent conversation:",
    historyText,
    "",
    "Site context:",
    buildSiteContext(locale),
    "",
    "User question:",
    message,
  ].join("\n");
}

async function generateOpenAIAnswer(message: string, locale: Locale, history: ChatHistoryItem[]) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions:
        "You are a concise multilingual sales-support assistant for ZQX Digital Consulting. Answer from the provided website context and guide qualified visitors toward Contact or WhatsApp.",
      input: buildPrompt(message, locale, history),
      max_output_tokens: 520,
    }),
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OpenAIResponse;
  return extractOpenAIText(data);
}

export async function POST(req: Request) {
  let body: ChatPayload;

  try {
    body = (await req.json()) as ChatPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawMessage = body.message?.trim() ?? "";
  const fallbackLocale = body.locale && isLocale(body.locale) ? body.locale : ("en" as Locale);
  const locale = detectChatLocale(rawMessage, fallbackLocale);
  const history = cleanHistory(body.history);

  if (!rawMessage) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const message = rawMessage.slice(0, 1200);
  const localAnswer = buildLocalAnswer(message, locale);

  try {
    const aiAnswer = await generateOpenAIAnswer(message, locale, history);

    return NextResponse.json({
      answer: aiAnswer || localAnswer,
      locale,
      source: aiAnswer ? "ai" : "local",
    });
  } catch {
    return NextResponse.json({
      answer: localAnswer,
      locale,
      source: "local",
    });
  }
}
