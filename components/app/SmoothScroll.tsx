"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** A link to a section of a home page in any language: "/en#projects", "/ar#contact". */
const HOME_HASH_LINK = /^\/(en|ru|ar)#/;

/** Distance kept clear for the floating navbar when scrolling to a section. */
const NAV_OFFSET = 80;

/**
 * Home sections skip rendering until they near the viewport (.cv-auto in globals.css), so their
 * heights are estimates until then. Call before any jump to a section: it renders them all, so the
 * landing position is exact. Stays on afterwards (the cost is paid once).
 */
export function renderAllSections() {
  document.documentElement.classList.add("cv-all");
}

/**
 * Lenis smooth scrolling; skipped entirely for reduced-motion users. Started when the browser is idle,
 * so its setup and frame loop stay out of the first paint and hydration (native scrolling works meanwhile).
 */
export function SmoothScroll() {
  // Links to a home section (/en#projects), e.g. from a case study: render every section before the
  // router scrolls to it. Capture phase, so this runs before the link's own click handling.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href*='#']");
      if (link && HOME_HASH_LINK.test(link.getAttribute("href") ?? "")) renderAllSections();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let lenis: Lenis | undefined;
    const start = () => {
      lenis = new Lenis({ duration: 1.1, anchors: { offset: -NAV_OFFSET }, autoRaf: true });
      window.__lenis = lenis;
    };
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const handle = idle(start, { timeout: 2500 });

    return () => {
      cancelIdle(handle);
      lenis?.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}

/**
 * Moves keyboard and screen-reader focus to a section (or #main) without scrolling again, so the
 * next Tab continues from there. Non-focusable targets get a temporary tabindex="-1" (no focus
 * ring: they are regions, not controls). It is removed on blur; a permanent one would make every
 * mouse click inside the region focus it and send the next Tab back to its start.
 */
export function focusTarget(el: HTMLElement) {
  if (!el.hasAttribute("tabindex")) {
    el.setAttribute("tabindex", "-1");
    el.classList.add("outline-none");
    el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
  }
  el.focus({ preventScroll: true });
}

/** Keeps the address bar shareable (/#projects) without adding history entries. */
function updateHash(id: string) {
  const url = id === "hero" ? `${window.location.pathname}${window.location.search}` : `#${id}`;
  try {
    // `null` state: Next.js's patched replaceState copies its own router state into the entry.
    window.history.replaceState(null, "", url);
  } catch {
    /* history unavailable (sandboxed iframe) */
  }
}

/** Smooth-scrolls to a section on the current page, then focuses it and updates the URL hash. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  // Only home has these sections; off the home page callers navigate with <Link href="/en#id"> or router.push.
  if (!el) return;

  // Sections not yet rendered (content-visibility: auto) only have estimated heights: render them all
  // first, so the target position is exact before the scroll starts (see .cv-auto in globals.css).
  renderAllSections();

  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: id === "hero" ? 0 : -NAV_OFFSET });
  } else {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }

  focusTarget(el);
  updateHash(id);
}
