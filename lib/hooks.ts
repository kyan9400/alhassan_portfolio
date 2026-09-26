"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { getCopy, CONTACT_EMAIL } from "@/lib/ui-copy";

export function useCopy() {
  const locale = usePortfolioStore((s) => s.locale);
  return getCopy(locale);
}

export const SECTION_IDS = ["hero", "about", "services", "projects", "github-repos", "skills", "experience", "contact"] as const;

/** Nav sections derived from the existing copy labels. */
export function useSections() {
  const copy = useCopy();
  return [
    { id: "hero", label: copy.navHome },
    { id: "about", label: copy.nav[0] },
    { id: "services", label: copy.nav[1] },
    { id: "projects", label: copy.nav[2] },
    { id: "github-repos", label: copy.nav[3] },
    { id: "skills", label: copy.nav[4] },
    { id: "experience", label: copy.nav[5] },
    { id: "contact", label: copy.navContact }
  ];
}

export function useCvFile() {
  const copy = useCopy();
  const locale = usePortfolioStore((s) => s.locale);
  return copy.cvDownloads.find((cv) => cv.code.toLowerCase() === locale)?.file ?? copy.cvDownloads[0].file;
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

export function useCopyEmail() {
  const showToast = usePortfolioStore((s) => s.showToast);
  const copy = useCopy();
  return useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      showToast(copy.ui.toastEmailCopied);
    } catch {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  }, [showToast, copy.ui.toastEmailCopied]);
}

/** Tracks which section is in the middle of the viewport. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/** Sets --mx/--my on the element for the `.spotlight` hover glow. */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}
