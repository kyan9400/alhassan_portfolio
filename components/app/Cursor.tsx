"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE = 'a, button, summary, label, select, [role="button"], [role="option"], [data-cursor], input, textarea';

/**
 * A soft ring that trails the pointer. Grows over links/buttons and shows a label over elements
 * with `data-cursor="…"`. Only on fine pointers without reduced motion, and invisible until the
 * pointer has actually moved over the page (so it never sits half-drawn in the top-left corner).
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable only after checking device capabilities
    setEnabled(true);

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;
    let seen = false;

    const place = () => {
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
    };

    // Only animate while the ring is catching up; idle otherwise.
    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      place();
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        // First sighting: start exactly under the pointer instead of sweeping in from a corner.
        seen = true;
        cx = x;
        cy = y;
        place();
        setVisible(true);
      } else if (!raf) {
        raf = requestAnimationFrame(tick);
      }
      const target = (e.target as Element | null)?.closest<HTMLElement>(INTERACTIVE);
      setHovering(Boolean(target) && !target?.matches("input, textarea, select"));
      setLabel(target?.dataset.cursor ?? null);
    };
    const onLeave = () => {
      seen = false;
      setVisible(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 44 : 22;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
      style={{ visibility: visible ? "visible" : "hidden" }}
    >
      <div
        className={`flex items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-widest transition-[width,height,background-color,border-color,transform] duration-300 ease-out rtl:tracking-normal ${
          label
            ? "bg-text text-bg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            : hovering
              ? "border border-accent/60 bg-accent/10"
              : "border border-text/40"
        }`}
        style={{ width: size, height: size, transform: `translate(-50%, -50%) scale(${pressed ? 0.8 : 1})` }}
      >
        {label}
      </div>
    </div>
  );
}
