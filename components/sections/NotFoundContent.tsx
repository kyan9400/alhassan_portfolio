"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import { Home, Mail } from "lucide-react";
import { useCopy } from "@/lib/hooks";

const BOB = { y: [0, -12, 0] };
const SPIN = { rotate: [0, 360] };
const bobLoop: Transition = { duration: 3, repeat: Infinity, ease: "easeInOut" };
const spinLoop: Transition = { duration: 6, repeat: Infinity, ease: "linear" };
// The gradient sits on each digit: background-clip:text on the parent does not paint through
// transformed (animated) children, which left the digits invisible.
const DIGIT = "gradient-text inline-block";
/** Jump straight to the last keyframe (which equals the resting pose), i.e. no looping motion. */
const STILL: Transition = { duration: 0 };

/**
 * Animated 404. With reduced motion the looping bob/spin stops.
 * `useReducedMotion()` is null on the server, so it only switches transitions — never
 * `initial`/`animate`, which decide the server-rendered styles (no hydration mismatch).
 */
export function NotFoundContent() {
  const copy = useCopy();
  const reduceMotion = useReducedMotion();

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4 py-24">
      <div className="max-w-lg text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={reduceMotion ? { duration: 0.3 } : { type: "spring", stiffness: 200, damping: 12 }}
          className="select-none font-display text-[clamp(7rem,28vw,13rem)] font-bold leading-none"
          dir="ltr"
          aria-hidden="true"
        >
          <motion.span className={DIGIT} animate={BOB} transition={reduceMotion ? STILL : bobLoop}>
            4
          </motion.span>
          <motion.span className={DIGIT} animate={SPIN} transition={reduceMotion ? STILL : spinLoop}>
            0
          </motion.span>
          <motion.span className={DIGIT} animate={BOB} transition={reduceMotion ? STILL : { ...bobLoop, delay: 0.4 }}>
            4
          </motion.span>
        </motion.p>
        <h1 className="mt-4 text-balance text-3xl font-semibold md:text-4xl">{copy.notFoundTitle}</h1>
        <p className="mt-4 text-pretty text-muted">{copy.ui.notFoundJoke}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" aria-hidden="true" />
            {copy.notFoundCta}
          </Link>
          <Link href="/#contact" className="btn-ghost">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {copy.navContact}
          </Link>
        </div>
      </div>
    </main>
  );
}
