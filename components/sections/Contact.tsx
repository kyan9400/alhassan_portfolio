"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Download, Loader2, MapPin, Send } from "lucide-react";
import { useCopy, useCopyEmail } from "@/lib/hooks";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/ui-copy";
import { Magnetic, Reveal, GithubIcon, LinkedinIcon } from "@/components/ui/primitives";
import { celebrate } from "@/lib/confetti";

type Status = "idle" | "sending" | "sent" | "error";
type Fields = { name: string; email: string; projectType: string; message: string; company: string };

const EMPTY: Fields = { name: "", email: "", projectType: "", message: "", company: "" };

export function Contact() {
  const copy = useCopy();
  const copyEmail = useCopyEmail();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!fields.name.trim()) next.name = copy.ui.form.required;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = copy.ui.form.invalidEmail;
    if (!fields.message.trim()) next.message = copy.ui.form.required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const openMailto = () => {
    const subject = encodeURIComponent(`[Portfolio] ${fields.projectType || "Project inquiry"}`);
    const body = encodeURIComponent(`Name: ${fields.name}\nEmail: ${fields.email}\nProject type: ${fields.projectType}\n\n${fields.message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields)
      });
      const data = (await res.json()) as { ok: boolean; fallback?: boolean };
      if (data.ok) {
        setStatus("sent");
        setFields(EMPTY);
        celebrate();
      } else if (data.fallback) {
        setStatus("idle");
        openMailto();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-xs text-rose-500">
        {errors[key]}
      </p>
    ) : null;

  return (
    <section id="contact" className="section pb-10">
      <div className="shell">
        <Reveal className="card relative overflow-hidden p-6 sm:p-10 md:p-14">
          <div className="pointer-events-none absolute -end-32 -top-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-32 -start-32 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden="true" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow mb-4">{copy.contactEyebrow}</p>
              <h2 className="text-balance text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.02]">
                {copy.contactTitle.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="gradient-text">{copy.contactTitle.split(" ").slice(-1)}</span>
              </h2>
              <p className="mt-5 max-w-md text-muted md:text-lg">{copy.contactDescription}</p>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                  {copy.contactAvailableText}
                </span>
                <span className="tag gap-1.5">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.contactLocation}
                </span>
              </div>

              <button
                type="button"
                onClick={copyEmail}
                className="group mt-10 flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border hairline bg-surface/50 p-4 text-start transition hover:border-accent/40"
              >
                <span>
                  <span className="block text-xs text-muted">{copy.contactEmailLabel}</span>
                  <span className="mt-0.5 block break-all font-display text-lg font-medium sm:text-xl" dir="ltr">
                    {CONTACT_EMAIL}
                  </span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition group-hover:scale-110" title={copy.ui.copyEmail}>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">{copy.ui.copyEmail}</span>
                </span>
              </button>

              <div className="mt-4 flex flex-wrap gap-2">
                <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                  <GithubIcon /> {copy.githubLabel}
                </a>
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn-ghost">
                  <LinkedinIcon /> {copy.linkedinLabel}
                </a>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{copy.contactCvLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {copy.cvDownloads.map((cv) => (
                    <a key={cv.code} href={cv.file} download className="btn-ghost !min-h-[40px] text-[13px]">
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      {cv.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-xs text-muted">{copy.heroResponseTime}</p>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-3xl border hairline bg-surface/40 p-8 text-center"
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
                    <h3 className="mt-6 text-2xl font-semibold">{copy.ui.form.successTitle}</h3>
                    <p className="mt-2 max-w-xs text-muted">{copy.ui.form.successBody}</p>
                    <button type="button" onClick={() => setStatus("idle")} className="btn-ghost mt-8">
                      {copy.ui.form.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate className="space-y-4">
                    <p className="font-display text-xl font-semibold">{copy.contactFormTitle}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted">{copy.contactFormName}</label>
                        <input id="name" autoComplete="name" value={fields.name} onChange={set("name")} className="field" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
                        {fieldError("name")}
                      </div>
                      <div>
                        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">{copy.contactFormEmail}</label>
                        <input id="email" type="email" autoComplete="email" dir="ltr" value={fields.email} onChange={set("email")} className="field" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
                        {fieldError("email")}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="projectType" className="mb-1.5 block text-xs font-medium text-muted">{copy.contactFormProjectType}</label>
                      <input id="projectType" value={fields.projectType} onChange={set("projectType")} className="field" />
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted">{copy.contactFormMessage}</label>
                      <textarea id="message" rows={6} value={fields.message} onChange={set("message")} className="field resize-none" aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
                      {fieldError("message")}
                    </div>
                    {/* Honeypot for bots */}
                    <input type="text" name="company" value={fields.company} onChange={set("company")} tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                    {status === "error" ? (
                      <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300" role="alert">
                        {copy.ui.form.error}{" "}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
                          {CONTACT_EMAIL}
                        </a>
                      </p>
                    ) : null}

                    <Magnetic strength={0.15}>
                      <button type="submit" disabled={status === "sending"} className="btn-primary group w-full !min-h-[52px] text-[15px] disabled:opacity-70 sm:w-auto sm:!px-8">
                        {status === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            {copy.ui.form.sending}
                          </>
                        ) : (
                          <>
                            {copy.contactFormSend}
                            <Send className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>

        <Footer />
      </div>
    </section>
  );
}

function Footer() {
  const copy = useCopy();
  const [time] = useState(() => new Date());
  const moscow = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(time);

  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t hairline pt-8 text-sm text-muted md:flex-row">
      <div className="text-center md:text-start">
        <p className="font-display text-base font-semibold text-text">
          {copy.heroTitle}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-1 text-xs">
          © {time.getFullYear()} · {copy.ui.footerTagline} {copy.footerBuiltWith}.
        </p>
      </div>
      <p className="text-xs" suppressHydrationWarning>
        {copy.ui.footerLocalTime}: <span className="font-medium text-text" suppressHydrationWarning>{moscow}</span> (Moscow)
      </p>
      <button
        type="button"
        onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
        className="btn-ghost !min-h-[40px] text-[13px]"
      >
        {copy.ui.footerBackToTop}
        <ArrowUpRight className="h-4 w-4 -rotate-45" aria-hidden="true" />
      </button>
    </footer>
  );
}
