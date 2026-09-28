"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { useCopy, useNotesEnabled } from "@/lib/hooks";
import { Bidi } from "@/components/ui/primitives";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Locale } from "@/lib/types";

const SOURCE_URL = "https://github.com/kyan9400/alhassan_portfolio";

/** Fallback until the client clock is known (only differs on New Year's Eve). */
const RENDER_YEAR = new Date().getFullYear();
const TIME_LOCALES: Record<Locale, string> = { en: "en-GB", ru: "ru-RU", ar: "ar-u-nu-latn" };

// A minute-resolution clock as an external store: the server renders a placeholder (no
// hydration mismatch), the client fills in the time right after hydration and keeps it fresh.
function subscribeClock(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}
const getMinute = () => Math.floor(Date.now() / 60_000);
const getServerMinute = () => null;

/** Greeting for the visitor's own time of day (their clock, not Moscow's). */
function greetingFor(hour: number, g: { morning: string; afternoon: string; evening: string; night: string }) {
  if (hour < 5) return g.night;
  if (hour < 12) return g.morning;
  if (hour < 18) return g.afternoon;
  return g.evening;
}

/**
 * Site footer: a large quiet sign-off with the name, then name, a time-aware greeting next to my local
 * time in Moscow, and "back to top"; below, a closed-by-default colophon ("How this site is built").
 * Shared by home, the case studies, the archive and notes.
 */
export function Footer({ className = "" }: { className?: string }) {
  const copy = useCopy();
  const locale = usePortfolioStore((s) => s.locale);
  const notesEnabled = useNotesEnabled();
  const colophon = copy.ui.colophon;
  const minute = useSyncExternalStore<number | null>(subscribeClock, getMinute, getServerMinute);

  const now = minute === null ? null : new Date(minute * 60_000);
  const time = now
    ? new Intl.DateTimeFormat(TIME_LOCALES[locale], { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(now)
    : "--:--";

  return (
    <footer className={className}>
      {/* Decorative sign-off: the name, very large and faint. */}
      <p
        aria-hidden="true"
        className="select-none text-balance font-display text-[clamp(2.75rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-text/[0.07] rtl:tracking-normal"
      >
        {copy.heroTitle}
      </p>
      <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-line/10 pt-8 text-sm text-muted md:flex-row">
      <div className="text-center md:text-start">
        <p className="font-display text-base font-semibold text-text">
          {copy.heroTitle}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-1 text-xs">
          © <span suppressHydrationWarning>{now ? now.getFullYear() : RENDER_YEAR}</span> · {copy.ui.footerTagline} {copy.footerBuiltWith}.
        </p>
      </div>
      <p className="text-center text-xs">
        {now ? <span>{greetingFor(now.getHours(), copy.ui.greeting)} · </span> : null}
        {copy.ui.footerLocalTime}:{" "}
        <time className="font-medium tabular-nums text-text" dateTime={now ? now.toISOString() : undefined}>
          {time}
        </time>{" "}
        · {copy.ui.city}
      </p>
      <div className="flex shrink-0 items-center gap-2">
        {notesEnabled ? (
          <Link href="/notes" className="btn-ghost !min-h-[40px] whitespace-nowrap text-[13px]">
            {copy.ui.notes.navLabel}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => (window.__lenis ? window.__lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }))}
          className="btn-ghost !min-h-[40px] whitespace-nowrap text-[13px]"
        >
          {copy.ui.footerBackToTop}
          <ArrowUpRight className="h-4 w-4 -rotate-45" aria-hidden="true" />
        </button>
      </div>
      </div>

      {/* Colophon: native <details>, so it opens with the keyboard and works before hydration. */}
      <details className="group mt-6 border-t border-line/10 pt-2 text-sm print:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-center gap-2 rounded-md text-xs font-medium text-muted transition-colors hover:text-text md:justify-start [&::-webkit-details-marker]:hidden">
          <Plus className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
          {colophon.summary}
        </summary>
        <div className="grid gap-x-10 gap-y-6 pb-4 pt-4 md:grid-cols-3">
          {colophon.items.map((item) => (
            <div key={item.title}>
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-text rtl:tracking-normal">{item.title}</p>
              <p className="mt-2 text-pretty text-[13px] leading-relaxed text-muted">
                <Bidi text={item.body} />
              </p>
            </div>
          ))}
        </div>
        <a
          href={SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link mb-2 min-h-[44px] text-[13px]"
        >
          {colophon.source}
          <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
        </a>
      </details>
    </footer>
  );
}
