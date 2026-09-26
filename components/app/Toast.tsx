"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";

export function Toast() {
  const toast = usePortfolioStore((s) => s.toast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => usePortfolioStore.setState({ toast: null }), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="card flex max-w-md items-center gap-3 px-4 py-3 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
