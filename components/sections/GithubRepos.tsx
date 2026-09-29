"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, BrainCircuit, LayoutTemplate, Search, Server, Star, Workflow, type LucideIcon } from "lucide-react";
import type { GithubRepo, RepoCategory } from "@/lib/github";
import { GITHUB_URL } from "@/lib/ui-copy";
import { useCopy, useLocale } from "@/lib/hooks";
import { Bidi, SectionHeader, GithubIcon } from "@/components/ui/primitives";
import { ArchiveLink } from "./Projects";

/** Web and AI work first; platform tooling last. */
const FILTERS = ["all", "ai", "backend", "frontend", "platform"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Cards shown before "View all": fewer on phones so the section doesn't turn into a long scroll.
 * The phone limit is CSS (cards past it get `max-sm:hidden`), not a matchMedia re-render: the server
 * HTML is already right on every screen, and nothing is removed (and exit-animated) after hydration.
 */
const INITIAL_DESKTOP = 3;
const INITIAL_MOBILE = 2;
const MOBILE_QUERY = "(max-width: 639px)";

/** Header art for repos without a screenshot: one icon and tint per category. */
const CATEGORY_ART: Record<RepoCategory, { icon: LucideIcon; tint: string; ink: string }> = {
  platform: { icon: Workflow, tint: "from-violet-500/25 via-violet-500/[0.06]", ink: "text-violet-600 dark:text-violet-300" },
  backend: { icon: Server, tint: "from-cyan-500/25 via-cyan-500/[0.06]", ink: "text-cyan-700 dark:text-cyan-300" },
  ai: { icon: BrainCircuit, tint: "from-fuchsia-500/25 via-fuchsia-500/[0.06]", ink: "text-fuchsia-600 dark:text-fuchsia-300" },
  frontend: { icon: LayoutTemplate, tint: "from-sky-500/25 via-blue-500/[0.06]", ink: "text-sky-700 dark:text-sky-300" }
};

/** GitHub's linguist colours for the languages in the curated list. */
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  HCL: "#844FBA"
};

const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgb(var(--line) / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.07) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
  maskImage: "radial-gradient(ellipse at 30% 25%, black 15%, transparent 70%)",
  WebkitMaskImage: "radial-gradient(ellipse at 30% 25%, black 15%, transparent 70%)"
};

const norm = (s: string) => s.trim().toLowerCase();

function hasOwnDescription(repo: GithubRepo) {
  if (!repo.description?.trim()) return false;
  const d = norm(repo.description);
  return d !== norm(repo.name) && d !== norm(repo.displayName);
}

function LanguageLabel({ language }: { language: string }) {
  return (
    <span className="inline-flex items-center gap-1.5" dir="ltr">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: LANGUAGE_COLORS[language] ?? "rgb(var(--accent))" }} aria-hidden="true" />
      {language}
    </span>
  );
}

/** Text-only header for repos without a committed screenshot. */
function RepoArt({ repo }: { repo: GithubRepo }) {
  const art = CATEGORY_ART[repo.category];
  const Icon = art.icon;
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${art.tint} to-transparent`} aria-hidden="true" />
      <div className="absolute inset-0" style={GRID_STYLE} aria-hidden="true" />
      <Icon
        className="absolute -bottom-8 -end-8 h-44 w-44 text-text/[0.05] transition-transform duration-700 ease-out group-hover:-rotate-6 group-hover:scale-110"
        strokeWidth={1}
        aria-hidden="true"
      />
      <span className="absolute start-5 top-5 flex h-11 w-11 items-center justify-center rounded-2xl border hairline bg-card/70 shadow-sm">
        <Icon className={`h-5 w-5 ${art.ink}`} aria-hidden="true" />
      </span>
      <div className="absolute inset-x-5 bottom-5 font-mono" aria-hidden="true">
        <p className="text-[11px] text-muted">
          <bdi>kyan9400 /</bdi>
        </p>
        <p className="mt-0.5 truncate text-[17px] font-medium text-text">
          <bdi>{repo.name}</bdi>
        </p>
      </div>
    </>
  );
}

/**
 * A repo card. The title link is "stretched" over the whole card (its ::after), opening the live demo
 * when there is one and the repository otherwise; the GitHub link sits above that overlay as a sibling,
 * so no interactive element is nested in another.
 */
function RepoCard({ repo }: { repo: GithubRepo }) {
  const copy = useCopy();
  const { ui } = copy;
  const locale = useLocale();
  const primaryHref = repo.homepage ?? repo.html_url;
  const translated = locale === "en" ? undefined : repo.descriptionI18n?.[locale];

  return (
    <>
      {/* Headers are shorter on phones, where the cards stack in one column (screenshots are cropped from the top). */}
      <div className={`relative overflow-hidden border-b hairline bg-surface ${repo.previewImage ? "aspect-[2/1] sm:aspect-[16/10]" : "aspect-[5/2] sm:aspect-[16/10]"}`}>
        {repo.previewImage ? (
          <Image
            src={repo.previewImage}
            alt={`${repo.displayName} ${ui.previewAlt}`}
            fill
            sizes="(min-width: 1152px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <RepoArt repo={repo} />
        )}
        {repo.homepage ? (
          <span className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur rtl:tracking-normal">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgb(52_211_153/0.9)]" aria-hidden="true" />
            {ui.liveBadge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug transition-colors group-hover:text-accent-ink">
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={ui.cursorOpen}
            className="after:absolute after:inset-0 after:rounded-3xl after:content-['']"
          >
            <bdi>{repo.displayName}</bdi>
            {repo.homepage ? <span className="sr-only"> ({ui.liveBadge})</span> : null}
          </a>
        </h3>
        {translated ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
            <Bidi text={translated} />
          </p>
        ) : hasOwnDescription(repo) ? (
          // English (no translation yet): marked as such for screen readers, aligned to its own start.
          <p lang="en" dir="auto" className="mt-2 line-clamp-3 text-start text-sm leading-relaxed text-muted">
            {repo.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted">
          <div className="flex min-w-0 items-center gap-3">
            {repo.language ? <LanguageLabel language={repo.language} /> : null}
            {repo.stargazers_count > 0 ? (
              <span className="inline-flex items-center gap-1 tabular-nums">
                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                {repo.stargazers_count}
              </span>
            ) : null}
          </div>
          {repo.homepage ? (
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.projectViewGithubLabel}: ${repo.displayName}`}
              className="relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border hairline px-3 font-medium transition hover:border-accent/40 hover:text-text"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              {copy.projectViewGithubLabel}
            </a>
          ) : (
            // The whole card already opens the repository; this is only the visual cue.
            <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border hairline px-3 font-medium transition group-hover:border-accent/40 group-hover:text-text" aria-hidden="true">
              <GithubIcon className="h-3.5 w-3.5" />
              {copy.projectViewGithubLabel}
              <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export function GithubRepos({ repos }: { repos: GithubRepo[] }) {
  const copy = useCopy();
  const { ui } = copy;
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: repos.length, platform: 0, backend: 0, ai: 0, frontend: 0 };
    for (const r of repos) c[r.category] += 1;
    return c;
  }, [repos]);

  const filtered = useMemo(() => {
    const q = norm(query);
    return repos.filter(
      (r) =>
        (filter === "all" || r.category === filter) &&
        (!q ||
          norm(
            [r.displayName, r.name, r.description ?? "", r.descriptionI18n?.ru ?? "", r.descriptionI18n?.ar ?? "", r.language ?? "", ...r.topics].join(" ")
          ).includes(q))
    );
  }, [repos, filter, query]);

  const shown = expanded ? filtered : filtered.slice(0, INITIAL_DESKTOP);
  const remainingDesktop = filtered.length - shown.length;
  const remainingMobile = expanded ? 0 : Math.max(0, filtered.length - INITIAL_MOBILE);
  const showingEverything = filter === "all" && !query.trim();

  // "View all" disappears once used, so keyboard focus moves to the first newly shown card.
  const gridRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);
  const expand = () => {
    focusIndex.current = window.matchMedia(MOBILE_QUERY).matches ? INITIAL_MOBILE : shown.length;
    setExpanded(true);
  };
  useEffect(() => {
    if (!expanded || focusIndex.current === null) return;
    const index = focusIndex.current;
    focusIndex.current = null;
    gridRef.current?.querySelectorAll<HTMLAnchorElement>("h3 a")[index]?.focus();
  }, [expanded]);

  return (
    <section id="github-repos" className="section cv-auto [--cv-h:1980px] md:[--cv-h:1940px] lg:[--cv-h:1430px]">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={copy.githubReposEyebrow} title={copy.githubReposTitle} description={copy.githubReposDescription} />
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost mb-12 shrink-0 self-start md:mb-16 md:self-auto">
            <GithubIcon />
            <bdi>@kyan9400</bdi>
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </a>
        </div>

        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative md:w-72 md:shrink-0">
            <span className="sr-only">{copy.githubSearchPlaceholder}</span>
            <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setExpanded(false);
              }}
              placeholder={copy.githubSearchPlaceholder}
              className="field !rounded-full ps-11"
            />
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={ui.repoFilterLabel}>
            {FILTERS.map((key) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setFilter(key);
                    setExpanded(false);
                  }}
                  className={`relative inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-medium transition-colors ${
                    active ? "text-text" : "text-muted hover:text-text"
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="repo-filter"
                      className="absolute inset-0 rounded-full bg-surface ring-1 ring-line/15"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{ui.repoCategories[key]}</span>
                  <span className={`relative text-[11px] tabular-nums ${active ? "text-muted" : "text-muted/70"}`}>{counts[key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="card p-10 text-center text-muted" role="status">
            {copy.githubReposEmpty}
          </p>
        ) : (
          <motion.ul ref={gridRef} layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((repo, index) => (
                <motion.li
                  layout
                  key={repo.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className={`card card-hover group flex flex-col overflow-hidden ${!expanded && index >= INITIAL_MOBILE ? "max-sm:hidden" : ""}`}
                >
                  <RepoCard repo={repo} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}

        {remainingMobile > 0 ? (
          // Phones hide at least as many cards as larger screens; from sm the button only shows if cards are hidden there too.
          <div className={`mt-10 flex justify-center ${remainingDesktop > 0 ? "" : "sm:hidden"}`}>
            <button type="button" className="btn-ghost" onClick={expand}>
              {showingEverything ? ui.viewAllRepos : copy.githubReposViewMore}
              {showingEverything ? (
                <span className="tabular-nums text-muted">{filtered.length}</span>
              ) : (
                <>
                  <span className="tabular-nums text-muted sm:hidden">+{remainingMobile}</span>
                  <span className="tabular-nums text-muted max-sm:hidden">+{remainingDesktop}</span>
                </>
              )}
            </button>
          </div>
        ) : null}

        <ArchiveLink className="mt-8" />
      </div>
    </section>
  );
}
