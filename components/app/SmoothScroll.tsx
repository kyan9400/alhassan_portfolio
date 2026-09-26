"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Lenis smooth scrolling; skipped entirely for reduced-motion users. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ duration: 1.1, anchors: { offset: -80 }, autoRaf: true });
    window.__lenis = lenis;
    return () => {
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: id === "hero" ? 0 : -80 });
  else el.scrollIntoView({ behavior: "smooth" });
}
