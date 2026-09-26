"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades + lifts children into view once. Small travel so nothing feels jumpy. */
export function Reveal({
  delay = 0,
  y = 24,
  as = "div",
  className,
  children,
  ...rest
}: { delay?: number; y?: number; as?: "div" | "li" } & HTMLMotionProps<"div">) {
  const Tag = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "start"
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}) {
  return (
    <Reveal className={`mb-12 max-w-3xl md:mb-16 ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.05]">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">{description}</p> : null}
    </Reveal>
  );
}

/** Pulls its child toward the pointer — a small, satisfying bit of physics. */
export function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 250, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span ref={ref} className="inline-flex" style={{ x: sx, y: sy }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  );
}

export function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.17a10.95 10.95 0 0 1 5.76 0c2.2-1.49 3.16-1.17 3.16-1.17.62 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.36-5.25 5.64.41.36.78 1.05.78 2.13v3.16c0 .31.21.68.8.56C20.22 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

export function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}
