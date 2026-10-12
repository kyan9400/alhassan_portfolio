"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight, Download, MapPin } from "lucide-react";
import { useCopy, useCvDownload } from "@/lib/hooks";
import { GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";
import { Bidi, Magnetic, GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/primitives";
import { scrollToId } from "@/components/app/SmoothScroll";
import { celebrate } from "@/lib/confetti";
import { subscribe } from "@/lib/scroll";

const PORTRAIT = "/images/alhassan.webp";

/*
 * Entrance motion for the first-paint content (headline, identity row, intro, portrait).
 * Transform only, never opacity: these are the LCP candidates, and an element that starts at
 * opacity 0 does not count as painted until it fades in. The globals' .fade-in/.kinetic start at
 * opacity 0, so they are only used for secondary content here. Hoisted and de-duplicated by React.
 */
const HERO_MOTION_CSS = `
@keyframes hero-settle{from{transform:translate3d(0,var(--rise,0.3em),0)}to{transform:none}}
@keyframes hero-pop{from{transform:scale(.96)}to{transform:none}}
.hero-settle{animation:hero-settle .9s cubic-bezier(.22,1,.36,1) both;animation-delay:var(--d,0ms)}
.hero-pop{animation:hero-pop 1.1s cubic-bezier(.22,1,.36,1) both}
@media (prefers-reduced-motion:reduce){.hero-settle,.hero-pop{animation:none}}
`;

function delay(ms: number) {
  return { "--d": `${ms}ms` } as React.CSSProperties;
}

export function Hero() {
  const copy = useCopy();
  const { ui } = copy;
  const cv = useCvDownload();
  const [portraitClicks, setPortraitClicks] = useState(0);
  const portraitRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLButtonElement>(null);

  // Portrait parallax and scroll-cue fade: one shared, rAF-batched scroll listener writing styles
  // straight to the elements (no React state per frame). Reduced motion keeps the portrait still.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Last written values: past the hero nothing changes, so the rest of the page scrolls with no style writes.
    let lastShift = -1;
    let lastCue = -1;
    return subscribe(() => {
      const y = Math.max(window.scrollY, 0);
      const portrait = portraitRef.current;
      const cue = cueRef.current;
      const shift = reduce.matches ? 0 : (Math.min(y, 600) / 600) * 80;
      if (portrait && shift !== lastShift) {
        portrait.style.transform = shift ? `translate3d(0,${shift}px,0)` : "";
        lastShift = shift;
      }
      const cueOpacity = 1 - Math.min(y, 240) / 240;
      if (cue && cueOpacity !== lastCue) {
        cue.style.opacity = String(cueOpacity);
        lastCue = cueOpacity;
      }
    });
  }, []);

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
    <section id="hero" aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-hidden pb-8 pt-20 sm:pt-28 md:pt-32">
      <style href="hero-motion" precedence="default">
        {HERO_MOTION_CSS}
      </style>

      <div className="shell grid flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.5fr)] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          {/*
            Identity first: who (avatar on phones, name, role), then status and location — on the end
            side of the same row on desktop, under it on phones. Visible at first paint (transform only).
          */}
          <div
            className="hero-settle mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4"
            style={{ "--rise": "8px" } as React.CSSProperties}
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="relative block h-[88px] w-[88px] shrink-0 rounded-full p-[3px] ring-1 ring-line/20 lg:hidden">
                <Image
                  src={PORTRAIT}
                  alt=""
                  width={82}
                  height={82}
                  quality={75}
                  className="h-full w-full rounded-full bg-surface object-cover"
                />
              </span>
              <div className="min-w-0">
                <p className="font-display text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] text-text sm:text-[34px] [html[lang=ru]_&]:tracking-[-0.015em] rtl:tracking-normal">
                  {copy.heroTitle}
                </p>
                <p className="mt-1 text-balance text-[15px] font-medium leading-snug text-accent-ink">
                  {copy.heroEyebrowShort ? (
                    <>
                      {/* Phones: the short role keeps name + role within three lines (the headline below names the focus). */}
                      <span className="max-sm:hidden">
                        <Bidi text={copy.heroEyebrow} />
                      </span>
                      <span className="whitespace-nowrap text-[14px] sm:hidden">
                        <Bidi text={copy.heroEyebrowShort} />
                      </span>
                    </>
                  ) : (
                    <Bidi text={copy.heroEyebrow} />
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-col lg:items-end">
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
          </div>

          <h1
            id="hero-title"
            className="text-display font-semibold max-[359px]:text-[2.25rem] [html[lang=ru]_&]:tracking-[-0.015em] rtl:leading-[1.25] rtl:tracking-normal"
          >
            <span className="hero-settle block text-balance" style={delay(0)}>
              {copy.heroHeadlineTop}
            </span>{" "}
            <span className="hero-settle block text-balance" style={delay(70)}>
              {/* One unit: "AI-поиск" must never break at its hyphen. The page's one accent phrase. */}
              <span className="accent-mark whitespace-nowrap">{copy.heroHeadlineFocus}</span>
            </span>{" "}
            <span className="hero-settle block text-balance" style={delay(140)}>
              {copy.heroHeadlineBottom}
            </span>
          </h1>

          <p className="hero-settle mt-6 max-w-xl text-pretty text-lead text-muted" style={delay(120)}>
            <Bidi text={ui.heroIntro} />
          </p>

          <p className="fade-in mt-4 flex max-w-xl items-start gap-2 text-sm lg:hidden" style={delay(200)}>
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>
              <span className="text-muted">{ui.currentlyLabel}:</span> <span className="font-medium">
                <Bidi text={ui.currentlyValue} />
              </span>
            </span>
          </p>

          <div className="fade-in mt-7 flex flex-wrap items-center gap-x-3 gap-y-4 md:mt-8" style={delay(220)}>
            {/* Phones: two equal buttons on one row (narrower padding), so the stats stay in the first screen. */}
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3 [&>span>a]:w-full sm:[&>span>a]:w-auto">
              <Magnetic>
                <a href="#projects" onClick={jump("projects")} className="btn-primary group !px-3 max-sm:text-[13px] sm:!px-6">
                  {copy.heroPrimaryCta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                    aria-hidden="true"
                  />
                </a>
              </Magnetic>
              <Magnetic>
                {/* The CV in the visitor's language, as a download. */}
                <a href={cv.href} download type="application/pdf" onClick={cv.onClick} className="btn-ghost !px-3 max-sm:text-[13px] sm:!px-6">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {copy.heroSecondaryCta}
                </a>
              </Magnetic>
            </div>
            {/* Phones reach these through the contact bar and the Contact section, so the stats stay in the first screen. */}
            <div className="hidden items-center gap-0.5 sm:flex sm:ps-1">
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

          <dl
            className="fade-in mt-7 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t hairline pt-6 sm:grid-cols-4 md:mt-10 md:pt-7"
            style={delay(300)}
          >
            {copy.heroStats.map((s, i) => (
              // Label first in the DOM (read as "label: value"), value first on screen.
              // justify-end packs a reversed column at the top, so values line up even when a label wraps.
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-end ${i === 0 ? "ps-0" : "border-s hairline ps-4"} ${i === 2 ? "max-sm:border-s-0 max-sm:ps-0" : ""}`}
              >
                <dt className="mt-1 text-xs leading-snug text-muted">
                  <Bidi text={s.label} />
                </dt>
                <dd
                  className={`font-display text-2xl font-semibold tabular-nums tracking-tight sm:text-4xl ${i === 0 ? "text-accent-ink" : ""}`}
                >
                  <bdi>{s.value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Desktop portrait (display: none below lg, where the compact avatar is shown instead). */}
        <div ref={portraitRef} className="relative hidden min-w-0 will-change-transform lg:block">
          <div className="hero-pop relative mx-auto aspect-square w-full max-w-[360px]">
            {/* A still 1px hairline frame, a few pixels off the photo. */}
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-line/20" aria-hidden="true" />
            {/* Easter egg (confetti every third click): a real button, so keyboards can find it too. */}
            <button
              type="button"
              onClick={onPortrait}
              aria-label={copy.heroTitle}
              data-cursor={ui.cursorHi}
              className="absolute inset-[6px] cursor-pointer overflow-hidden rounded-[1.75rem] bg-surface transition-transform duration-500 hover:scale-[1.015] active:scale-95"
            >
              {/*
                The desktop LCP element: eager + high priority so the preload scanner fetches it at once.
                Below lg it is hidden, and the 1px slot makes the browser pick the tiny 16w candidate
                instead of downloading the full portrait on phones. Explicit dimensions rather than
                `fill`: a filled image inside a display:none column trips next/image's zero-height check.
              */}
              <Image
                src={PORTRAIT}
                alt=""
                width={348}
                height={348}
                sizes="(min-width: 1024px) 348px, 1px"
                // The source is 600px, below the ~696px a 2x screen wants: q90 keeps it as crisp as it gets.
                quality={90}
                loading="eager"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
            </button>
          </div>

          <div className="mx-auto mt-7 flex w-fit max-w-full items-start gap-2.5 rounded-full border hairline px-4 py-2.5 text-xs">
            <span className="relative mt-1 flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="leading-relaxed">
              <span className="text-muted">{ui.currentlyLabel}:</span> <span className="font-medium">
                <Bidi text={ui.currentlyValue} />
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* In normal flow under the content, so it can never overlap the stats. */}
      <button
        ref={cueRef}
        type="button"
        onClick={() => scrollToId("about")}
        className="mx-auto mt-10 hidden flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-text md:flex rtl:tracking-normal"
      >
        {ui.heroScroll}
        <ArrowDown className="h-4 w-4 animate-bounce" aria-hidden="true" />
      </button>
    </section>
  );
}
