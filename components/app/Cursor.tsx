"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A soft ring that trails the pointer. Grows over links/buttons and shows a
 * label over elements with `data-cursor="View"`. Hidden on touch devices.
 */
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- enable only after checking device capabilities
    setEnabled(true);

    let x = -100;
    let y = -100;
    let cx = x;
    let cy = y;
    let raf = 0;

    // Only animate while the ring is catching up; idle otherwise.
    const tick = () => {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor], input, textarea");
      setHovering(Boolean(target) && !target?.matches("input, textarea"));
      setLabel(target?.dataset.cursor ?? null);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  if (!enabled) return null;

  const size = label ? 84 : hovering ? 44 : 22;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[90] will-change-transform"
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[11px] font-semibold uppercase tracking-widest transition-[width,height,background-color,border-color,transform] duration-300 ease-out ${
          label
            ? "bg-gradient-to-br from-violet-600 to-cyan-500 text-white shadow-[0_10px_40px_-8px_rgba(124,58,237,0.8)]"
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
