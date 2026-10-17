import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isLocale, type Locale } from "@/lib/i18n";
import { z } from "zod";
import { publicValidationError, readPublicJson } from "@/lib/api-request";

const contactPayloadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(5000),
  locale: z.string().max(5).optional(),
}).strict();

const CONTACT_INBOX = process.env.CONTACT_INBOX ?? "info@zqxconsulting.com";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getAutoReplyCopy(locale: Locale) {
  if (locale === "es") {
    return {
      subject: "Recibimos tu mensaje | ZQX Digital Consulting",
      greeting: "Gracias por contactar a ZQX Digital Consulting.",
      body: "Tu mensaje fue recibido correctamente. Enviamos esta confirmación automática mientras revisamos el contexto para responder con siguientes pasos claros.",
      followUp: "El equipo dará seguimiento con alcance, tiempos y ruta recomendada.",
    };
  }

  return {
    subject: "We received your message | ZQX Digital Consulting",
    greeting: "Thank you for contacting ZQX Digital Consulting.",
    body: "Your message has been received. This automatic reply confirms we have it while we review the context and prepare clear next steps.",
    followUp: "Our team will follow up with scope, timing, and a recommended path forward.",
  };
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let body: z.infer<typeof contactPayloadSchema>;
  try {
    body = contactPayloadSchema.parse(await readPublicJson(req));
  } catch (error) {
    return publicValidationError(error) ?? NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";
  const locale = body.locale && isLocale(body.locale) ? body.locale : ("en" as Locale);

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "ZQX Digital Consulting <onboarding@resend.dev>";
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL ?? CONTACT_INBOX;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const autoReply = getAutoReplyCopy(locale);

  try {
    const deliveries = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: CONTACT_INBOX,
        replyTo: email,
        subject: `New contact form message from ${name}`,
        text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
        html: `
          <div style="font-family: 'IBM Plex Sans', Inter, system-ui, sans-serif; color: #161616; line-height: 1.6;">
            <h2 style="margin: 0 0 16px;">New contact form message</h2>
            <p style="margin: 0 0 8px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 0 0 8px;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
            <div style="white-space: pre-wrap;">${safeMessage}</div>
          </div>
        `,
      }),
      resend.emails.send({
        from: fromEmail,
        to: email,
        replyTo: replyToEmail,
        subject: autoReply.subject,
        text: [autoReply.greeting, "", autoReply.body, "", autoReply.followUp].join("\n"),
        html: `
          <div style="font-family: 'IBM Plex Sans', Inter, system-ui, sans-serif; color: #161616; line-height: 1.65;">
            <h2 style="margin: 0 0 16px;">${autoReply.greeting}</h2>
            <p style="margin: 0 0 12px;">${autoReply.body}</p>
            <p style="margin: 0;">${autoReply.followUp}</p>
          </div>
        `,
      }),
    ]);

    // The provider SDK resolves rejected requests as { data: null, error },
    // rather than throwing. A contact acknowledgement requires both accepts.
    if (deliveries.some((delivery) => delivery.error || !delivery.data?.id)) {
      return NextResponse.json({ error: "Unable to send email." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send email." }, { status: 500 });
  }
}
