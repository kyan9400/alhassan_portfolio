"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, ChevronDown, Copy, Download, Loader2, Mail, MapPin, Send } from "lucide-react";
import { useCopy, useCopyEmail } from "@/lib/hooks";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/ui-copy";
import { Bidi, Magnetic, Reveal, GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/primitives";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Footer } from "@/components/app/Footer";
import { celebrate } from "@/lib/confetti";
import { trackEvent } from "@/lib/analytics";

type Reason = "hiring" | "freelance" | "other";
type Status = "idle" | "sending" | "sent" | "error";
type SendError = "invalid" | "too_fast" | "send_failed" | "not_configured" | "network";
type Fields = { name: string; email: string; reason: Reason; message: string; company: string };
type ValidatedField = "name" | "email" | "message";

const REASONS: Reason[] = ["hiring", "freelance", "other"];
const EMPTY: Fields = { name: "", email: "", reason: "hiring", message: "", company: "" };
/** Visual order of the validated fields: the first invalid one gets focus. */
const FIELD_ORDER: ValidatedField[] = ["name", "email", "message"];
/** Same rule as /api/contact, so the server never rejects what the form accepted. */
const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[^\s@<>()[\],;:"]{2,}$/;
const LIMITS = { name: 120, email: 200, message: 5000 } as const;
/** Keep mailto: links well under the ~2000-character limit of some mail clients. */
const MAILTO_BODY_MAX = 1500;

function isSendError(value: unknown): value is SendError {
  return value === "invalid" || value === "too_fast" || value === "send_failed" || value === "not_configured";
}

/** The email address may wrap only at "@", never in the middle of a word. */
function EmailAddress({ email = CONTACT_EMAIL }: { email?: string }) {
  const at = email.indexOf("@");
  return (
    <span dir="ltr" className="break-normal">
      <span className="whitespace-nowrap">{email.slice(0, at)}</span>
      <wbr />
      <span className="whitespace-nowrap">{email.slice(at)}</span>
    </span>
  );
}

export function Contact() {
  const copy = useCopy();
  const ui = copy.ui;
  const copyEmail = useCopyEmail();

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ValidatedField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sendError, setSendError] = useState<SendError | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedTg, setCopiedTg] = useState(false);
  const showToast = usePortfolioStore((st) => st.showToast);
  const contactReason = usePortfolioStore((st) => st.contactReason);
  const setContactReason = usePortfolioStore((st) => st.setContactReason);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const refocusForm = useRef(false);
  // When the form was first shown. Set after mount (not during render) so SSR and hydration agree.
  // The API treats a submit < 3 s after this as a bot. `elapsedMs` comes from the monotonic clock, so a
  // visitor whose system clock is off is never mistaken for one (the server prefers it over startedAt).
  const startedAt = useRef(0);
  const startedPerf = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
    startedPerf.current = performance.now();
  }, []);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  useEffect(() => {
    if (!copiedTg) return;
    const t = window.setTimeout(() => setCopiedTg(false), 2000);
    return () => window.clearTimeout(t);
  }, [copiedTg]);

  // Another section (Services → "Discuss a project") asked for a reason: preselect it once, then clear it.
  useEffect(() => {
    if (!contactReason) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- applying a one-shot request from the store
    setFields((f) => ({ ...f, reason: contactReason }));
    setContactReason(null);
  }, [contactReason, setContactReason]);

  const onCopyTelegram = async () => {
    try {
      await navigator.clipboard.writeText(TELEGRAM_HANDLE);
      setCopiedTg(true);
      trackEvent("telegram_click", { action: "copy" });
    } catch {
      /* clipboard blocked: the toast shows the handle so it can be copied by hand */
    }
    showToast(TELEGRAM_HANDLE);
  };

  // useCopyEmail reports `email_copy` itself (only when the copy succeeds) and toasts the result.
  const onCopyEmail = async () => {
    if (await copyEmail()) setCopied(true);
  };

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setFields((f) => ({ ...f, [key]: value }));
    if (key === "name" || key === "email" || key === "message") {
      setErrors((er) => (er[key] ? { ...er, [key]: undefined } : er));
    }
  };

  const validate = (f: Fields) => {
    const next: Partial<Record<ValidatedField, string>> = {};
    if (!f.name.trim()) next.name = ui.form.required;
    if (!f.email.trim()) next.email = ui.form.required;
    else if (!EMAIL_RE.test(f.email.trim())) next.email = ui.form.invalidEmail;
    if (!f.message.trim()) next.message = ui.form.required;
    return next;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const nextErrors = validate(fields);
    // Commit the errors first so the focused field already carries aria-invalid + its description.
    flushSync(() => setErrors(nextErrors));
    const firstInvalid = FIELD_ORDER.find((k) => nextErrors[k]);
    if (firstInvalid) {
      const target = { name: nameRef, email: emailRef, message: messageRef }[firstInvalid];
      target.current?.focus();
      return;
    }

    setStatus("sending");
    setSendError(null);
    let error: SendError | null = null;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.name.trim(),
          email: fields.email.trim(),
          reason: fields.reason,
          message: fields.message.trim(),
          company: fields.company,
          startedAt: startedAt.current,
          elapsedMs: Math.round(performance.now() - startedPerf.current)
        })
      });
      // Errors come back as JSON with a non-2xx status, so read the body either way.
      const data = (await res.json().catch(() => null)) as { ok?: unknown; error?: unknown } | null;
      if (!(res.ok && data?.ok === true)) error = isSendError(data?.error) ? data.error : "network";
    } catch {
      error = "network";
    }

    if (error) {
      // Keep everything the visitor typed; offer the email route instead. Never auto-open mailto.
      setSendError(error);
      setStatus("error");
      setAttempt((n) => n + 1);
      return;
    }

    trackEvent("contact_submit_success", { reason: fields.reason });
    setStatus("sent");
    setFields(EMPTY);
    setErrors({});
    celebrate();
  };

  const sendAnother = () => {
    refocusForm.current = true;
    setStatus("idle");
  };

  // Move focus into the success panel when it appears (the submit button it replaced is gone).
  const focusOnMount = useCallback((el: HTMLHeadingElement | null) => {
    el?.focus({ preventScroll: true });
  }, []);

  const mailtoHref = (() => {
    const name = fields.name.trim();
    const subject = `[Portfolio] ${ui.form.reasons[fields.reason]}${name ? ` — ${name}` : ""}`;
    let body = fields.message.trim();
    if (body.length > MAILTO_BODY_MAX) body = `${body.slice(0, MAILTO_BODY_MAX)}…`;
    if (name) body += `\n\n— ${name}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  })();

  const describedBy = (key: ValidatedField) => (errors[key] ? `contact-${key}-error` : undefined);
  const fieldClass = (key: ValidatedField) =>
    `field ${errors[key] ? "!border-danger/60 focus:!shadow-[0_0_0_4px_rgb(var(--danger)/0.15)]" : ""}`;
  const errorText = (key: ValidatedField) => (
    // Always rendered (empty when valid) so the live region exists before the message is inserted.
    <p id={`contact-${key}-error`} aria-live="polite" className={`text-xs font-medium text-danger ${errors[key] ? "mt-1.5" : ""}`}>
      {errors[key] ?? ""}
    </p>
  );

  const [available, ...availability] = ui.availabilityLine.split(" · ");
  const sending = status === "sending";

  return (
    <section id="contact" className="section cv-auto pb-10 [--cv-h:1700px] md:[--cv-h:1540px] lg:[--cv-h:1170px]">
      <div className="shell">
        <Reveal className="card relative overflow-hidden p-5 sm:p-10 md:p-14">
          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="min-w-0">
              <p className="eyebrow mb-4">{copy.contactEyebrow}</p>
              <h2 className="text-balance text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.02] rtl:leading-[1.25]">
                {copy.contactTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-accent-ink">{copy.contactTitle.split(" ").slice(-1)}</span>
              </h2>
              <p className="mt-5 max-w-md text-pretty text-muted md:text-lg">
                <Bidi text={copy.contactDescription} />
              </p>

              {/* Telegram first (the real channel), then email: two large rows, each with its own copy button. */}
              <div className="mt-8 max-w-md space-y-3">
                <div className="flex h-16 items-center rounded-2xl border border-line/15 bg-surface transition-colors hover:border-accent/40">
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("telegram_click")}
                    className="flex h-full min-w-0 flex-1 items-center gap-3 rounded-s-2xl ps-4"
                  >
                    <TelegramIcon className="h-6 w-6 shrink-0 text-accent" />
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">{ui.telegramLabel}</span>
                      <span className="block truncate font-display text-base font-semibold sm:text-lg" dir="ltr">
                        {TELEGRAM_HANDLE}
                      </span>
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={onCopyTelegram}
                    className="me-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-card hover:text-text"
                    title={ui.copyTelegram}
                  >
                    {copiedTg ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    <span className="sr-only">{ui.copyTelegram}</span>
                  </button>
                </div>

                <div className="flex h-16 items-center rounded-2xl border border-line/15 transition-colors hover:border-accent/40">
                  <a href={`mailto:${CONTACT_EMAIL}`} className="flex h-full min-w-0 flex-1 items-center gap-3 rounded-s-2xl ps-4">
                    <Mail className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-xs text-muted">{copy.contactEmailLabel}</span>
                      <span className="block text-[15px] font-semibold sm:text-base">
                        <EmailAddress />
                      </span>
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={onCopyEmail}
                    className="me-2.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text"
                    title={ui.copyEmail}
                  >
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    <span className="sr-only">{ui.copyEmail}</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 max-w-md">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{copy.contactCvLabel}</p>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  {copy.cvDownloads.map((cv) => (
                    <a
                      key={cv.code}
                      href={cv.file}
                      download
                      type="application/pdf"
                      hrefLang={cv.code.toLowerCase()}
                      onClick={() => trackEvent("cv_download", { lang: cv.code.toLowerCase() })}
                      className="btn-ghost !min-h-[44px] gap-1.5 !px-2 text-[13px] sm:!px-3"
                    >
                      <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {cv.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {available}
                </span>
                {availability.length ? (
                  // Location and terms in one chip, so neither wraps onto a row of its own.
                  <span className="tag gap-1.5 !rounded-xl !py-1.5 !text-xs">
                    <span className="sr-only"> · </span>
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {availability.join(" · ")}
                  </span>
                ) : null}
              </div>
              {/* The reply-time promise, said once on the page. */}
              <p className="mt-3 text-sm text-muted">{copy.heroResponseTime}</p>

              <p className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 text-muted transition-colors hover:text-text">
                  <LinkedinIcon className="h-4 w-4 shrink-0" /> {copy.linkedinLabel}
                </a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[40px] items-center gap-2 text-muted transition-colors hover:text-text">
                  <GithubIcon className="h-4 w-4 shrink-0" /> {copy.githubLabel}
                </a>
              </p>
            </div>

            <div className="relative flex min-w-0 flex-col">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[420px] flex-1 flex-col items-center justify-center rounded-3xl border border-line/10 bg-surface/40 p-8 text-center"
                    role="status"
                  >
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 text-white shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)]"
                    >
                      <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                    <h3 ref={focusOnMount} tabIndex={-1} className="mt-6 text-2xl font-semibold outline-none">
                      {ui.form.successTitle}
                    </h3>
                    <p className="mt-2 max-w-xs text-muted">{ui.form.successBody}</p>
                    <button type="button" onClick={sendAnother} className="btn-ghost mt-8">
                      {ui.form.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onAnimationComplete={() => {
                      if (!refocusForm.current) return;
                      refocusForm.current = false;
                      nameRef.current?.focus({ preventScroll: true });
                    }}
                    onSubmit={onSubmit}
                    noValidate
                    aria-busy={sending}
                    className="relative flex flex-1 flex-col gap-4"
                  >
                    <h3 className="font-display text-xl font-semibold">{copy.contactFormTitle}</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium text-muted">
                          {copy.contactFormName}
                        </label>
                        <input
                          ref={nameRef}
                          id="contact-name"
                          name="name"
                          dir={fields.name ? "auto" : undefined}
                          autoComplete="name"
                          maxLength={LIMITS.name}
                          value={fields.name}
                          onChange={update("name")}
                          className={fieldClass("name")}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={describedBy("name")}
                        />
                        {errorText("name")}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-muted">
                          {copy.contactFormEmail}
                        </label>
                        <input
                          ref={emailRef}
                          id="contact-email"
                          name="email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          dir="ltr"
                          maxLength={LIMITS.email}
                          value={fields.email}
                          onChange={update("email")}
                          className={`${fieldClass("email")} rtl:text-right`}
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={describedBy("email")}
                        />
                        {errorText("email")}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-reason" className="mb-1.5 block text-xs font-medium text-muted">
                        {ui.form.reasonLabel}
                      </label>
                      <div className="relative">
                        <select
                          id="contact-reason"
                          name="reason"
                          value={fields.reason}
                          onChange={update("reason")}
                          className="field cursor-pointer appearance-none pe-11"
                        >
                          {REASONS.map((r) => (
                            <option key={r} value={r}>
                              {ui.form.reasons[r]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col">
                      <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium text-muted">
                        {copy.contactFormMessage}
                      </label>
                      <textarea
                        ref={messageRef}
                        id="contact-message"
                        name="message"
                        // Typed text follows its own script (English in the Arabic UI); empty keeps the page direction for the placeholder.
                        dir={fields.message ? "auto" : undefined}
                        rows={6}
                        maxLength={LIMITS.message}
                        placeholder={ui.form.messagePlaceholder}
                        value={fields.message}
                        onChange={update("message")}
                        className={`${fieldClass("message")} min-h-[9rem] flex-1 resize-none`}
                        aria-invalid={Boolean(errors.message)}
                        aria-describedby={describedBy("message")}
                      />
                      {errorText("message")}
                    </div>

                    {/* Honeypot: display:none, so people (and browser autofill) never fill it; naive bots do. */}
                    <div hidden aria-hidden="true">
                      <label htmlFor="contact-company">Company</label>
                      <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" value={fields.company} onChange={update("company")} />
                    </div>

                    {status === "error" && sendError ? (
                      <div key={attempt} role="alert" className="alert-error space-y-3">
                        <p className="flex gap-2 font-medium">
                          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{sendError === "too_fast" ? ui.form.tooFast : ui.form.error}</span>
                        </p>
                        <div className="flex flex-wrap items-center gap-2 ps-6">
                          <span className="me-1 font-semibold text-text">
                            <EmailAddress />
                          </span>
                          <button
                            type="button"
                            onClick={onCopyEmail}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-danger/30 px-3 text-xs font-semibold transition hover:bg-danger/10"
                          >
                            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
                            {ui.copyEmail}
                          </button>
                          <a
                            href={mailtoHref}
                            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-danger/30 px-3 text-xs font-semibold transition hover:bg-danger/10"
                          >
                            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                            {ui.form.openMailApp}
                          </a>
                        </div>
                      </div>
                    ) : null}

                    {/* Magnetic wraps in an inline-flex span: stretch it so the button is full-width on phones. */}
                    <div className="[&>span]:w-full sm:[&>span]:w-auto">
                      <Magnetic strength={0.15}>
                        <button
                          type="submit"
                          disabled={sending}
                          className="btn-primary group w-full !min-h-[52px] text-[15px] disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:!px-8"
                        >
                          {sending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                              {ui.form.sending}
                            </>
                          ) : (
                            <>
                              {copy.contactFormSend}
                              <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </Magnetic>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Footer className="mt-12 sm:mt-16" />
      </div>
    </section>
  );
}
