"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { useCopy } from "@/lib/hooks";

type ErrorPageProps = {
  error: Error & { digest?: string };
  /** Re-fetches and re-renders the failed segment (stable since Next 16.3). */
  retry: () => void;
};

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  const copy = useCopy();
  const t = copy.ui.errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[100svh] items-center justify-center px-4">
      <div className="max-w-lg text-center" role="alert">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-4xl border hairline bg-card/70 shadow-[0_30px_70px_-30px_rgb(var(--glow)/0.6)]"
          aria-hidden="true"
        >
          <motion.span
            className="gradient-text select-none font-display text-5xl font-bold leading-none"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          >
            !
          </motion.span>
        </motion.div>

        <h1 className="mt-8 text-balance text-3xl font-semibold md:text-4xl">{t.title}</h1>
        <p className="mt-4 text-pretty text-muted">{t.body}</p>
        {error.digest ? (
          <p className="mt-3 font-mono text-xs text-muted/80" dir="ltr">
            ref: {error.digest}
          </p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => retry()} className="btn-primary">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t.retry}
          </button>
          <Link href="/" className="btn-ghost">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t.home}
          </Link>
        </div>
      </div>
    </main>
  );
}
