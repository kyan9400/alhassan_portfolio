import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/ui-copy";

type Payload = { name?: unknown; email?: unknown; projectType?: unknown; message?: unknown; company?: unknown };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/**
 * Sends the contact form via Resend when RESEND_API_KEY is set.
 * Without a key it answers `{ fallback: true }` so the client opens a mailto: instead.
 */
export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: real people never fill the hidden "company" field.
  if (clean(body.company, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const projectType = clean(body.projectType, 120);
  const message = clean(body.message, 5000);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return NextResponse.json({ ok: false, fallback: true });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
      reply_to: email,
      subject: `[Portfolio] ${projectType || "New message"} — ${name}`,
      html: `<p><strong>Name:</strong> ${escape(name)}</p><p><strong>Email:</strong> ${escape(email)}</p><p><strong>Project type:</strong> ${escape(projectType || "-")}</p><hr/><p style="white-space:pre-wrap">${escape(message)}</p>`
    })
  });

  if (!res.ok) return NextResponse.json({ ok: false, fallback: true }, { status: 502 });
  return NextResponse.json({ ok: true });
}
