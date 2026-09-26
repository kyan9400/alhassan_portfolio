"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { hydrateLocale, usePortfolioStore } from "@/store/portfolioStore";
import { useCopy, useDocumentTitle } from "@/lib/hooks";
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

export function AppChrome({ children }: { children: React.ReactNode }) {
  const copy = useCopy();
  const locale = usePortfolioStore((s) => s.locale);
  const localeReady = usePortfolioStore((s) => s.localeReady);
  const paletteUsed = usePortfolioStore((s) => s.paletteUsed);
  const pathname = usePathname();

  useEffect(() => {
    hydrateLocale();
  }, []);

  useEffect(() => {
    // Until the saved locale is read, `locale` is the server default ("en"). Writing it here would
    // undo the pre-paint script's lang/dir (app/layout.tsx) and flip Arabic to LTR for a frame.
    if (!localeReady) return;
    // Only write when different: even a same-value write can invalidate style for the whole page.
    const root = document.documentElement;
    if (root.lang !== locale) root.lang = locale;
    if (root.dir !== copy.dir) root.dir = copy.dir;
  }, [localeReady, locale, copy.dir]);

  // The home tab title follows the chosen language (case studies set their own in ProjectDetail).
  useDocumentTitle(localeReady && pathname === "/" ? copy.ui.meta.homeTitle : null);

  return (
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
  );
}
