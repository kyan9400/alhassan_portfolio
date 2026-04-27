"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";

type CvDownload = { code: string; file: string; label: string };

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  emailLabel: string;
  cvLabel: string;
  cvDownloads: CvDownload[];
  githubLabel: string;
  linkedinLabel: string;
  footerBuiltWith: string;
  heroName: string;
  responseTime: string;
  location: string;
  availableText: string;
  formTitle: string;
  formName: string;
  formEmail: string;
  formProjectType: string;
  formMessage: string;
  formSend: string;
};

export function ContactSection({
  eyebrow,
  title,
  description,
  emailLabel,
  cvLabel,
  cvDownloads,
  githubLabel,
  linkedinLabel,
  footerBuiltWith,
  heroName,
  responseTime,
  location,
  availableText,
  formTitle,
  formName,
  formEmail,
  formProjectType,
  formMessage,
  formSend
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio] ${projectType || "Project inquiry"}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nProject type: ${projectType}\n\n${message}`);
    window.location.href = `mailto:kyan775909@gmail.com?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="glass relative overflow-hidden p-6 sm:p-8 md:p-10"
      >
        <div className="pointer-events-none !absolute -right-20 -top-20 z-0 h-56 w-56 rounded-full bg-indigo-500/12 blur-3xl md:h-64 md:w-64" />
        <div className="pointer-events-none !absolute -left-16 bottom-0 z-0 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl md:h-56 md:w-56" />

        <div className="relative z-[1] grid gap-8 md:grid-cols-2 md:gap-10">
          {/* Left: info + socials + CV */}
          <div>
            <SectionHeader spacing="compact" eyebrow={eyebrow} title={title} description={description} />

            {/* Availability + location */}
            <div className="mb-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[12px] font-medium text-emerald-700/90 dark:border-emerald-400/18 dark:bg-emerald-400/[0.06] dark:text-emerald-300/85">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {availableText}
              </div>
              <div className="flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-surface/30 px-3 py-1.5 text-[12px] text-muted dark:border-white/[0.08] dark:bg-surface/10">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {location}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="mailto:kyan775909@gmail.com" className="pill pill-cta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
                {emailLabel}
              </a>
              <a href="https://github.com/kyan9400" target="_blank" rel="noreferrer" className="pill">
                {githubLabel}
              </a>
              <a href="https://www.linkedin.com/in/alhassan-alfarran-880b00246/" target="_blank" rel="noreferrer" className="pill">
                {linkedinLabel}
              </a>
            </div>
            <p className="mt-3 text-[12px] text-muted">{responseTime}</p>

            {/* CV downloads */}
            <div className="mt-6 rounded-2xl border border-black/[0.06] bg-surface/35 p-4 shadow-sm backdrop-blur-sm dark:border-white/[0.10] dark:bg-surface/20">
              <p className="section-eyebrow mb-3">{cvLabel}</p>
              <div className="grid grid-cols-3 gap-2">
                {cvDownloads.map((cv) => (
                  <a
                    key={cv.code}
                    href={cv.file}
                    download
                    className="group flex min-h-[5.5rem] flex-col items-center justify-center gap-1 rounded-xl border border-black/[0.06] bg-card/60 px-2 py-3.5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-400/35 hover:bg-surface/55 dark:border-white/[0.10] dark:bg-card/40 dark:hover:bg-surface/30"
                  >
                    <span className="text-xs font-bold tracking-widest text-indigo-600 dark:text-indigo-200">{cv.code}</span>
                    <span className="text-[11px] text-muted">{cv.label}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 text-muted transition group-hover:translate-y-0.5 group-hover:text-text" aria-hidden="true">
                      <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div>
            <p className="section-eyebrow mb-4">{formTitle}</p>
            {/* TODO: wire up to a real email service (e.g. Resend, Formspree) for server-side delivery. Currently uses mailto: fallback. */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                    {formName}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.07] bg-card/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/[0.09] dark:bg-card/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                    {formEmail}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-black/[0.07] bg-card/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/[0.09] dark:bg-card/30"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                  {formProjectType}
                </label>
                <input
                  type="text"
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.07] bg-card/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/[0.09] dark:bg-card/30"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                  {formMessage}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-none rounded-xl border border-black/[0.07] bg-card/60 px-3.5 py-2.5 text-sm text-text placeholder:text-muted/50 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/[0.09] dark:bg-card/30"
                />
              </div>
              <button
                type="submit"
                className="pill pill-cta w-full justify-center py-2.5 text-sm font-semibold"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z" />
                </svg>
                {formSend}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-black/[0.04] pt-6 text-xs text-muted dark:border-white/[0.07] sm:flex-row">
        <span>© {new Date().getFullYear()} {heroName}</span>
        <span>{footerBuiltWith}</span>
      </div>
    </section>
  );
}
