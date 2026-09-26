import { create } from "zustand";
import type { Locale } from "@/lib/types";

type PortfolioState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
};

const LOCALE_KEY = "locale";

export const usePortfolioStore = create<PortfolioState>((set) => ({
  locale: "en",
  setLocale: (locale) => {
    try {
      localStorage.setItem(LOCALE_KEY, locale);
    } catch {
      /* storage unavailable */
    }
    set({ locale });
  },
  toast: null,
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  paletteOpen: false,
  setPaletteOpen: (paletteOpen) => set({ paletteOpen })
}));

/** Restore the saved locale once on the client. */
export function hydrateLocale() {
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === "en" || saved === "ru" || saved === "ar") {
      usePortfolioStore.setState({ locale: saved });
    }
  } catch {
    /* storage unavailable */
  }
}
