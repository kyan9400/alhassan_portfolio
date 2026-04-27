"use client";

import { motion } from "framer-motion";
import { MagneticButton } from "./MagneticButton";

type Props = {
  title: string;
  body: string;
  btnContact: string;
  btnCv: string;
  btnProjects: string;
  cvFile: string;
  variant?: "hero" | "pre-contact";
};

export function AvailableCta({
  title,
  body,
  btnContact,
  btnCv,
  btnProjects,
  cvFile,
  variant = "hero"
}: Props) {
  const isHero = variant === "hero";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`mx-auto max-w-6xl px-4 ${isHero ? "pb-4 pt-2" : "py-10"}`}
    >
      <div className="flex flex-col gap-4 rounded-2xl border border-indigo-500/15 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-violet-500/[0.04] p-4 backdrop-blur-sm dark:border-indigo-400/12 dark:from-indigo-500/[0.08] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3">
          <span className="relative mt-1 flex h-2 w-2 flex-shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-snug text-text">{title}</p>
            <p className="mt-0.5 text-[13px] leading-relaxed text-text/60">{body}</p>
          </div>
        </div>

        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
          <MagneticButton href="#contact" className="pill pill-cta flex-1 justify-center py-2 text-[12px] sm:flex-none">
            {btnContact}
          </MagneticButton>
          <a href={cvFile} download className="pill flex-1 justify-center py-2 text-[12px] sm:flex-none">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            {btnCv}
          </a>
          <a href="#projects" className="pill flex-1 justify-center py-2 text-[12px] sm:flex-none">
            {btnProjects}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
