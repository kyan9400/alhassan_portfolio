"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useLocale } from "@/lib/hooks";
import type { OrgMark as OrgMarkData } from "@/lib/copy";

/**
 * A run of Latin letters/digits (tech names, versions, paths such as `/inbox/{channel}`) inside
 * right-to-left text. It must start and end on a "strong" character so sentence punctuation and
 * brackets around it stay in the Arabic flow; brackets are resolved by the surrounding context.
 */
const LTR_RUN = /\/?[A-Za-z0-9](?:[A-Za-z0-9 .,:;+\-_/#&@{}'’%=~*]*[A-Za-z0-9+#%}])?/g;

/**
 * Latin runs up to this length never wrap inside Arabic text. A line break inside a run (at a
 * hyphen or space) makes browsers reorder its halves visually ("-Full / Stack", "FAISS +)").
 * Longer runs may still wrap, so they can never overflow a narrow column.
 */
const NOWRAP_MAX = 32;

/**
 * Renders `text`, wrapping each Latin run in <bdi> when the page is Arabic, so names like
 * "Node.js / Express" or "HMAC-SHA-256" never get reordered by the RTL paragraph around them.
 * Other locales render the plain string.
 */
export function Bidi({ text }: { text: string }) {
  const rtl = useLocale() === "ar";
  if (!rtl) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LTR_RUN)) {
    const start = match.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    parts.push(
      <bdi key={start} className={match[0].length <= NOWRAP_MAX ? "whitespace-nowrap" : undefined}>
        {match[0]}
      </bdi>
    );
    last = start + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/*
 * Scroll reveal without a motion component per element: one shared IntersectionObserver flips
 * data-reveal="shown", and CSS (globals.css, "Scroll reveal") runs the transition. Elements are only
 * hidden while JS is available (html.js is set before first paint), and reduced motion shows them as is.
 */
let revealObserver: IntersectionObserver | null = null;

function observeReveal(el: Element): () => void {
  if (typeof IntersectionObserver === "undefined") {
    el.setAttribute("data-reveal", "shown");
    return () => {};
  }
  revealObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-reveal", "shown");
        revealObserver?.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  revealObserver.observe(el);
  return () => revealObserver?.unobserve(el);
}

/** Fades + lifts children into view once. Small travel so nothing feels jumpy. `delay` is in seconds. */
export function Reveal({
  delay = 0,
  y = 24,
  as = "div",
  className,
  style,
  children,
  ...rest
}: { delay?: number; y?: number; as?: "div" | "li" } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    return el ? observeReveal(el) : undefined;
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={{ ...style, "--reveal-delay": `${delay}s`, "--reveal-y": `${y}px` } as React.CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start"
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal className={`mb-8 max-w-3xl sm:mb-10 md:mb-12 ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05] rtl:leading-[1.25]">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">{description}</p> : null}
    </Reveal>
  );
}

/** Pulls its child toward the pointer — a small, satisfying bit of physics. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className="inline-flex" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

export function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.17a10.95 10.95 0 0 1 5.76 0c2.2-1.49 3.16-1.17 3.16-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** Telegram paper-plane mark (Simple Icons, CC0). */
export function TelegramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

/**
 * Small monochrome organisation mark next to a role or degree: a hairline square with the initials,
 * or the logo when `mark.logo` is set. Logos go in public/images/logos/ as monochrome dark-on-transparent
 * files (SVG preferred); they render in grayscale and are inverted in dark mode. Decorative: the name is
 * always in the text next to it.
 */
export function OrgMark({ mark, className = "h-10 w-10 text-[13px]" }: { mark: OrgMarkData; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`relative flex shrink-0 select-none items-center justify-center overflow-hidden rounded-lg border border-line/15 bg-surface/40 font-display font-semibold leading-none tracking-tight text-muted rtl:tracking-normal ${className}`}
    >
      {mark.logo ? (
        <Image
          src={mark.logo}
          alt=""
          fill
          sizes="40px"
          unoptimized={mark.logo.endsWith(".svg")}
          className="object-contain p-1.5 opacity-80 grayscale dark:invert"
        />
      ) : (
        mark.monogram
      )}
    </span>
  );
}
