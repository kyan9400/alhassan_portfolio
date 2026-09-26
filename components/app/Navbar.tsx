"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Command, Download, Menu, Moon, Sun, X } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { SECTION_IDS, useActiveSection, useCopy, useCvFile, useSections, useTheme } from "@/lib/hooks";
import { scrollToId } from "./SmoothScroll";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["en", "ru", "ar"];

export function Navbar() {
  const copy = useCopy();
  const sections = useSections();
  const cvFile = useCvFile();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(SECTION_IDS);
  const { locale, setLocale, setPaletteOpen } = usePortfolioStore();
  const { isDark, toggle } = useTheme();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > 400 && y > prev && !menuOpen);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  const go = (id: string) => (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (!isHome) return;
    e.preventDefault();
    scrollToId(id);
  };

  const navLinks = sections.filter((s) => s.id !== "hero" && s.id !== "contact");

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 rtl:origin-right"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4"
      >
        <nav
          aria-label="Primary"
          className={`mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-full border px-2 py-1.5 transition-all duration-500 ${
            scrolled || !isHome
              ? "hairline bg-card/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
              : "border-transparent bg-transparent"
          }`}
        >
          <Link href="/#hero" onClick={go("hero")} className="group flex items-center gap-2.5 rounded-full py-1 pe-3 ps-1" aria-label={copy.heroTitle}>
            <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 font-display text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-transform duration-500 group-hover:rotate-[360deg]">
              {copy.brandMonogram}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline">
              {copy.brandName}
              <span className="text-accent">.</span>
            </span>
          </Link>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((s) => {
              const isActive = isHome && active === s.id;
              return (
                <li key={s.id}>
                  <Link
                    href={`/#${s.id}`}
                    onClick={go(s.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
                      isActive ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-surface"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden h-9 items-center gap-1.5 rounded-full px-3 text-xs text-muted transition hover:bg-surface hover:text-text md:flex"
              aria-label={copy.ui.command.open}
            >
              <Command className="h-3.5 w-3.5" aria-hidden="true" />
              <kbd className="font-sans">K</kbd>
            </button>

            <div className="flex items-center rounded-full bg-surface/60 p-0.5" role="group" aria-label={copy.languageLabel}>
              {LOCALES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLocale(l)}
                  aria-pressed={locale === l}
                  className={`relative h-8 min-w-[2.1rem] rounded-full px-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                    locale === l ? "text-white" : "text-muted hover:text-text"
                  }`}
                >
                  {locale === l ? (
                    <motion.span
                      layoutId="locale-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-gradient-to-br from-violet-600 to-blue-600"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  ) : null}
                  <span className="relative">{l}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text"
              aria-label={copy.ui.command.toggleTheme}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isDark ? "moon" : "sun"}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </motion.span>
              </AnimatePresence>
            </button>

            <Link href="/#contact" onClick={go("contact")} className="btn-primary hidden !min-h-[36px] !px-4 text-[13px] md:inline-flex">
              {copy.navContact}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-text transition hover:bg-surface lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="card mx-auto mt-2 max-w-5xl p-3 lg:hidden"
            >
              <ul className="grid grid-cols-2 gap-1">
                {sections.map((s, i) => (
                  <motion.li key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    <Link
                      href={`/#${s.id}`}
                      onClick={go(s.id)}
                      className={`flex min-h-[44px] items-center rounded-2xl px-4 text-sm font-medium transition ${
                        isHome && active === s.id ? "bg-accent/10 text-accent-ink" : "text-muted hover:bg-surface hover:text-text"
                      }`}
                    >
                      {s.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <a href={cvFile} download className="mt-2 flex min-h-[44px] items-center gap-2 rounded-2xl border-t hairline px-4 text-sm font-medium text-muted hover:text-text">
                <Download className="h-4 w-4" aria-hidden="true" />
                {copy.contactCvLabel}
              </a>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
