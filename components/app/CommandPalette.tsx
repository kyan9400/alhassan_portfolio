"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Copy, Download, Hash, Moon, Search } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useCopy, useCopyEmail, useCvFile, useSections, useTheme } from "@/lib/hooks";
import { scrollToId } from "./SmoothScroll";

type Item = { id: string; label: string; group: string; icon: React.ReactNode; run: () => void };

export function CommandPalette() {
  const open = usePortfolioStore((s) => s.paletteOpen);
  const setOpen = usePortfolioStore((s) => s.setPaletteOpen);
  const copy = useCopy();
  const sections = useSections();
  const cvFile = useCvFile();
  const copyEmail = useCopyEmail();
  const { toggle } = useTheme();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const c = copy.ui.command;
    const all: Item[] = [
      ...sections.map((s) => ({
        id: s.id,
        label: s.label,
        group: c.sections,
        icon: <Hash className="h-4 w-4" />,
        run: () => (pathname === "/" ? scrollToId(s.id) : (window.location.href = `/#${s.id}`))
      })),
      { id: "email", label: c.copyEmail, group: c.actions, icon: <Copy className="h-4 w-4" />, run: copyEmail },
      { id: "theme", label: c.toggleTheme, group: c.actions, icon: <Moon className="h-4 w-4" />, run: toggle },
      {
        id: "cv",
        label: c.downloadCv,
        group: c.actions,
        icon: <Download className="h-4 w-4" />,
        run: () => {
          const a = document.createElement("a");
          a.href = cvFile;
          a.download = "";
          a.click();
        }
      }
    ];
    const q = query.trim().toLowerCase();
    return q ? all.filter((i) => i.label.toLowerCase().includes(q)) : all;
  }, [copy.ui.command, sections, copyEmail, toggle, cvFile, query, pathname]);

  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      clearTimeout(t);
      window.__lenis?.start();
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  };

  const runItem = (item: Item | undefined) => {
    if (!item) return;
    close();
    setTimeout(item.run, 60);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(items.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + items.length) % Math.max(items.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(items[index]);
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[85] flex items-start justify-center bg-black/40 px-4 pt-[15vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={copy.ui.command.open}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className="card w-full max-w-lg overflow-hidden !bg-card/95"
          >
            <div className="flex items-center gap-3 border-b hairline px-4">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                placeholder={copy.ui.command.placeholder}
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/70"
                aria-label={copy.ui.command.placeholder}
              />
              <kbd className="rounded-md border hairline px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
              {items.length === 0 ? <li className="px-3 py-6 text-center text-sm text-muted">{copy.ui.command.empty}</li> : null}
              {items.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id}>
                    {header ? <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">{header}</p> : null}
                    <button
                      type="button"
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => runItem(item)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition ${
                        i === index ? "bg-accent/10 text-text" : "text-muted"
                      }`}
                    >
                      <span className={i === index ? "text-accent" : ""}>{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {i === index ? <ArrowRight className="h-3.5 w-3.5 text-accent rtl:rotate-180" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
