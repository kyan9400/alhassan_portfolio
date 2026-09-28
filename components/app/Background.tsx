"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed ambient backdrop: two slow aurora blobs, a faint grid, and a soft glow
 * that eases toward the pointer. Only transforms/opacity animate (GPU-cheap).
 */
export function Background() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || window.matchMedia("(pointer: coarse)").matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 3;
    let tx = x;
    let ty = y;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      glow.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden print:hidden">
      <div className="absolute -left-[10%] -top-[20%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.18),transparent_65%)]" />
      <div
        className="absolute -right-[15%] top-[30%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgb(var(--accent-2)/0.12),transparent_65%)]"
      />
      <div
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(var(--line)/0.05) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)/0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 75%)"
        }}
      />
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgb(var(--glow)/0.12),transparent_60%)] will-change-transform"
        style={{ transform: "translate3d(-9999px,0,0)" }}
      />
    </div>
  );
}
