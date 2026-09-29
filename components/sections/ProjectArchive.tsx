"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Lock } from "lucide-react";
import { localizeProject, projects } from "@/lib/projects";
import type { GithubRepo } from "@/lib/github";
import { trackEvent } from "@/lib/analytics";
import { useCopy, useLocale, useLocalePath } from "@/lib/hooks";
import { Bidi, GithubIcon } from "@/components/ui/primitives";
import { Footer } from "@/components/app/Footer";

type Context = "job" | "freelance" | "openSource";

type Row = {
  key: string;
  year?: number;
  title: string;
  /** Set when the description is the English original on a Russian or Arabic page. */
  descriptionLang?: "en";
  description: string | null;
  context: Context;
  company?: string;
  stack: string[];
  /** Internal case-study page (portfolio projects only). */
  href?: string;
  live?: string;
  github?: string;
  privateNote?: string;
};

/** Same entrance as the case studies: CSS-only, so the heading is not held back until hydration. */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

/**
 * /projects/archive: every portfolio project and every curated repository as one table, newest first.
 * The context is derived from the data, never guessed: a work project is "Work" (with the employer) or
 * "Freelance" (client-owned code); anything with public code on GitHub is "Open source".
 * From lg it is a five-column table; below lg each row stacks (no horizontal scroll). The table keeps its
 * semantics through explicit roles, because `display: grid/block` on table elements drops them in Safari.
 */
export function ProjectArchive({ repos }: { repos: GithubRepo[] }) {
  const copy = useCopy();
  const { ui } = copy;
  const a = ui.archive;
  const locale = useLocale();
  const lp = useLocalePath();

  const rows = useMemo<Row[]>(() => {
    const fromProjects = projects.map<Row>((original) => {
      const p = localizeProject(original, locale);
      const context: Context = p.kind === "open-source" ? "openSource" : p.codeNote === "client" ? "freelance" : "job";
      return {
        key: `project-${p.slug}`,
        year: p.year,
        title: p.title,
        description: p.description,
        context,
        company: context === "job" ? p.company : undefined,
        stack: p.tech,
        href: lp(`/projects/${p.slug}`),
        live: p.live,
        github: p.github,
        privateNote: p.github ? undefined : p.codeNote === "client" ? ui.privateCodeClient : ui.privateCode
      };
    });
    const fromRepos = repos.map<Row>((r) => {
      const translated = locale === "en" ? undefined : r.descriptionI18n?.[locale];
      return {
        key: `repo-${r.name}`,
        year: r.year,
        title: r.displayName,
        description: translated ?? r.description,
        descriptionLang: locale !== "en" && !translated ? "en" : undefined,
        context: "openSource",
        stack: r.stack,
        live: r.homepage,
        github: r.html_url
      };
    });
    // Newest first; unknown years last. The sort is stable, so projects stay ahead of repos within a year.
    return [...fromProjects, ...fromRepos].sort((x, y) => (y.year ?? -Infinity) - (x.year ?? -Infinity));
  }, [repos, locale, lp, ui.privateCode, ui.privateCodeClient]);

  const contextLabel = (row: Row) => (row.company ? `${a.context[row.context]} · ${row.company}` : a.context[row.context]);
  const smallLink =
    "inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-line/15 px-3 text-[12px] font-medium text-text transition-colors hover:border-accent/40 hover:text-accent-ink";

  return (
    <main className="pb-10 pt-28 md:pt-36">
      <div className="shell">
        <div className="fade-in">
          <Link href={lp("/#projects")} className="btn-ghost group !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {copy.projectBackLabel}
          </Link>
        </div>

        <header className="mt-10 max-w-3xl">
          <p className="eyebrow fade-in" style={delay(60)}>
            {a.eyebrow}
          </p>
          <h1 className="fade-in mt-5 text-balance text-[clamp(2.25rem,5.5vw,4rem)] font-semibold leading-[1.04] rtl:leading-[1.25]" style={delay(100)}>
            {a.title}
          </h1>
          <p className="fade-in mt-5 text-pretty text-base leading-relaxed text-muted md:text-lg" style={delay(160)}>
            <Bidi text={a.description} />
          </p>
        </header>

        <div role="table" aria-label={a.title} aria-rowcount={rows.length + 1} className="fade-in mt-12 border-b hairline md:mt-16" style={delay(220)}>
          {/* Column headers: visible from lg, read by screen readers everywhere. */}
          <div role="rowgroup" className="max-lg:sr-only">
            <div
              role="row"
              aria-rowindex={1}
              className="grid grid-cols-[4.5rem_minmax(0,1.5fr)_9rem_minmax(0,1.1fr)_13.5rem] gap-x-6 pb-3 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-muted rtl:tracking-normal"
            >
              <span role="columnheader">{a.columns.year}</span>
              <span role="columnheader">{a.columns.project}</span>
              <span role="columnheader">{a.columns.context}</span>
              <span role="columnheader">{a.columns.stack}</span>
              <span role="columnheader" className="text-end">
                {a.columns.links}
              </span>
            </div>
          </div>

          <div role="rowgroup">
            {rows.map((row, i) => (
              <div
                key={row.key}
                role="row"
                aria-rowindex={i + 2}
                className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 border-t py-5 [border-top-color:rgb(var(--line)/var(--line-alpha))] lg:grid-cols-[4.5rem_minmax(0,1.5fr)_9rem_minmax(0,1.1fr)_13.5rem] lg:items-baseline lg:gap-x-6 lg:gap-y-0"
              >
                <div role="cell" className="font-mono text-[13px] tabular-nums text-muted max-lg:order-1">
                  {row.year ?? (
                    <>
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">{a.unknownYear}</span>
                    </>
                  )}
                </div>

                <div role="cell" className="min-w-0 break-words max-lg:order-3 max-lg:col-span-2">
                  <p className="font-display text-[17px] font-semibold leading-snug">
                    {row.href ? (
                      <Link
                        href={row.href}
                        data-cursor={ui.cursorView}
                        onClick={() => trackEvent("project_open", { slug: row.key.replace(/^project-/, ""), source: "archive" })}
                        className="underline decoration-line/25 underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-current"
                      >
                        <Bidi text={row.title} />
                        <span className="sr-only"> — {a.caseStudy}</span>
                      </Link>
                    ) : (
                      <bdi>{row.title}</bdi>
                    )}
                  </p>
                  {row.description ? (
                    <p
                      lang={row.descriptionLang}
                      dir={row.descriptionLang ? "auto" : undefined}
                      className="mt-1 line-clamp-2 text-pretty text-start text-sm leading-relaxed text-muted"
                    >
                      {row.descriptionLang ? row.description : <Bidi text={row.description} />}
                    </p>
                  ) : null}
                </div>

                <div role="cell" className="text-[13px] text-muted max-lg:order-2">
                  <span aria-hidden="true" className="me-2 lg:hidden">
                    ·
                  </span>
                  <Bidi text={contextLabel(row)} />
                </div>

                <div role="cell" className="min-w-0 max-lg:order-4 max-lg:col-span-2">
                  <p className="break-words font-mono text-[12px] leading-relaxed text-muted rtl:text-right" dir="ltr">
                    {row.stack.join(" · ")}
                  </p>
                </div>

                <div role="cell" className="flex flex-wrap items-center gap-2 max-lg:order-5 max-lg:col-span-2 max-lg:pt-1 lg:justify-end">
                  {row.live ? (
                    <a href={row.live} target="_blank" rel="noopener noreferrer" className={smallLink} aria-label={`${copy.projectLiveDemo}: ${row.title}`}>
                      {copy.projectLiveDemo}
                      <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
                    </a>
                  ) : null}
                  {row.github ? (
                    <a href={row.github} target="_blank" rel="noopener noreferrer" className={smallLink} aria-label={`${copy.projectViewGithubLabel}: ${row.title}`}>
                      <GithubIcon className="h-3.5 w-3.5" />
                      {copy.projectViewGithubLabel}
                    </a>
                  ) : row.privateNote ? (
                    <span className="inline-flex min-h-[36px] items-center gap-1.5 text-[12px] text-muted" title={row.privateNote}>
                      <Lock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="lg:sr-only">{row.privateNote}</span>
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer className="mt-24" />
      </div>
    </main>
  );
}
