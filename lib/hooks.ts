"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { usePortfolioStore } from "@/store/portfolioStore";
import { getCopy, CONTACT_EMAIL } from "@/lib/ui-copy";
import { trackEvent } from "@/lib/analytics";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, localePath, splitLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

/**
 * The page language: the [lang] route segment, provided by the root layout (app/[lang]/layout.tsx)
 * through AppChrome. It is known on the server, so the server HTML and the first client render agree.
 */
export const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Copy for the current locale. Memoized so it is a stable reference between renders. */
export function useCopy() {
  const locale = useLocale();
  return useMemo(() => getCopy(locale), [locale]);
}

/** Builds a link in the current language from a language-neutral path: "/cv" → "/ru/cv", "/#contact" → "/ru#contact". */
export function useLocalePath() {
  const locale = useLocale();
  return useCallback((path: string) => localePath(locale, path), [locale]);
}

/** The current path without its language prefix: "/ru/projects/x" → "/projects/x", "/ar" → "/". */
export function usePagePath() {
  return splitLocale(usePathname() ?? "/").path;
}

/**
 * The same page in another language, for the language switcher. A note is written in one language
 * and exists only at that language's URL, so from a note the switcher opens the notes list instead.
 */
export function useLanguageHref() {
  const path = usePagePath();
  const target = path.startsWith("/notes/") ? "/notes" : path;
  return useCallback((locale: Locale) => localePath(locale, target), [target]);
}

/** Remembers an explicit language choice; proxy.ts sends later visits to "/" (or any unprefixed URL) there. */
export function rememberLocale(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
  } catch {
    /* cookies unavailable */
  }
}

/**
 * Home sections in page order (contract 7). The signature case study sits between
 * "projects" and "skills" on the page but has no navigation entry.
 */
export const SECTION_IDS = ["hero", "about", "experience", "projects", "skills", "services", "github-repos", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Navigation entries (hero first, contact last) with labels for the current locale. */
export function useSections(): { id: SectionId; label: string }[] {
  const copy = useCopy();
  return useMemo(() => {
    // copy.nav is [About, Services, Projects, Repositories, Skills, Experience].
    const labels: Record<SectionId, string> = {
      hero: copy.navHome,
      about: copy.nav[0],
      services: copy.nav[1],
      projects: copy.nav[2],
      "github-repos": copy.nav[3],
      skills: copy.nav[4],
      experience: copy.nav[5],
      contact: copy.navContact
    };
    return SECTION_IDS.map((id) => ({ id, label: labels[id] }));
  }, [copy]);
}

/**
 * Whether /notes is live (NOTES_ENABLED in lib/notes-config.ts, computed on the server from the posts
 * on disk). The root layout passes it to AppChrome, which provides it here, so client chrome (navbar,
 * command palette, footer) links to /notes only when the section exists.
 */
export const NotesEnabledContext = createContext(false);

export function useNotesEnabled() {
  return useContext(NotesEnabledContext);
}

export function useCvFile() {
  const copy = useCopy();
  const locale = useLocale();
  return copy.cvDownloads.find((cv) => cv.code.toLowerCase() === locale)?.file ?? copy.cvDownloads[0].file;
}

/**
 * The CV for the current locale plus a click handler that reports `cv_download`.
 * Use as `<a href={cv.href} download onClick={cv.onClick}>`.
 */
export function useCvDownload() {
  const href = useCvFile();
  const locale = useLocale();
  const onClick = useCallback(() => trackEvent("cv_download", { lang: locale }), [locale]);
  return { href, onClick };
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export function useTheme() {
  const isDark = useSyncExternalStore(
    subscribeTheme,
    () => document.documentElement.classList.contains("dark"),
    () => true
  );
  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains("dark");
    const apply = () => document.documentElement.classList.toggle("dark", next);
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
    if (doc.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      doc.startViewTransition(apply);
    } else {
      apply();
    }
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  }, []);
  return { isDark, toggle };
}

/** Clipboard API first; a hidden textarea for browsers or contexts that block it. */
async function writeToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const previousFocus = document.activeElement as HTMLElement | null;
    const area = document.createElement("textarea");
    try {
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(area);
      area.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      area.remove();
      previousFocus?.focus?.({ preventScroll: true });
    }
  }
}

/**
 * Copies the contact email and confirms with a toast. If the browser refuses, the toast shows
 * the address itself so it can be copied by hand; it never navigates away to a mail app.
 * Resolves to whether the copy succeeded.
 */
export function useCopyEmail() {
  const showToast = usePortfolioStore((s) => s.showToast);
  const copiedMessage = useCopy().ui.toastEmailCopied;
  return useCallback(async () => {
    const ok = await writeToClipboard(CONTACT_EMAIL);
    if (ok) trackEvent("email_copy");
    showToast(ok ? copiedMessage : CONTACT_EMAIL);
    return ok;
  }, [showToast, copiedMessage]);
}

/**
 * Tracks which section is in the middle of the viewport. `key` (the pathname) re-subscribes after a
 * client-side navigation: the navbar stays mounted across routes, and the home sections are new
 * elements each time the home page is shown again.
 */
export function useActiveSection(ids: readonly string[], key?: string) {
  const [state, setState] = useState<{ key: string | undefined; id: string }>({ key, id: ids[0] });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setState({ key, id: entry.target.id });
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids, key]);
  // A value recorded on another route is stale: fall back to the first section until the observer reports.
  return state.key === key ? state.id : ids[0];
}

/** Sets --mx/--my on the element for the `.spotlight` hover glow. */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
