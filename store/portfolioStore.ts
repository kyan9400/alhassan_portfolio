import { create } from "zustand";

/**
 * UI state shared across the client chrome. The language is not here: it is the route segment
 * (app/[lang]/), provided to client components by LocaleContext (lib/hooks.ts).
 */
type PortfolioState = {
  toast: { id: number; message: string } | null;
  showToast: (message: string) => void;
  paletteOpen: boolean;
  /** True once the command palette has been opened; its code is only loaded from then on. */
  paletteUsed: boolean;
  setPaletteOpen: (open: boolean) => void;
  /**
   * A reason another section asks the contact form to preselect (Services → "freelance").
   * Contact applies it once and clears it back to null.
   */
  contactReason: ContactReason | null;
  setContactReason: (reason: ContactReason | null) => void;
};

export type ContactReason = "hiring" | "freelance" | "other";

let toastSeq = 0;

export const usePortfolioStore = create<PortfolioState>((set) => ({
  toast: null,
  // A counter (not Date.now()) so two toasts in the same millisecond still get distinct keys.
  showToast: (message) => set({ toast: { id: ++toastSeq, message } }),
  paletteOpen: false,
  paletteUsed: false,
  setPaletteOpen: (paletteOpen) => set((s) => ({ paletteOpen, paletteUsed: s.paletteUsed || paletteOpen })),
  contactReason: null,
  setContactReason: (contactReason) => set({ contactReason })
}));
