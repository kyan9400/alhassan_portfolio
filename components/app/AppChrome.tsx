"use client";

import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { hydrateLocale, usePortfolioStore } from "@/store/portfolioStore";
import { useCopy } from "@/lib/hooks";
import { SmoothScroll } from "./SmoothScroll";
import { Background } from "./Background";
import { Cursor } from "./Cursor";
import { Navbar } from "./Navbar";
import { CommandPalette } from "./CommandPalette";
import { Toast } from "./Toast";
import { EasterEgg } from "./EasterEgg";

export function AppChrome({ children }: { children: React.ReactNode }) {
  const copy = useCopy();
  const locale = usePortfolioStore((s) => s.locale);

  useEffect(() => {
    hydrateLocale();
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = copy.dir;
  }, [locale, copy.dir]);

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">
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
      <CommandPalette />
      <Toast />
      <EasterEgg />
    </MotionConfig>
  );
}
