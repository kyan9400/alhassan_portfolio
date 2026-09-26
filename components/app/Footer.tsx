"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Locale } from "@/lib/types";

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

/** Site footer: name, local time in Moscow and "back to top". Shared by home and the case studies. */
export function Footer({ className = "" }: { className?: string }) {
  const copy = useCopy();
  const locale = usePortfolioStore((s) => s.locale);
  const minute = useSyncExternalStore<number | null>(subscribeClock, getMinute, getServerMinute);

  const now = minute === null ? null : new Date(minute * 60_000);
  const time = now
    ? new Intl.DateTimeFormat(TIME_LOCALES[locale], { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(now)
    : "--:--";

  return (
    <footer className={`flex flex-col items-center justify-between gap-6 border-t border-line/10 pt-8 text-sm text-muted md:flex-row ${className}`}>
      <div className="text-center md:text-start">
        <p className="font-display text-base font-semibold text-text">
          {copy.heroTitle}
          <span className="text-accent">.</span>
        </p>
        <p className="mt-1 text-xs">
          © <span suppressHydrationWarning>{now ? now.getFullYear() : RENDER_YEAR}</span> · {copy.ui.footerTagline} {copy.footerBuiltWith}.
        </p>
      </div>
      <p className="text-xs">
        {copy.ui.footerLocalTime}:{" "}
        <time className="font-medium tabular-nums text-text" dateTime={now ? now.toISOString() : undefined}>
          {time}
        </time>{" "}
        · {copy.ui.city}
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
