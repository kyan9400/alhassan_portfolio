"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { useCopy, useCvFile } from "@/lib/hooks";
import { GITHUB_URL, LINKEDIN_URL } from "@/lib/ui-copy";
import { Magnetic, GithubIcon, LinkedinIcon } from "@/components/ui/primitives";
import { scrollToId } from "@/components/app/SmoothScroll";
import { celebrate } from "@/lib/confetti";

function Kinetic({ text, className, offset = 0 }: { text: string; className?: string; offset?: number }) {
  return (
    <span className="kinetic">
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ "--i": i + offset } as React.CSSProperties}>
          <span className={className}>{word}</span>&nbsp;
        </span>
      ))}
    </span>
  );
}

function useGreeting() {
  const copy = useCopy();
  const [hour, setHour] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- time of day is only known on the client
    setHour(new Date().getHours());
  }, []);
  const g = copy.ui.greeting;
  if (hour === null) return g.afternoon;
  if (hour < 5) return g.night;
  if (hour < 12) return g.morning;
  if (hour < 18) return g.afternoon;
  return g.evening;
}

export function Hero() {
  const copy = useCopy();
  const cvFile = useCvFile();
  const greeting = useGreeting();
  const [avatarClicks, setAvatarClicks] = useState(0);

  const { scrollY } = useScroll();
  const portraitY = useTransform(scrollY, [0, 600], [0, 80]);
  const fadeOut = useTransform(scrollY, [0, 500], [1, 0]);

  const topWords = copy.heroHeadlineTop.split(" ").length;
  const focusWords = copy.heroHeadlineFocus.split(" ").length;

  const onAvatar = () => {
    const n = avatarClicks + 1;
    setAvatarClicks(n);
    if (n % 3 === 0) celebrate();
  };

  return (
    <section id="hero" className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 md:pt-32">
      <div className="shell grid items-center gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
        <div>
          <div className="fade-in mb-7 flex flex-wrap items-center gap-2.5" style={{ "--d": "0ms" } as React.CSSProperties}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {copy.heroAvailability}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {copy.contactLocation}
            </span>
          </div>

          <p className="fade-in mb-4 font-display text-lg text-muted md:text-xl" style={{ "--d": "80ms" } as React.CSSProperties}>
            {greeting}{" "}
            <span className="inline-block origin-[70%_70%] animate-wave" aria-hidden="true">
              👋
            </span>
          </p>

          <h1 className="text-balance text-[clamp(2.5rem,5.6vw,5rem)] font-semibold leading-[0.98]">
            <Kinetic text={copy.heroHeadlineTop} />
            <br />
            <Kinetic text={copy.heroHeadlineFocus} offset={topWords} className="gradient-text" />
            <br />
            <Kinetic text={copy.heroHeadlineBottom} offset={topWords + focusWords} />
          </h1>

          <p
            className="fade-in mt-7 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg"
            style={{ "--d": "650ms" } as React.CSSProperties}
          >
            {copy.ui.heroIntro}
          </p>

          <div className="fade-in mt-9 flex flex-wrap items-center gap-3" style={{ "--d": "780ms" } as React.CSSProperties}>
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("projects");
                }}
                className="btn-primary group !px-6"
              >
                {copy.heroPrimaryCta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId("contact");
                }}
                className="btn-ghost !px-6"
              >
                {copy.heroSecondaryCta}
              </a>
            </Magnetic>
            <div className="flex items-center gap-1 ps-1">
              <a href={cvFile} download className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text" aria-label={copy.contactCvLabel} title={copy.contactCvLabel}>
                <Download className="h-[18px] w-[18px]" />
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text" aria-label={copy.githubLabel}>
                <GithubIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text" aria-label={copy.linkedinLabel}>
                <LinkedinIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <dl className="fade-in mt-14 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4" style={{ "--d": "900ms" } as React.CSSProperties}>
            {copy.heroStats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-3xl font-semibold tracking-tight">{s.value}</dd>
                <dd className="mt-1 text-xs text-muted">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <motion.div style={{ y: portraitY }} className="fade-in relative mx-auto w-full max-w-[340px] lg:max-w-[400px]">
          <div className="relative aspect-square" style={{ "--d": "300ms" } as React.CSSProperties}>
            <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.35),transparent_65%)] blur-2xl" aria-hidden="true" />
            <div
              className="absolute -inset-[3px] animate-spin-slow rounded-full"
              style={{ background: "conic-gradient(from 0deg, #8b5cf6, #22d3ee, transparent 40%, #8b5cf6 70%, #f0abfc, #8b5cf6)" }}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={onAvatar}
              data-cursor="Hi!"
              className="relative block h-full w-full overflow-hidden rounded-full border-4 border-bg bg-surface transition-transform duration-500 hover:scale-[1.02] active:scale-95"
              aria-label={copy.heroTitle}
            >
              <Image src="/images/alhassan.webp" alt={copy.heroTitle} fill priority sizes="(min-width: 1024px) 400px, 340px" quality={90} className="object-cover" />
            </button>

            <span className="card absolute -start-4 top-10 animate-float px-3 py-2 text-xs font-semibold shadow-xl sm:-start-10" style={{ animationDelay: "-1s" }}>
              ⚡ Next.js · React
            </span>
            <span className="card absolute -end-2 top-1/2 animate-float px-3 py-2 text-xs font-semibold shadow-xl sm:-end-8" style={{ animationDelay: "-3s" }}>
              🤖 AI · RAG
            </span>
            <span className="card absolute bottom-6 start-2 animate-float px-3 py-2 text-xs font-semibold shadow-xl" style={{ animationDelay: "-5s" }}>
              🚀 CI/CD · Docker
            </span>
          </div>

          <div className="card mx-auto mt-8 flex w-fit items-center gap-2 px-4 py-2 text-xs">
            <span className="text-muted">{copy.ui.currentlyLabel}:</span>
            <span className="font-medium">{copy.ui.currentlyValue}</span>
          </div>
        </motion.div>
      </div>

      <motion.button
        type="button"
        style={{ opacity: fadeOut }}
        onClick={() => scrollToId("about")}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted md:flex"
      >
        {copy.ui.heroScroll}
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </motion.button>
    </section>
  );
}
