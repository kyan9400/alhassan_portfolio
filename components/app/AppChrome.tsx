"use client";

import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { usePortfolioStore } from "@/store/portfolioStore";
import { LocaleContext, NotesEnabledContext } from "@/lib/hooks";
import { getCopy } from "@/lib/ui-copy";
import type { Locale } from "@/lib/types";
import { SmoothScroll, focusTarget } from "./SmoothScroll";
import { Background } from "./Background";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { Toast } from "./Toast";
import { EasterEgg } from "./EasterEgg";

// The palette (and the project list it searches) is only downloaded once someone opens it;
// the navbar warms this chunk on hover/focus of its ⌘K button.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

/** The skip link moves keyboard focus into the content, not just the scroll position. */
function skipToContent(e: React.MouseEvent<HTMLAnchorElement>) {
  const main = document.getElementById("main");
  if (!main) return;
  e.preventDefault();
  if (window.__lenis) window.__lenis.scrollTo(main, { immediate: true });
  else main.scrollIntoView({ block: "start" });
  focusTarget(main);
}

/**
 * `locale`: the [lang] route segment (app/[lang]/layout.tsx), provided to every client component
 * (useLocale / useCopy in lib/hooks.ts). The server already rendered <html lang dir> for it.
 * `notesEnabled`: NOTES_ENABLED from lib/notes-config.ts (server-only), shared with the client chrome.
 */
export function AppChrome({ children, locale, notesEnabled }: { children: React.ReactNode; locale: Locale; notesEnabled: boolean }) {
  const copy = getCopy(locale);
  const paletteUsed = usePortfolioStore((s) => s.paletteUsed);

  return (
    <LocaleContext value={locale}>
      <NotesEnabledContext value={notesEnabled}>
        <MotionConfig reducedMotion="user">
          <a href="#main" className="skip-link" onClick={skipToContent}>
            {copy.skipToContent}
          </a>
          <SmoothScroll />
          <Background />
          <div className="grain" aria-hidden="true" />
          <Navbar />
          <div id="main" className="relative z-10">
            {children}
          </div>
          <Cursor />
          {paletteUsed ? <CommandPalette /> : null}
          <Toast />
          <EasterEgg />
        </MotionConfig>
      </NotesEnabledContext>
    </LocaleContext>
  );
}
