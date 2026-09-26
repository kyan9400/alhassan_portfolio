import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "@/lib/ui-copy";

/*
 * Contact form → email via Resend.
 *
 * Request:  { name, email, reason: "hiring" | "freelance" | "other", message, company, startedAt, elapsedMs? }
 * Response: { ok: true } | { ok: false, error: "invalid" | "too_fast" | "send_failed" | "not_configured" }
 *
 * Bots are answered with a silent { ok: true } and nothing is sent: the hidden "company" honeypot is
 * filled, the form was submitted < 3 s after it rendered (or the request carries no usable timing at
 * all), or the message carries more than 3 links. A 429 ("too_fast") means the per-IP rate limit.
 */

type Reason = "hiring" | "freelance" | "other";
type ErrorCode = "invalid" | "too_fast" | "send_failed" | "not_configured";

const REASON_LABELS: Record<Reason, string> = {
  hiring: "Hiring",
  freelance: "Freelance project",
  other: "Other"
};

const MIN_FILL_MS = 3000;
/** A startedAt further ahead of the server clock than this did not come from the form. */
const MAX_CLOCK_SKEW_MS = 60_000;
const MAX_LINKS = 3;
const MAX_BODY_BYTES = 32_000;
const RESEND_TIMEOUT_MS = 10_000;

/** Best-effort per-instance limiter (serverless instances are reused, not shared). */
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const recentByIp = new Map<string, number[]>();

const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const LINK_RE = /\bhttps?:\/\/|\bwww\./gi;

const ok = () => NextResponse.json({ ok: true });
const fail = (error: ErrorCode, status: number) => NextResponse.json({ ok: false, error }, { status });

/** Trimmed, length-capped string without control characters; `singleLine` also folds newlines. */
function clean(value: unknown, max: number, singleLine = false): string {
  if (typeof value !== "string") return "";
  let s = value.replace(CONTROL_CHARS, "");
  if (singleLine) s = s.replace(/[\r\n\t]+/g, " ");
  return s.trim().slice(0, max);
}

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const isReason = (v: unknown): v is Reason => v === "hiring" || v === "freelance" || v === "other";

const isFiniteNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

/**
 * How long the visitor spent on the form, or null when the request carries no usable timing (a bot).
 * The browser's monotonic `elapsedMs` is preferred: it does not depend on the visitor's clock. The
 * wall-clock `startedAt` is the fallback; a clock that runs slightly ahead of the server's cannot be
 * measured, so it passes, but a start time far in the future is rejected.
 */
function fillTime(body: Record<string, unknown>, now: number): number | null {
  if (isFiniteNumber(body.elapsedMs) && body.elapsedMs >= 0) return body.elapsedMs;
  if (!isFiniteNumber(body.startedAt) || body.startedAt <= 0) return null;
  const delta = now - body.startedAt;
  if (delta < -MAX_CLOCK_SKEW_MS) return null;
  return delta < 0 ? MIN_FILL_MS : delta;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string, now: number): boolean {
  const recent = (recentByIp.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_MAX) {
    recentByIp.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentByIp.set(ip, recent);
  if (recentByIp.size > 1000) {
    for (const [key, times] of recentByIp) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentByIp.delete(key);
    }
  }
  return false;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) return fail("invalid", 415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return fail("invalid", 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return fail("invalid", 400);
    body = parsed as Record<string, unknown>;
  } catch {
    return fail("invalid", 400);
  }

  const now = Date.now();

  // Honeypot: people never see or fill the hidden "company" field.
  if (clean(body.company, 200)) return ok();

  // Submitted faster than a person can fill the form, or without the timing our form always sends.
  const elapsed = fillTime(body, now);
  if (elapsed === null || elapsed < MIN_FILL_MS) return ok();

  const name = clean(body.name, 120, true);
  const email = clean(body.email, 200, true);
  const message = clean(body.message, 5000);
  const reason = body.reason;

  if (!name || !message || !EMAIL_RE.test(email) || !isReason(reason)) return fail("invalid", 400);

  // Link-stuffed messages are spam.
  if ((message.match(LINK_RE)?.length ?? 0) > MAX_LINKS) return ok();

  if (isRateLimited(clientIp(request), now)) return fail("too_fast", 429);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return fail("not_configured", 503);

  const reasonLabel = REASON_LABELS[reason];
  const html = [
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>About:</strong> ${escapeHtml(reasonLabel)}</p>`,
    `<hr/>`,
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
  ].join("");
  const text = `Name: ${name}\nEmail: ${email}\nAbout: ${reasonLabel}\n\n${message}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
        to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
        reply_to: email,
        subject: `[Portfolio] ${reasonLabel} — ${name}`,
        html,
        text
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS)
    });
    if (!res.ok) {
      console.error(`[contact] Resend responded ${res.status}`);
      return fail("send_failed", 502);
    }
  } catch (error) {
    console.error("[contact] Resend request failed", error);
    return fail("send_failed", 502);
  }

  return ok();
}
