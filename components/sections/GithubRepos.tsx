"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search, Star } from "lucide-react";
import type { GithubRepo } from "@/lib/github";
import { GITHUB_URL } from "@/lib/ui-copy";
import { useCopy } from "@/lib/hooks";
import { SectionHeader, GithubIcon } from "@/components/ui/primitives";

const CATEGORY_KEYS = ["all", "frontend", "fullstack", "ai", "dashboard", "backend", "blockchain"] as const;
type Category = (typeof CATEGORY_KEYS)[number];

const CATEGORY_KEYWORDS: Record<Exclude<Category, "all">, string[]> = {
  frontend: ["frontend", "react", "vue", "html", "css", "landing", "website", "portfolio", "ui", "javascript", "typescript"],
  fullstack: ["fullstack", "full-stack", "next", "node", "express", "platform", "saas", "app"],
  ai: ["ai", "llm", "rag", "gpt", "ml", "python", "gradio", "openai"],
  dashboard: ["dashboard", "admin", "analytics", "crm", "panel"],
  backend: ["backend", "api", "server", "node", "express", "django", "fastapi", "java"],
  blockchain: ["blockchain", "web3", "solidity", "crypto", "nft"]
};

const INITIAL_VISIBLE = 6;

function matches(repo: GithubRepo, cat: Category) {
  if (cat === "all") return true;
  const hay = [repo.name, repo.description ?? "", repo.language ?? "", ...(repo.topics ?? [])].join(" ").toLowerCase();
  return CATEGORY_KEYWORDS[cat].some((k) => hay.includes(k));
}

const prettyName = (name: string) => name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function GithubRepos({ repos }: { repos: GithubRepo[] | null }) {
  const copy = useCopy();
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(INITIAL_VISIBLE);

  const filtered = useMemo(() => {
    if (!repos) return [];
    const q = query.trim().toLowerCase();
    return repos.filter(
      (r) =>
        matches(r, category) &&
        (!q || [r.name, r.description ?? "", r.language ?? "", ...(r.topics ?? [])].join(" ").toLowerCase().includes(q))
    );
  }, [repos, category, query]);

  return (
    <section id="github-repos" className="section">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={copy.githubReposEyebrow} title={copy.githubReposTitle} description={copy.githubReposDescription} />
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-ghost mb-12 shrink-0 self-start md:mb-16 md:self-auto">
            <GithubIcon />
            @kyan9400
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        {repos === null ? (
          <p className="card p-10 text-center text-muted" role="status">
            {copy.githubReposError}{" "}
            <a href={GITHUB_URL} className="text-accent underline underline-offset-4" target="_blank" rel="noreferrer">
              {copy.githubReposViewGithub}
            </a>
          </p>
        ) : (
          <>
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative md:w-72">
                <span className="sr-only">{copy.githubSearchPlaceholder}</span>
                <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setVisible(INITIAL_VISIBLE);
                  }}
                  placeholder={copy.githubSearchPlaceholder}
                  className="field !rounded-full ps-11"
                />
              </label>
              <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 md:mx-0 md:px-0" role="group">
                {CATEGORY_KEYS.map((key, i) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={category === key}
                    onClick={() => {
                      setCategory(key);
                      setVisible(INITIAL_VISIBLE);
                    }}
                    className={`relative min-h-[40px] shrink-0 rounded-full px-4 text-[13px] font-medium transition-colors ${
                      category === key ? "text-white" : "text-muted hover:text-text"
                    }`}
                  >
                    {category === key ? (
                      <motion.span layoutId="repo-filter" className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-600 to-blue-600" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                    ) : null}
                    <span className="relative">{copy.githubFilterCategories[i] ?? key}</span>
                  </button>
                ))}
              </div>
            </div>

            {filtered.length === 0 ? (
              <p className="card p-10 text-center text-muted">{copy.githubReposEmpty}</p>
            ) : (
              <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence mode="popLayout">
                  {filtered.slice(0, visible).map((repo) => (
                    <motion.li
                      layout
                      key={repo.html_url}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                      className="card card-hover group flex flex-col overflow-hidden"
                    >
                      <a href={repo.homepage || repo.html_url} target="_blank" rel="noreferrer" data-cursor={copy.ui.cursorOpen} className="relative block aspect-[16/10] overflow-hidden border-b hairline bg-surface">
                        {repo.previewImage ? (
                          <Image
                            src={repo.previewImage}
                            alt={`${prettyName(repo.name)} preview`}
                            fill
                            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                            className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                          />
                        ) : null}
                        {repo.homepage ? (
                          <span className="absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live
                          </span>
                        ) : null}
                      </a>
                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-semibold leading-snug">{prettyName(repo.name)}</h3>
                        <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted">{repo.description || prettyName(repo.name)}</p>
                        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted">
                          <div className="flex items-center gap-3">
                            {repo.language ? <span className="tag">{repo.language}</span> : null}
                            {repo.stargazers_count > 0 ? (
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5" aria-hidden="true" />
                                {repo.stargazers_count}
                              </span>
                            ) : null}
                          </div>
                          <a href={repo.html_url} target="_blank" rel="noreferrer" className="flex h-9 items-center gap-1.5 rounded-full px-3 font-medium transition hover:bg-surface hover:text-text">
                            <GithubIcon className="h-3.5 w-3.5" />
                            {copy.projectViewGithubLabel}
                          </a>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}

            {visible < filtered.length ? (
              <div className="mt-10 flex justify-center">
                <button type="button" className="btn-ghost" onClick={() => setVisible(filtered.length)}>
                  {copy.githubReposViewMore} ({filtered.length - visible})
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
