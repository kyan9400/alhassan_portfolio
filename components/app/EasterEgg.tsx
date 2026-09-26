"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useCopy } from "@/lib/hooks";
import { celebrate } from "@/lib/confetti";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** ↑↑↓↓←→←→BA — a small reward for the curious. Also logs a hello in the console. */
export function EasterEgg() {
  const showToast = usePortfolioStore((s) => s.showToast);
  const copy = useCopy();

  useEffect(() => {
    console.log(
      "%c👋 Hey, fellow developer! %cTry the Konami code on this page. Want to talk? kyan775909@gmail.com",
      "font-size:14px;font-weight:bold;color:#a78bfa",
      "color:inherit"
    );
  }, []);

  useEffect(() => {
    let index = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      index = key === KONAMI[index] ? index + 1 : key === KONAMI[0] ? 1 : 0;
      if (index === KONAMI.length) {
        index = 0;
        celebrate();
        showToast(copy.ui.toastEasterEgg);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showToast, copy.ui.toastEasterEgg]);

  return null;
}
