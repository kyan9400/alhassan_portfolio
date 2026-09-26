/** Lazy-loaded confetti burst in the brand colors. No-op for reduced motion. */
export async function celebrate() {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  const colors = ["#8b5cf6", "#22d3ee", "#a78bfa", "#f0abfc", "#ffffff"];
  const base = { particleCount: 70, spread: 70, startVelocity: 45, colors, zIndex: 95 };
  confetti({ ...base, origin: { x: 0.2, y: 0.8 }, angle: 60 });
  confetti({ ...base, origin: { x: 0.8, y: 0.8 }, angle: 120 });
}
