import { NextResponse } from "next/server";
import { Resend } from "resend";
import { site } from "@/lib/site";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  let body: ContactPayload;

  try {
    body = (await req.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "ZQX Digital Consulting <onboarding@resend.dev>";

  try {
    await resend.emails.send({
      from: fromEmail,
      to: site.email,
      replyTo: email,
      subject: `New contact form message from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join("\n"),
      html: `
        <div style="font-family: Inter, system-ui, sans-serif; color: #1F2328; line-height: 1.6;">
          <h2 style="margin: 0 0 16px;">New contact form message</h2>
          <p style="margin: 0 0 8px;"><strong>Name:</strong> ${name}</p>
          <p style="margin: 0 0 8px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 16px 0 8px;"><strong>Message:</strong></p>
          <div style="white-space: pre-wrap;">${message}</div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send email." }, { status: 500 });
  }
}
