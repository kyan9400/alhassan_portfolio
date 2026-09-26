"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Code2, Download, MapPin, Server, Sparkles } from "lucide-react";
import { useCopy, useCvDownload } from "@/lib/hooks";
import { GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL } from "@/lib/ui-copy";
import { trackEvent } from "@/lib/analytics";
import { Bidi, Magnetic, GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/primitives";
import { scrollToId } from "@/components/app/SmoothScroll";
import { celebrate } from "@/lib/confetti";
import { usePageScroll } from "@/lib/scroll";

const PORTRAIT = "/images/alhassan.webp";
const RING = "conic-gradient(from 0deg, #8b5cf6, #22d3ee, transparent 40%, #8b5cf6 70%, #f0abfc, #8b5cf6)";

/*
 * Entrance motion for the first-paint content (headline, availability pill, intro, portrait).
 * Transform only, never opacity: these are the LCP candidates, and an element that starts at
 * opacity 0 does not count as painted until it fades in. The globals' .fade-in/.kinetic start at
 * opacity 0, so they are only used for secondary content here. Hoisted and de-duplicated by React.
 */
const HERO_MOTION_CSS = `
@keyframes hero-settle{from{transform:translate3d(0,var(--rise,0.3em),0)}to{transform:none}}
@keyframes hero-pop{from{transform:scale(.94)}to{transform:none}}
.hero-settle{animation:hero-settle .9s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.hero-pop{animation:hero-pop 1.1s cubic-bezier(.22,1,.36,1) both}
@media (prefers-reduced-motion:reduce){.hero-settle,.hero-pop{animation:none}}
`;

const CHIPS = [
  { icon: Code2, label: "React · TypeScript", className: "start-0 top-8", delay: "-1s" },
  { icon: Sparkles, label: "RAG · FAISS", className: "end-0 top-[44%]", delay: "-3s" },
  { icon: Server, label: "Node.js · FastAPI", className: "bottom-6 start-4", delay: "-5s" }
];

function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
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
  const { ui } = copy;
  const cv = useCvDownload();
  const greeting = useGreeting();
  const reduceMotion = useReducedMotion();
  const [portraitClicks, setPortraitClicks] = useState(0);

  const { scrollY } = usePageScroll();
  // Always bound (a conditional style prop would differ between server and client); reduced motion flattens it.
  const parallax = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 80]);
  const cueOpacity = useTransform(scrollY, [0, 240], [1, 0]);

  const onPortrait = () => {
    const n = portraitClicks + 1;
    setPortraitClicks(n);
    if (n % 3 === 0) celebrate();
  };

  const jump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToId(id);
  };

  const iconLink = "flex h-11 w-11 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text";

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-24 sm:pt-28 md:pt-32">
      <style href="hero-motion" precedence="default">
        {HERO_MOTION_CSS}
      </style>

      <div className="shell grid flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          {/* Availability: visible at first paint (transform-only entrance). */}
          <div className="hero-settle mb-6 flex flex-wrap items-center gap-x-3 gap-y-2" style={{ "--rise": "8px" } as React.CSSProperties}>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {copy.heroAvailability}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {copy.contactLocation}
            </span>
          </div>

          {/* Who: greeting, full name and role. The compact avatar replaces the portrait below lg. */}
          <div className="fade-in mb-7 flex items-center gap-4" style={delay(60)}>
            <span className="relative block h-16 w-16 shrink-0 lg:hidden">
              {/* Static on phones: a turning ring re-rasterizes every frame; the desktop portrait's ring turns. */}
              <span className="absolute -inset-[2px] rounded-full" style={{ background: RING }} aria-hidden="true" />
              <Image
                src={PORTRAIT}
                alt=""
                width={64}
                height={64}
                quality={75}
                className="relative h-16 w-16 rounded-full border-2 border-bg bg-surface object-cover"
              />
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted">
                {greeting}{" "}
                <span className="inline-block origin-[70%_70%] animate-wave" aria-hidden="true">
                  👋
                </span>
              </p>
              <p className="mt-0.5 font-display text-xl font-semibold leading-tight tracking-tight text-text sm:text-2xl">{copy.heroTitle}</p>
              <p className="mt-1 text-balance text-sm font-medium text-accent-ink">{copy.heroEyebrow}</p>
            </div>
          </div>

          <h1
            id="hero-title"
            className="text-[clamp(2.5rem,4.8vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.035em] rtl:leading-[1.25] rtl:tracking-normal"
          >
            <span className="hero-settle block text-balance" style={delay(0)}>
              {copy.heroHeadlineTop}
            </span>{" "}
            <span className="hero-settle block text-balance" style={delay(70)}>
              {/* One unit: "AI-системы," must never break at its hyphen. */}
              <span className="gradient-text whitespace-nowrap">{copy.heroHeadlineFocus}</span>
            </span>{" "}
            <span className="hero-settle block text-balance" style={delay(140)}>
              {copy.heroHeadlineBottom}
            </span>
          </h1>

          <p className="hero-settle mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted md:text-lg" style={delay(120)}>
            <Bidi text={ui.heroIntro} />
          </p>

          <p className="fade-in mt-4 flex max-w-xl items-start gap-2 text-sm lg:hidden" style={delay(200)}>
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
            <span>
              <span className="text-muted">{ui.currentlyLabel}:</span> <span className="font-medium">
                <Bidi text={ui.currentlyValue} />
              </span>
            </span>
          </p>

          <div className="fade-in mt-8 flex flex-wrap items-center gap-x-3 gap-y-4" style={delay(220)}>
            <div className="flex flex-wrap items-center gap-3">
              <Magnetic>
                <a href="#projects" onClick={jump("projects")} className="btn-primary group !px-6">
                  {copy.heroPrimaryCta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>
              <Magnetic>
                <a href="#contact" onClick={jump("contact")} className="btn-ghost !px-6">
                  {copy.heroSecondaryCta}
                </a>
              </Magnetic>
            </div>
            {/* On phones this row wraps under the buttons; -ms aligns the CV icon with the content edge. */}
            <div className="-ms-3.5 flex items-center gap-0.5 sm:ms-0 sm:ps-1">
              <a
                href={cv.href}
                download
                onClick={cv.onClick}
                className="inline-flex h-11 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium text-muted transition hover:bg-surface hover:text-text"
                aria-label={copy.contactCvLabel}
                title={copy.contactCvLabel}
              >
                <Download className="h-[18px] w-[18px]" aria-hidden="true" />
                {copy.navCvLabel}
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label={copy.githubLabel} title={copy.githubLabel}>
                <GithubIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label={copy.linkedinLabel} title={copy.linkedinLabel}>
                <LinkedinIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("telegram_click")}
                className={iconLink}
                aria-label={ui.telegramLabel}
                title={ui.telegramLabel}
              >
                <TelegramIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <dl className="fade-in mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t hairline pt-7 sm:grid-cols-4" style={delay(300)}>
            {copy.heroStats.map((s) => (
              // Label first in the DOM (read as "label: value"), value first on screen.
              // justify-end packs a reversed column at the top, so values line up even when a label wraps.
              <div key={s.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-1 text-xs leading-snug text-muted">{s.label}</dt>
                <dd className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Desktop portrait (display: none below lg, where the compact avatar is shown instead). */}
        <motion.div style={{ y: parallax }} className="relative hidden min-w-0 lg:block">
          <div className="hero-pop relative mx-auto aspect-square w-full max-w-[400px]">
            <div
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.35),transparent_68%)]"
              aria-hidden="true"
            />
            {/* The photo is inset so the floating chips overlap its edge but stay inside the column. */}
            <div className="absolute inset-7">
              <div className="absolute -inset-[3px] animate-spin-slow rounded-full" style={{ background: RING }} aria-hidden="true" />
              <div
                onClick={onPortrait}
                data-cursor={ui.cursorHi}
                className="relative h-full w-full cursor-pointer overflow-hidden rounded-full border-4 border-bg bg-surface transition-transform duration-500 hover:scale-[1.02] active:scale-95"
              >
                {/*
                  The desktop LCP element: eager + high priority so the preload scanner fetches it at once.
                  Below lg it is hidden, and the 1px slot makes the browser pick the tiny 16w candidate
                  instead of downloading the full portrait on phones. Explicit dimensions rather than
                  `fill`: a filled image inside a display:none column trips next/image's zero-height check.
                */}
                <Image
                  src={PORTRAIT}
                  alt={copy.heroTitle}
                  width={344}
                  height={344}
                  sizes="(min-width: 1024px) 344px, 1px"
                  // The source is 600px, below the ~688px a 2x screen wants: q90 keeps it as crisp as it gets.
                  quality={90}
                  loading="eager"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {CHIPS.map(({ icon: Icon, label, className, delay: floatDelay }) => (
              <span
                key={label}
                aria-hidden="true"
                className={`card absolute flex animate-float items-center gap-1.5 whitespace-nowrap px-3 py-2 text-xs font-semibold shadow-xl ${className}`}
                style={{ animationDelay: floatDelay }}
              >
                <Icon className="h-3.5 w-3.5 text-accent" />
                {label}
              </span>
            ))}
          </div>

          <div className="card mx-auto mt-6 flex w-fit max-w-full items-start gap-2.5 px-4 py-2.5 text-xs">
            <span className="relative mt-1 flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
            </span>
            <span className="leading-relaxed">
              <span className="text-muted">{ui.currentlyLabel}:</span> <span className="font-medium">
                <Bidi text={ui.currentlyValue} />
              </span>
            </span>
          </div>
        </motion.div>
      </div>

      {/* In normal flow under the content, so it can never overlap the stats. */}
      <motion.button
        type="button"
        style={{ opacity: cueOpacity }}
        onClick={() => scrollToId("about")}
        className="mx-auto mt-10 hidden flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-text md:flex rtl:tracking-normal"
      >
        {ui.heroScroll}
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </motion.button>
    </section>
  );
}
