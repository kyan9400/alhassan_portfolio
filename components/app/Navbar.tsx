"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useSpring } from "framer-motion";
import { Command, Download, Menu, Moon, Sun, X } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { SECTION_IDS, useActiveSection, useCopy, useCvDownload, useSections, useTheme } from "@/lib/hooks";
import { TELEGRAM_URL } from "@/lib/ui-copy";
import { usePageScroll } from "@/lib/scroll";
import { trackEvent } from "@/lib/analytics";
import { TelegramIcon } from "@/components/ui/primitives";
import { scrollToId } from "./SmoothScroll";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["en", "ru", "ar"];
const MENU_ID = "mobile-menu";

const noopSubscribe = () => () => {};
/** ⌘ on Apple devices, Ctrl elsewhere. The server (and hydration) render ⌘, then the client corrects it. */
function useIsApple() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent),
    () => true
  );
}

/** Starts downloading the lazily loaded command palette before it is first opened. */
const preloadPalette = () => {
  void import("./CommandPalette");
};

export function Navbar() {
  const copy = useCopy();
  const { ui } = copy;
  const sections = useSections();
  const cv = useCvDownload();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const active = useActiveSection(SECTION_IDS, pathname);
  const locale = usePortfolioStore((s) => s.locale);
  const setLocale = usePortfolioStore((s) => s.setLocale);
  const setPaletteOpen = usePortfolioStore((s) => s.setPaletteOpen);
  const { isDark, toggle } = useTheme();
  const isApple = useIsApple();

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const { scrollY, scrollYProgress } = usePageScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 20);
    setHidden(y > 400 && y > prev && !menuOpen);
  });

  // ⌘K / Ctrl+K opens the command palette from anywhere.
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

  // The mobile menu closes on Escape (focus returns to its button), on a click outside the header,
  // and when the viewport grows into the desktop layout where the menu does not exist.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [menuOpen]);

  const go = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    setMenuOpen(false);
    // Off the home page, or when opening in a new tab/window, let the link do its normal job.
    if (!isHome || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    scrollToId(id);
  };

  const navLinks = sections.filter((s) => s.id !== "hero" && s.id !== "contact");
  const iconButton = "flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text";

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-accent rtl:origin-right"
        style={{ scaleX: progress }}
        aria-hidden="true"
      />
      <motion.header
        id="site-header"
        ref={headerRef}
        initial={false}
        animate={{ y: hidden ? -110 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        onFocusCapture={() => setHidden(false)}
        className="fixed inset-x-0 top-3 z-50 sm:top-4"
      >
        {/* Same width as .shell. Wrapper + 1px border + bar padding + link padding = the shell gutter (16px, 24px from sm), so the logo lines up with the content. */}
        <div className="mx-auto max-w-6xl px-2 sm:px-3">
          <div
            className={`flex items-center justify-between gap-2 rounded-full border px-1.5 py-1.5 transition-[background-color,border-color,box-shadow] duration-500 sm:px-2 ${
              scrolled || !isHome || menuOpen
                ? "hairline bg-card/70 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.4)] backdrop-blur-2xl"
                : "border-transparent bg-transparent"
            }`}
          >
            <Link
              href="/"
              onClick={go("hero")}
              className="group flex shrink-0 items-center gap-2.5 rounded-full py-1 pe-3 ps-px sm:ps-[3px]"
              aria-label={copy.heroTitle}
            >
              {/* Flat monogram in the text colour. */}
              <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line/25 font-display text-[13px] font-bold tracking-tight text-text transition-colors duration-300 group-hover:border-accent/60">
                {copy.brandMonogram}
              </span>
              <span className="hidden font-display text-sm font-semibold tracking-tight sm:inline lg:hidden xl:inline">
                {copy.brandName}
                <span className="text-accent">.</span>
              </span>
            </Link>

            <nav aria-label={ui.primaryNav} className="hidden lg:block">
              <ul className="flex items-center gap-0.5">
                {navLinks.map((s) => {
                  const isActive = isHome && active === s.id;
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/#${s.id}`}
                        onClick={go(s.id)}
                        aria-current={isActive ? "location" : undefined}
                        className={`relative block whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
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
            </nav>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                onPointerEnter={preloadPalette}
                onFocus={preloadPalette}
                className="hidden h-9 items-center gap-1 rounded-full px-3 text-xs text-muted transition hover:bg-surface hover:text-text md:flex"
                aria-label={ui.command.open}
                aria-haspopup="dialog"
                aria-keyshortcuts={isApple ? "Meta+K" : "Control+K"}
                dir="ltr"
              >
                <kbd className="flex items-center font-sans text-[11px]" aria-hidden="true">
                  {isApple ? <Command className="h-3.5 w-3.5" /> : "Ctrl"}
                </kbd>
                <kbd className="font-sans text-[11px]" aria-hidden="true">
                  K
                </kbd>
              </button>

              <div className="flex items-center rounded-full bg-surface/60 p-0.5" role="group" aria-label={copy.languageLabel}>
                {LOCALES.map((l) => (
                  <button
                    key={l}
                    type="button"
                    lang={l}
                    onClick={() => setLocale(l)}
                    aria-pressed={locale === l}
                    // The visible code stays in the name (WCAG 2.5.3) next to the language's own name.
                    aria-label={`${ui.languageNames[l]} (${l.toUpperCase()})`}
                    title={ui.languageNames[l]}
                    className={`relative h-8 min-w-[2.1rem] rounded-full px-2 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                      locale === l ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {locale === l ? (
                      <motion.span
                        layoutId="locale-pill"
                        className="absolute inset-0 -z-0 rounded-full bg-card shadow-sm ring-1 ring-line/15"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    ) : null}
                    <span className="relative">{l}</span>
                  </button>
                ))}
              </div>

              <button type="button" onClick={toggle} className={iconButton} aria-label={ui.command.toggleTheme}>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={isDark ? "moon" : "sun"}
                    initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {isDark ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
              </button>

              <Link href="/#contact" onClick={go("contact")} className="btn-solid hidden !min-h-[36px] !px-4 text-[13px] md:inline-flex">
                {copy.navContact}
              </Link>

              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-text transition hover:bg-surface lg:hidden"
                aria-label={menuOpen ? ui.menuClose : ui.menuOpen}
                aria-expanded={menuOpen}
                aria-controls={MENU_ID}
              >
                {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {menuOpen ? (
              <motion.nav
                id={MENU_ID}
                aria-label={ui.primaryNav}
                initial={{ opacity: 0, y: -10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="card mt-2 !bg-card/95 p-3 backdrop-blur-xl lg:hidden"
              >
                <ul className="grid grid-cols-2 gap-1">
                  {sections.map((s, i) => {
                    const isActive = isHome && active === s.id;
                    return (
                      <motion.li key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <Link
                          href={`/#${s.id}`}
                          onClick={go(s.id)}
                          aria-current={isActive ? "location" : undefined}
                          className={`flex min-h-[44px] items-center rounded-2xl px-4 text-sm font-medium transition ${
                            isActive ? "bg-accent/10 text-accent-ink" : "text-muted hover:bg-surface hover:text-text"
                          }`}
                        >
                          {s.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
                <div className="mt-2 grid grid-cols-2 gap-1 border-t hairline pt-2">
                  <a
                    href={cv.href}
                    download
                    onClick={() => {
                      cv.onClick();
                      setMenuOpen(false);
                    }}
                    className="flex min-h-[44px] items-center gap-2 rounded-2xl px-4 text-sm font-medium text-muted transition hover:bg-surface hover:text-text"
                  >
                    <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {copy.contactCvLabel}
                  </a>
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackEvent("telegram_click");
                      setMenuOpen(false);
                    }}
                    className="flex min-h-[44px] items-center gap-2 rounded-2xl px-4 text-sm font-medium text-muted transition hover:bg-surface hover:text-text"
                  >
                    <TelegramIcon className="h-4 w-4 shrink-0" />
                    {ui.telegramLabel}
                  </a>
                </div>
              </motion.nav>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
