"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { containerStagger, fadeUp } from "@/lib/motion";
import { MagneticButton } from "./MagneticButton";

const HERO_VISUAL = "/images/hero-visual.svg";

type HeroStat = {
  value: string;
  label: string;
};

type Props = {
  eyebrow: string;
  title: string;
  statement: string;
  primaryCta: string;
  secondaryCta: string;
  availability: string;
  responseTime: string;
  headlineTop: string;
  headlineFocus: string;
  headlineBottom: string;
  githubLabel: string;
  cvLabel: string;
  cvFile: string;
  stats: HeroStat[];
};

export function Hero({
  eyebrow,
  title,
  statement,
  primaryCta,
  secondaryCta,
  availability,
  responseTime,
  headlineTop,
  headlineFocus,
  headlineBottom,
  githubLabel,
  cvLabel,
  cvFile,
  stats
}: Props) {
  return (
    <section
      id="hero"
      className="relative mx-auto flex max-w-6xl flex-col items-start px-4 pb-16 pt-8 md:pb-20 md:pt-14 lg:pt-16"
    >
      <motion.div
        initial="hidden"
        animate="show"
        variants={containerStagger}
        className="relative grid w-full items-start gap-10 lg:grid-cols-12 lg:gap-12"
      >
        <div className="lg:col-span-7">
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/[0.04] bg-surface/40 px-3 py-1.5 text-[11px] font-medium tracking-widest text-text/65 dark:border-white/[0.07] dark:bg-surface/25 dark:text-text/60 backdrop-blur"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          {availability}
        </motion.div>

        <motion.p variants={fadeUp} className="section-eyebrow mb-5 text-text/70 dark:text-text/65">
          {eyebrow}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="hero-title mb-3 text-balance font-bold leading-tight tracking-tighter text-text"
          style={{ fontSize: "clamp(1.68rem, 5vw, 4.1rem)" }}
        >
          {title}
        </motion.h1>

        <motion.h2
          variants={fadeUp}
          className="text-balance font-semibold leading-tight tracking-tight"
          style={{ fontSize: "clamp(1.72rem, 5.75vw, 4.65rem)" }}
        >
          <span className="block text-text/90">{headlineTop}</span>
          <span className="block gradient-text">{headlineFocus}</span>
          <span className="block text-text/90">{headlineBottom}</span>
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="hero-statement mt-6 max-w-2xl text-pretty text-[15px] leading-[1.68] text-text/68 md:text-base lg:text-lg"
        >
          {statement}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          {/* Row 1: primary actions */}
          <div className="flex flex-wrap gap-2.5">
            <MagneticButton href="#projects" className="pill pill-cta flex-1 justify-center sm:flex-none">
              {primaryCta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </MagneticButton>
            <a href="#contact" className="pill flex-1 justify-center sm:flex-none">
              {secondaryCta}
            </a>
          </div>
          {/* Row 2: secondary actions */}
          <div className="flex flex-wrap gap-2.5">
            <a href={cvFile} download className="pill text-[13px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
              </svg>
              {cvLabel}
            </a>
            <a href="https://github.com/kyan9400" target="_blank" rel="noreferrer" className="pill text-[13px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.17a10.95 10.95 0 0 1 5.76 0c2.2-1.49 3.16-1.17 3.16-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
              {githubLabel}
            </a>
          </div>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-3 text-[12px] text-muted">
          {responseTime}
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="hero-stats mt-12 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/[0.06] sm:grid-cols-4 dark:border-white/[0.10]"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-card/60 px-4 py-4 text-center">
              <div className="gradient-text-soft text-xl font-semibold tracking-tight">{s.value}</div>
              <div className="mt-0.5 text-[11px] uppercase tracking-widest text-muted/80">{s.label}</div>
            </div>
          ))}
        </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          className="relative mx-auto hidden w-full max-w-[420px] lg:col-span-5 lg:mx-0 lg:block lg:max-w-none"
          aria-hidden="true"
        >
          <div className="relative aspect-[520/600] w-full overflow-hidden rounded-[1.75rem] border border-black/[0.06] shadow-[0_20px_50px_-24px_rgba(15,23,42,0.2)] dark:border-white/[0.08] dark:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.55)]">
            <Image
              src={HERO_VISUAL}
              alt=""
              width={520}
              height={600}
              priority
              className="h-full w-full object-cover"
              sizes="(min-width: 1024px) 38vw, 0px"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
