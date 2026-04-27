"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { GithubRepo } from "@/lib/github";
import { SectionHeader } from "./SectionHeader";

const INITIAL_VISIBLE = 6;

// Category keys in stable order; display labels come from the prop array (same order)
const CATEGORY_KEYS = ["all", "frontend", "fullstack", "ai", "dashboard", "backend", "blockchain"] as const;
type Category = (typeof CATEGORY_KEYS)[number];

function matchesCategory(repo: GithubRepo, cat: Category): boolean {
  if (cat === "all") return true;
  const hay = [
    repo.name,
    repo.description ?? "",
    repo.language ?? "",
    ...(repo.topics ?? [])
  ]
    .join(" ")
    .toLowerCase();

  switch (cat) {
    case "frontend":
      return /react|vue|angular|svelte|next\.?js|nuxt|remix|html|css|tailwind|frontend|landing|portfolio|ui\b|ux\b|sass|scss/.test(hay) &&
        !/backend|api\b|server|fastapi|flask|django|express|laravel/.test(hay);
    case "fullstack":
      return /full.?stack|fullstack|webapp|web.?app|saas|platform|dashboard.*api|api.*dashboard/.test(hay);
    case "ai":
      return /\bai\b|ml\b|llm\b|rag\b|neural|gpt|nlp|bert|embedding|model|inference|transformers|langchain|openai|pytorch|tensorflow|machine.?learning|deep.?learning/.test(hay) ||
        (repo.language ?? "").toLowerCase() === "python";
    case "dashboard":
      return /dashboard|analytics|chart|report|kpi|visualization|grafana|tableau|monitor/.test(hay);
    case "backend":
      return /backend|api\b|server|fastapi|flask|django|express|laravel|spring|rails|rest|graphql/.test(hay) &&
        !/frontend|react|vue|angular/.test(hay);
    case "blockchain":
      return /blockchain|solidity|crypto|web3|defi|nft|token|ethereum|smart.?contract|hardhat|foundry/.test(hay);
    default:
      return true;
  }
}

type Props = {
  repos: GithubRepo[] | null;
  eyebrow: string;
  title: string;
  description: string;
  viewMoreLabel: string;
  viewGithubLabel: string;
  errorLabel: string;
  emptyLabel: string;
  searchPlaceholder: string;
  filterCategories: string[];
};

function formatRepoName(name: string) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace(" Master", "");
}

function formatDescription(desc: string | null, name: string) {
  if (desc && desc.trim().length > 0) return desc;
  return name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function GithubReposSection({
  repos,
  eyebrow,
  title,
  description,
  viewMoreLabel,
  viewGithubLabel,
  errorLabel,
  emptyLabel,
  searchPlaceholder,
  filterCategories
}: Props) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("all");

  const filtered = useMemo(() => {
    if (!repos) return [] as GithubRepo[];
    const q = search.trim().toLowerCase();
    return repos.filter((repo) => {
      const categoryMatch = matchesCategory(repo, activeCategory);
      if (!categoryMatch) return false;
      if (!q) return true;
      return (
        repo.name.toLowerCase().includes(q) ||
        (repo.description ?? "").toLowerCase().includes(q) ||
        (repo.language ?? "").toLowerCase().includes(q) ||
        (repo.topics ?? []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [repos, search, activeCategory]);

  const visible = filtered.slice(0, visibleCount);
  const canExpand = visibleCount < filtered.length;

  function handleCategoryChange(cat: Category) {
    setActiveCategory(cat);
    setVisibleCount(INITIAL_VISIBLE);
  }

  function handleSearch(val: string) {
    setSearch(val);
    setVisibleCount(INITIAL_VISIBLE);
  }

  if (repos === null) {
    return (
      <section id="github-repos" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <p className="rounded-2xl border border-border/15 bg-surface/[0.04] px-6 py-10 text-center text-sm text-text/75" role="status">
          {errorLabel}
        </p>
      </section>
    );
  }

  if (repos.length === 0) {
    return (
      <section id="github-repos" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} />
        <p className="rounded-2xl border border-dashed border-border/20 bg-surface/[0.03] px-8 py-12 text-center text-sm text-text/70">
          {emptyLabel}
        </p>
      </section>
    );
  }

  return (
    <section id="github-repos" className="mx-auto max-w-6xl px-4 py-14 md:py-18">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />

      {/* Search + filter controls */}
      <div className="mb-7 flex flex-col gap-3">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-black/[0.07] bg-card/60 py-2.5 pl-9 pr-4 text-sm text-text placeholder:text-muted/60 outline-none transition focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 dark:border-white/[0.09] dark:bg-card/35"
          />
        </div>

        {/* Horizontally scrollable on mobile */}
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
          {CATEGORY_KEYS.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => handleCategoryChange(key)}
              className={`flex-shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                activeCategory === key
                  ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow shadow-indigo-500/25"
                  : "border border-black/[0.06] bg-surface/30 text-muted hover:text-text dark:border-white/[0.08] dark:bg-surface/10"
              }`}
            >
              {filterCategories[i] ?? key}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/20 bg-surface/[0.03] px-8 py-10 text-center text-sm text-text/65">
          {emptyLabel}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((repo, idx) => {
            const hasLive = Boolean(repo.homepage && repo.homepage.trim().length > 0);
            const displayName = formatRepoName(repo.name);
            const displayDescription = formatDescription(repo.description, repo.name);

            return (
              <motion.article
                key={repo.html_url}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.04, 0.24), ease: "easeOut" }}
                className="github-repo-card relative flex flex-col overflow-hidden"
              >
                {repo.previewImage ? (
                  <div className="relative -mx-[1rem] -mt-[0.85rem] mb-3 aspect-[16/10] w-[calc(100%+2rem)] border-b border-black/[0.06] dark:border-white/[0.08]">
                    <Image
                      src={repo.previewImage}
                      alt={`Live preview of ${displayName}`}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {hasLive ? (
                      <span className="absolute right-2.5 top-2.5 rounded-full border border-emerald-500/25 bg-emerald-950/50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-100 backdrop-blur-sm dark:border-emerald-300/30 dark:bg-emerald-950/40">
                        Live
                      </span>
                    ) : null}
                  </div>
                ) : hasLive ? (
                  <span className="absolute right-3 top-3 z-[1] rounded-full border border-emerald-500/20 bg-emerald-500/[0.08] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700/90 dark:border-emerald-300/20 dark:bg-emerald-300/[0.08] dark:text-emerald-200/85">
                    Live
                  </span>
                ) : null}

                <h3 className={`text-[0.95rem] font-semibold leading-snug tracking-[-0.01em] text-text ${repo.previewImage ? "" : "pr-12"}`}>
                  {displayName}
                </h3>

                <p className="mt-1.5 flex-1 line-clamp-2 text-[13px] leading-relaxed text-text/70">
                  {displayDescription}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                  {repo.language ? (
                    <span className="rounded-md bg-black/[0.04] px-1.5 py-0.5 dark:bg-white/[0.06]">
                      {repo.language}
                    </span>
                  ) : null}
                  {repo.stargazers_count > 0 ? (
                    <span className="tabular-nums" aria-label={`${repo.stargazers_count} stars`}>
                      ⭐ {repo.stargazers_count}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {hasLive ? (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="pill pill-cta py-2 text-[11px] font-medium"
                    >
                      Live Preview
                    </a>
                  ) : null}
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className={`pill py-2 text-[11px] font-medium ${hasLive ? "pill-github-muted" : "pill-cta"}`}
                  >
                    {viewGithubLabel}
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {canExpand ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="pill text-[12px] font-medium text-text/85"
            onClick={() => setVisibleCount(filtered.length)}
          >
            {viewMoreLabel}
          </button>
        </div>
      ) : null}
    </section>
  );
}
