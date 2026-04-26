import type { Locale } from "@/lib/i18n";
import { getDictionary, type Dictionary } from "@/lib/dictionaries";
import { titleCase } from "@/lib/text";

export type ChatRole = "assistant" | "user";

export type ChatHistoryItem = {
  role: ChatRole;
  text: string;
};

export const CHAT_TEXT = {
  es: {
    name: "Asistente ZQX",
    subtitle: "El equipo también puede ayudar",
    launcher: "Chat ZQX",
    intro:
      "Hola. Puedo ayudarte con servicios, IA, automatización, nube, datos, plataforma y el modelo de entrega de ZQX. También puedo llevarte a Contacto o WhatsApp para coordinar un acercamiento.",
    input: "Escribe una pregunta...",
    send: "Enviar",
    close: "Cerrar",
    suggestions: ["¿Qué servicios ofrecen?", "¿Cómo trabajan un proyecto?", "Quiero automatizar un proceso", "¿Cómo los contacto?"],
    contactOffer:
      "Para aterrizarlo a tu caso, puedes escribirnos por WhatsApp o abrir Contacto. Compartes el contexto inicial y respondemos con alcance, tiempos y siguientes pasos.",
    fallback:
      "Puedo orientarte con la información del sitio: servicios, plataforma, IA, automatización, nube, datos, ciberseguridad, producto y modelo de entrega.",
    contact:
      "Puedes iniciar por el formulario de Contacto o por WhatsApp. La página indica que recibes una confirmación automática y luego seguimiento humano con siguientes pasos.",
    servicesLead: "ZQX puede apoyar en estas áreas:",
    processLead: "El modelo de entrega sigue esta secuencia:",
    platformLead: "La plataforma puede incluir tableros, predicciones, asistentes y flujos de trabajo conectados.",
    aiLead: "En IA y automatización, ZQX conecta asistentes, flujos de trabajo, aprobaciones, datos y controles operativos para que funcionen en operaciones reales.",
    pricingLead:
      "El sitio no publica precios fijos porque el alcance depende del mandato, integraciones, riesgos y tiempos. Lo más práctico es compartir el contexto inicial para definir una ruta realista.",
    quickLabel: "Preguntas rápidas",
    whatsapp: "WhatsApp",
    contactButton: "Contacto",
    typing: "Preparando respuesta",
  },
  en: {
    name: "ZQX Assistant",
    subtitle: "The team can also help",
    launcher: "ZQX Chat",
    intro:
      "Hi. I can help with ZQX services, AI, automation, cloud, data, platform work, and delivery approach. I can also point you to Contact or WhatsApp to start a conversation.",
    input: "Ask a question...",
    send: "Send",
    close: "Close",
    suggestions: ["What services do you offer?", "How do projects work?", "I want to automate a process", "How can I contact you?"],
    contactOffer:
      "To make this specific to your case, you can message us on WhatsApp or open Contact. Share the brief and we will respond with scope, timing, and next steps.",
    fallback:
      "I can guide you using the site information: services, platform, AI, automation, cloud, data, cybersecurity, product work, and delivery approach.",
    contact:
      "You can start through the Contact form or WhatsApp. The site notes that an automatic confirmation is sent first, followed by human follow-up with next steps.",
    servicesLead: "ZQX can support these areas:",
    processLead: "The delivery approach follows this sequence:",
    platformLead: "The platform can include dashboards, predictions, assistants, and connected workflows.",
    aiLead: "For AI and automation, ZQX connects assistants, workflows, approvals, data, and operational controls so they can run inside real operations.",
    pricingLead:
      "The site does not publish fixed pricing because scope depends on the mandate, integrations, risks, and timing. The practical next step is to share a brief.",
    quickLabel: "Quick questions",
    whatsapp: "WhatsApp",
    contactButton: "Contact",
    typing: "Preparing answer",
  },
} as const;

export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function detectChatLocale(value: string, fallback: Locale): Locale {
  const normalized = normalize(value);

  if (
    /[ñáéíóúü¿¡]/i.test(value) ||
    [
      "espanol",
      "español",
      "hola",
      "gracias",
      "quiero",
      "necesito",
      "puedes",
      "podrias",
      "podrías",
      "como",
      "cómo",
      "que ",
      "qué ",
      "servicios",
      "contacto",
      "automatizacion",
      "automatización",
      "modernizacion",
      "modernización",
      "orquestacion",
      "orquestación",
      "reunion",
      "reunión",
      "acercamiento",
    ].some((keyword) => normalized.includes(normalize(keyword)))
  ) {
    return "es";
  }

  if (["english", "hello", "thanks", "what", "how", "services", "contact", "automation", "modernization", "meeting"].some((keyword) => normalized.includes(keyword))) {
    return "en";
  }

  return fallback;
}

function includesAny(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function listItems(items: readonly { title: string; desc?: string; summary?: string }[], limit = items.length) {
  return items
    .slice(0, limit)
    .map((item) => `- ${titleCase(item.title)}: ${item.desc ?? item.summary ?? ""}`)
    .join("\n");
}

export function buildLocalAnswer(question: string, locale: Locale) {
  const t = getDictionary(locale);
  const chat = CHAT_TEXT[locale];
  const normalized = normalize(question);
  let answer: string = chat.fallback;

  if (includesAny(normalized, ["contact", "contacto", "whatsapp", "email", "correo", "llamar", "call", "meeting", "reunion", "reunión", "acercamiento"])) {
    answer = chat.contact;
  } else if (includesAny(normalized, ["precio", "costo", "cost", "price", "pricing", "cuanto", "cuánto", "budget", "presupuesto"])) {
    answer = chat.pricingLead;
  } else if (includesAny(normalized, ["servicio", "service", "ofrecen", "offer", "capacidad", "capabilities", "pueden hacer"])) {
    answer = `${chat.servicesLead}\n${listItems(t.services)}`;
  } else if (includesAny(normalized, ["proceso", "approach", "metodo", "método", "metodologia", "metodología", "trabajan", "project", "proyecto", "delivery", "entrega"])) {
    answer = `${chat.processLead}\n${listItems(t.process)}`;
  } else if (includesAny(normalized, ["platform", "plataforma", "dashboard", "dashboards", "workflow", "workflows", "predic", "forecast", "assistant", "asistente"])) {
    answer = `${chat.platformLead}\n${listItems(t.platformPage.modules.items)}`;
  } else if (includesAny(normalized, ["ai", "ia", "automat", "automation", "orquest", "orchestrat", "copilot", "chatbot", "agente", "agent"])) {
    answer = `${chat.aiLead}\n${t.strategicInnovation.body}`;
  } else if (includesAny(normalized, ["cloud", "nube", "data", "datos", "cyber", "seguridad", "security", "producto", "product", "integracion", "integración", "integration"])) {
    const related = t.services.filter((service) => {
      const text = normalize(`${service.title} ${service.desc}`);
      return ["cloud", "nube", "data", "datos", "cyber", "seguridad", "security", "producto", "product", "integracion", "integración", "integration"].some((keyword) => text.includes(normalize(keyword)));
    });
    answer = `${chat.servicesLead}\n${listItems(related.length > 0 ? related : t.services, 4)}`;
  }

  return `${answer}\n\n${chat.contactOffer}`;
}

export function buildSiteContext(locale: Locale) {
  const t: Dictionary = getDictionary(locale);

  return [
    `Site: ZQX Digital Consulting.`,
    `Hero: ${t.home.hero.title} ${t.home.hero.subtitle}`,
    `Mission: ${t.mission.short} ${t.mission.standard}`,
    `Vision: ${t.vision.short} ${t.vision.standard}`,
    `AI orchestration: ${t.strategicInnovation.title} ${t.strategicInnovation.body}`,
    `Services:\n${listItems(t.services)}`,
    `Delivery approach:\n${listItems(t.process)}`,
    `Platform: ${t.platformPage.title} ${t.platformPage.subtitle}\n${listItems(t.platformPage.modules.items)}`,
    `Contact: ${t.sections.contactSubtitle}`,
  ].join("\n\n");
}
