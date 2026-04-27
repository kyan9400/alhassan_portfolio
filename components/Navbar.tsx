"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";

type NavSection = { id: string; label: string };

type Props = {
  sections: NavSection[];
  activeSection: string;
  locale: Locale;
  setLocale: (l: Locale) => void;
  brandMonogram: string;
  brandName: string;
  cvLabel: string;
  cvFile: string;
};

export function Navbar({
  sections,
  activeSection,
  locale,
  setLocale,
  brandMonogram,
  brandName,
  cvLabel,
  cvFile
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on scroll or section click
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [menuOpen]);

  return (
    <div className="sticky top-3 z-50 mx-auto mb-8 max-w-6xl">
      <motion.nav
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        aria-label="Primary"
        className="flex items-center justify-between gap-2 rounded-full border border-black/10 bg-card/90 px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-white/[0.22] dark:bg-card/82 dark:shadow-[0_8px_32px_rgba(0,0,0,0.45),0_1px_0_rgba(255,255,255,0.06)_inset]"
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
            {brandMonogram}
          </span>
          <span className="hidden text-sm font-semibold text-text sm:inline">
            {brandName}
            <span className="text-indigo-500 dark:text-indigo-300">.</span>
          </span>
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`nav-link ${activeSection === section.id ? "nav-active" : ""}`}
            >
              {section.label}
            </a>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          {/* CV — desktop only */}
          <a
            href={cvFile}
            download
            className="hidden items-center gap-1.5 rounded-full border border-black/[0.06] bg-surface/40 px-2.5 py-1 text-[11px] font-semibold text-text/75 transition hover:bg-surface/65 hover:text-text md:inline-flex dark:border-white/[0.08] dark:bg-surface/15 dark:hover:bg-surface/25"
            aria-label="Download CV"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
            </svg>
            {cvLabel}
          </a>

          {/* Locale switcher */}
          <div className="flex h-8 items-center gap-0.5 rounded-full border border-black/[0.04] bg-surface/50 p-0.5 dark:border-white/[0.08] dark:bg-surface/20">
            {(["en", "ru", "ar"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-widest transition sm:px-2.5 sm:text-[11px] ${
                  locale === lang
                    ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow shadow-indigo-500/30"
                    : "text-muted hover:text-text"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-surface/40 text-text/70 transition hover:bg-surface/65 hover:text-text md:hidden dark:border-white/[0.08] dark:bg-surface/15"
          >
            {menuOpen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mt-2 overflow-hidden rounded-2xl border border-black/10 bg-card/95 p-3 shadow-[0_10px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl md:hidden dark:border-white/[0.14] dark:bg-card/90"
          >
            <div className="grid grid-cols-2 gap-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    activeSection === section.id
                      ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/12 dark:text-indigo-300"
                      : "text-text/70 hover:bg-surface/50 hover:text-text"
                  }`}
                >
                  {section.label}
                </a>
              ))}
            </div>
            {/* CV download in mobile menu */}
            <div className="mt-2 border-t border-black/[0.05] pt-2 dark:border-white/[0.07]">
              <a
                href={cvFile}
                download
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-text/70 transition hover:bg-surface/50 hover:text-text"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />
                </svg>
                {cvLabel}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
