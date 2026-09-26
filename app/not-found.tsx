"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { useCopy } from "@/lib/hooks";

export default function NotFound() {
  const copy = useCopy();

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="gradient-text select-none font-display text-[clamp(7rem,28vw,13rem)] font-bold leading-none"
          aria-hidden="true"
        >
          <motion.span className="inline-block" animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
            4
          </motion.span>
          <motion.span className="inline-block" animate={{ rotate: [0, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
            0
          </motion.span>
          <motion.span className="inline-block" animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}>
            4
          </motion.span>
        </motion.p>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{copy.notFoundTitle}</h1>
        <p className="mt-4 text-muted">{copy.ui.notFoundJoke}</p>
        <Link href="/" className="btn-primary mt-10">
          <Home className="h-4 w-4" aria-hidden="true" />
          {copy.notFoundCta}
        </Link>
      </div>
    </main>
  );
}
