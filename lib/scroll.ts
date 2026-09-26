"use client";

import { useEffect } from "react";
import { useMotionValue, type MotionValue } from "framer-motion";

/*
 * Scroll-linked motion values without Framer's useScroll(). useScroll measures the page (scrollHeight,
 * target offsets) in the first animation frame after hydration, which forces a layout of the whole
 * document, including sections that content-visibility would otherwise skip. Here nothing is read at
 * mount: one passive, rAF-batched listener updates the values when the page actually scrolls.
 */

type Listener = () => void;

const listeners = new Set<Listener>();
let frame = 0;

function flush() {
  frame = 0;
  listeners.forEach((listener) => listener());
}

function onScroll() {
  if (!frame) frame = requestAnimationFrame(flush);
}

/** Calls `listener` once per frame while the page scrolls or resizes. Returns the unsubscribe function. */
function subscribe(listener: Listener): () => void {
  if (listeners.size === 0) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size > 0) return;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    cancelAnimationFrame(frame);
    frame = 0;
  };
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Page scroll offset (px) and progress (0–1). Both start at 0 and follow scroll events; a restored or
 * deep-linked position fires one too, so there is nothing to measure up front.
 */
export function usePageScroll(): { scrollY: MotionValue<number>; scrollYProgress: MotionValue<number> } {
  const scrollY = useMotionValue(0);
  const scrollYProgress = useMotionValue(0);

  useEffect(
    () =>
      subscribe(() => {
        const top = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scrollY.set(top);
        scrollYProgress.set(max > 0 ? clamp01(top / max) : 0);
      }),
    [scrollY, scrollYProgress]
  );

  return { scrollY, scrollYProgress };
}

/**
 * How far `ref` has travelled through the viewport (0–1), like useScroll({ target, offset:
 * ["start <startAt>", "end <endAt>"] }) with both lines given as fractions of the viewport height.
 * It is only measured while the element is near the viewport, so off-screen sections stay unrendered.
 */
export function useElementScrollProgress(
  ref: React.RefObject<HTMLElement | null>,
  startAt: number,
  endAt: number
): MotionValue<number> {
  const progress = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = rect.height + (startAt - endAt) * vh;
      progress.set(travel > 0 ? clamp01((startAt * vh - rect.top) / travel) : 0);
    };

    let unsubscribe: (() => void) | null = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          measure();
          unsubscribe ??= subscribe(measure);
        } else if (unsubscribe) {
          // Leaving the viewport: settle on 0 or 1. Never measured before it was first seen.
          measure();
          unsubscribe();
          unsubscribe = null;
        }
      },
      { rootMargin: "20% 0px" }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      unsubscribe?.();
    };
  }, [ref, progress, startAt, endAt]);

  return progress;
}
