"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Archive, BookOpen, Copy, Download, FileText, FolderGit2, Hash, Languages, Moon, Search } from "lucide-react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { useCopy, useCopyEmail, useCvDownload, useNotesEnabled, useSections, useTheme } from "@/lib/hooks";
import { GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL } from "@/lib/ui-copy";
import { localizeProject, projects } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";
import { GithubIcon, LinkedinIcon, TelegramIcon } from "@/components/ui/primitives";
import { renderAllSections, scrollToId } from "./SmoothScroll";
import type { Locale } from "@/lib/types";

type Item = {
  id: string;
  label: string;
  /** Extra words the search should match (slug, tech, language code…). */
  keywords?: string;
  group: string;
  icon: React.ReactNode;
  run: () => void;
};

const LOCALES: Locale[] = ["en", "ru", "ar"];
/** Everything outside the palette that must be unreachable while it is open. */
const BACKGROUND_IDS = ["main", "site-header"];
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

function openExternal(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * ⌘K / Ctrl+K quick menu: a modal dialog with an ARIA combobox (the input keeps focus and
 * points at the highlighted option with aria-activedescendant).
 */
export function CommandPalette() {
  const open = usePortfolioStore((s) => s.paletteOpen);
  const setOpen = usePortfolioStore((s) => s.setPaletteOpen);
  const locale = usePortfolioStore((s) => s.locale);
  const setLocale = usePortfolioStore((s) => s.setLocale);
  const copy = useCopy();
  const sections = useSections();
  const cv = useCvDownload();
  const copyEmail = useCopyEmail();
  const { toggle } = useTheme();
  const notesEnabled = useNotesEnabled();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();
  const titleId = `${uid}-title`;
  const listId = `${uid}-list`;
  const optionId = (id: string) => `${uid}-opt-${id}`;

  const allItems = useMemo<Item[]>(() => {
    const c = copy.ui.command;
    return [
      ...sections.map<Item>((s) => ({
        id: `section-${s.id}`,
        label: s.label,
        keywords: s.id,
        group: c.sections,
        icon: <Hash className="h-4 w-4" />,
        run: () => {
          if (pathname === "/") return scrollToId(s.id);
          renderAllSections();
          router.push(`/#${s.id}`);
        }
      })),
      ...projects.map<Item>((p) => {
        const local = localizeProject(p, locale);
        return {
          id: `project-${p.slug}`,
          label: local.title,
          keywords: `${p.slug} ${p.company ?? ""} ${p.tech.join(" ")}`,
          group: copy.nav[2],
          icon: <FolderGit2 className="h-4 w-4" />,
          run: () => {
            trackEvent("project_open", { slug: p.slug, source: "palette" });
            router.push(`/projects/${p.slug}`);
          }
        };
      }),
      {
        id: "archive",
        label: copy.ui.archive.linkLabel,
        keywords: "archive all projects repositories table",
        group: copy.nav[2],
        icon: <Archive className="h-4 w-4" />,
        run: () => router.push("/projects/archive")
      },
      { id: "email", label: c.copyEmail, keywords: "email mail", group: c.actions, icon: <Copy className="h-4 w-4" />, run: () => void copyEmail() },
      {
        id: "cv",
        label: c.downloadCv,
        keywords: "cv resume pdf",
        group: c.actions,
        icon: <Download className="h-4 w-4" />,
        run: () => {
          cv.onClick();
          const a = document.createElement("a");
          a.href = cv.href;
          a.download = "";
          a.click();
        }
      },
      {
        id: "cv-page",
        label: c.openCv,
        keywords: "cv resume print page",
        group: c.actions,
        icon: <FileText className="h-4 w-4" />,
        run: () => router.push("/cv")
      },
      // Only while the notes section exists (NOTES_ENABLED, lib/notes-config.ts).
      ...(notesEnabled
        ? [
            {
              id: "notes",
              label: copy.ui.notes.navLabel,
              keywords: "notes blog articles posts",
              group: c.actions,
              icon: <BookOpen className="h-4 w-4" />,
              run: () => router.push("/notes")
            } satisfies Item
          ]
        : []),
      {
        id: "telegram",
        label: copy.ui.telegramLabel,
        keywords: "telegram tg chat",
        group: c.actions,
        icon: <TelegramIcon className="h-4 w-4" />,
        run: () => {
          trackEvent("telegram_click");
          openExternal(TELEGRAM_URL);
        }
      },
      { id: "github", label: copy.githubLabel, keywords: "github code", group: c.actions, icon: <GithubIcon className="h-4 w-4" />, run: () => openExternal(GITHUB_URL) },
      { id: "linkedin", label: copy.linkedinLabel, keywords: "linkedin", group: c.actions, icon: <LinkedinIcon className="h-4 w-4" />, run: () => openExternal(LINKEDIN_URL) },
      { id: "theme", label: c.toggleTheme, keywords: "theme dark light", group: c.actions, icon: <Moon className="h-4 w-4" />, run: toggle },
      ...LOCALES.filter((l) => l !== locale).map<Item>((l) => ({
        id: `lang-${l}`,
        label: copy.ui.languageNames[l],
        keywords: `${l} language`,
        group: copy.languageLabel,
        icon: <Languages className="h-4 w-4" />,
        run: () => setLocale(l)
      }))
    ];
  }, [copy, sections, locale, pathname, router, copyEmail, cv, toggle, setLocale, notesEnabled]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((i) => `${i.label} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [allItems, query]);

  const groups = useMemo(() => {
    const out: { name: string; items: { item: Item; i: number }[] }[] = [];
    items.forEach((item, i) => {
      const last = out[out.length - 1];
      if (last && last.name === item.group) last.items.push({ item, i });
      else out.push({ name: item.group, items: [{ item, i }] });
    });
    return out;
  }, [items]);

  const activeIndex = items.length ? Math.min(index, items.length - 1) : -1;
  const activeItem = activeIndex >= 0 ? items[activeIndex] : undefined;

  const close = () => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  };

  const runItem = (item: Item | undefined) => {
    if (!item) return;
    close();
    // Let the dialog close and focus return first; section jumps then move focus to the section.
    setTimeout(item.run, 60);
  };

  // While open: the page behind is inert and cannot scroll; focus starts in the input and returns
  // to whatever had it before when the palette closes.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const background = BACKGROUND_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    background.forEach((el) => {
      el.inert = true;
    });
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const previousGutter = root.style.scrollbarGutter;
    root.style.scrollbarGutter = "stable";
    root.style.overflow = "hidden";
    window.__lenis?.stop();
    inputRef.current?.focus({ preventScroll: true });

    return () => {
      background.forEach((el) => {
        el.inert = false;
      });
      root.style.overflow = previousOverflow;
      root.style.scrollbarGutter = previousGutter;
      window.__lenis?.start();
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);

  // Escape and the Tab trap are handled at window level, so they work wherever focus is
  // (for example after a click on the backdrop moved it to <body>).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        setQuery("");
        setIndex(0);
        return;
      }
      if (e.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const current = document.activeElement;
      if (!dialog.contains(current)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && current === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && current === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Keep the highlighted option visible while moving with the keyboard.
  useEffect(() => {
    if (!open || !activeItem) return;
    document.getElementById(`${uid}-opt-${activeItem.id}`)?.scrollIntoView({ block: "nearest" });
  }, [open, activeItem, uid]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (items.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((activeIndex + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((activeIndex - 1 + items.length) % items.length);
    } else if (e.key === "Home" && e.ctrlKey) {
      e.preventDefault();
      setIndex(0);
    } else if (e.key === "End" && e.ctrlKey) {
      e.preventDefault();
      setIndex(items.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runItem(activeItem);
    }
  };

  const c = copy.ui.command;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[85] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // pointerdown (not click) so a text selection dragged out of the input does not close it.
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="card w-full max-w-lg overflow-hidden !bg-card/95"
          >
            <h2 id={titleId} className="sr-only">
              {c.open}
            </h2>
            <div className="flex items-center gap-3 border-b hairline px-4">
              <Search className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={items.length > 0}
                aria-controls={listId}
                aria-activedescendant={activeItem ? optionId(activeItem.id) : undefined}
                aria-autocomplete="list"
                aria-label={c.placeholder}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder={c.placeholder}
                className="h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted/70"
              />
              <button
                type="button"
                onClick={close}
                className="rounded-md border hairline px-1.5 py-0.5 text-[10px] font-medium text-muted transition hover:text-text"
                aria-label={`${copy.ui.menuClose} (Esc)`}
              >
                Esc
              </button>
            </div>

            {items.length > 0 ? (
              <div id={listId} role="listbox" aria-label={c.open} className="max-h-[min(60vh,28rem)] overflow-y-auto p-2" data-lenis-prevent>
                {groups.map((group, g) => (
                  <div key={group.name} role="group" aria-labelledby={`${uid}-group-${g}`}>
                    <div id={`${uid}-group-${g}`} aria-hidden="true" className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
                      {group.name}
                    </div>
                    {group.items.map(({ item, i }) => {
                      const selected = i === activeIndex;
                      return (
                        <div
                          key={item.id}
                          id={optionId(item.id)}
                          role="option"
                          aria-selected={selected}
                          // Keep focus in the input when choosing with the mouse.
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseMove={() => {
                            if (!selected) setIndex(i);
                          }}
                          onClick={() => runItem(item)}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-start text-sm transition-colors ${
                            selected ? "bg-accent/10 text-text" : "text-muted"
                          }`}
                        >
                          <span className={`shrink-0 ${selected ? "text-accent" : ""}`} aria-hidden="true">
                            {item.icon}
                          </span>
                          <span className="min-w-0 flex-1 truncate">{item.label}</span>
                          {selected ? <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent rtl:rotate-180" aria-hidden="true" /> : null}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-3 py-6 text-center text-sm text-muted" role="status">
                {c.empty}
              </p>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
