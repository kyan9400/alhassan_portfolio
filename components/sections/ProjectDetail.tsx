"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Copy,
  Download,
  Lightbulb,
  Lock,
  Maximize2,
  MoveHorizontal,
  ShieldAlert
} from "lucide-react";
import { localizeProject, type Project } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";
import { useCopy, useCopyEmail, useCvDownload, useDocumentTitle } from "@/lib/hooks";
import { CONTACT_EMAIL, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/ui-copy";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Bidi, Reveal, GithubIcon, TelegramIcon } from "@/components/ui/primitives";
import { Footer } from "@/components/app/Footer";

/**
 * Delay for the CSS-only `.fade-in` entrance (globals.css). Unlike a Framer `initial={{ opacity: 0 }}`,
 * it plays before hydration, so the title and hero image are never held back as the LCP element.
 */
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function ProjectDetail({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  const copy = useCopy();
  const { ui } = copy;
  const locale = usePortfolioStore((s) => s.locale);
  const localeReady = usePortfolioStore((s) => s.localeReady);
  const p = localizeProject(project, locale);

  // The tab title follows the chosen language (the server metadata is English).
  useDocumentTitle(localeReady ? `${p.title} — ${ui.meta.nameSuffix}` : null);
  const prevTitle = localizeProject(prev, locale).title;
  const nextTitle = localizeProject(next, locale).title;

  const isDiagram = p.imageKind === "diagram";
  const paragraphs = p.longDescription
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean);

  const caseCards = [
    { icon: ShieldAlert, label: copy.projectProblemLabel, text: p.problem, tone: "text-rose-500" },
    { icon: Lightbulb, label: copy.projectSolutionLabel, text: p.solution, tone: "text-accent" },
    { icon: CheckCircle2, label: copy.projectResultLabel, text: p.result, tone: "text-emerald-500" }
  ].filter((c): c is typeof c & { text: string } => Boolean(c.text));

  return (
    <main className="pb-10 pt-28 md:pt-36">
      <div className="shell max-w-5xl">
        <div className="fade-in">
          <Link href="/#projects" className="btn-ghost group !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {copy.projectBackLabel}
          </Link>
        </div>

        <header className="mt-10">
          <div className="fade-in flex flex-wrap items-center gap-3" style={delay(60)}>
            <span className="eyebrow">{p.kind === "work" ? ui.workProject : ui.openSource}</span>
            {p.company ? (
              <span className="tag !text-[12px] !text-accent-ink">
                <Building2 className="me-1.5 h-3.5 w-3.5" aria-hidden="true" />
                <Bidi text={p.company} />
              </span>
            ) : null}
          </div>

          <h1
            className="fade-in mt-5 text-balance text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.02]"
            style={delay(100)}
          >
            <Bidi text={p.title} />
          </h1>
          <p className="fade-in mt-4 text-sm uppercase tracking-[0.18em] text-muted rtl:tracking-normal" style={delay(160)}>
            <Bidi text={p.rolePurpose} />
          </p>
          <p className="fade-in mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted md:text-xl" style={delay(200)}>
            <Bidi text={p.description} />
          </p>

          <div className="fade-in mt-8 flex flex-wrap items-center gap-3" style={delay(240)}>
            {p.live ? (
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-primary">
                {copy.projectLiveDemo}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            ) : null}
            {p.github ? (
              <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <GithubIcon />
                {copy.projectViewGithubLabel}
              </a>
            ) : (
              <span className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-dashed border-line/20 px-5 text-sm font-medium text-muted">
                <Lock className="h-4 w-4" aria-hidden="true" />
                {ui.privateCode}
              </span>
            )}
          </div>
        </header>

        {isDiagram ? (
          <figure className="fade-in mt-14" style={delay(300)}>
            {/*
              Phones scroll the diagram sideways at a width where its labels stay readable (about 12px);
              from md it fits the column. LTR so it always starts at the beginning of the flow.
            */}
            <div className="card overflow-hidden !bg-[#0f0f17]">
              <div
                dir="ltr"
                role="region"
                aria-label={ui.diagram.region}
                tabIndex={0}
                className="overflow-x-auto overscroll-x-contain rounded-[inherit] md:overflow-visible"
              >
                <div className="relative aspect-video min-w-[880px] md:min-w-0">
                  <Image
                    src={p.image}
                    alt={`${p.title} ${ui.previewAlt}`}
                    fill
                    preload
                    unoptimized
                    sizes="(min-width: 1024px) 976px, 880px"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
            <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-3 text-sm text-muted">
              <span className="flex items-start gap-2">
                <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                <span>{ui.diagramNote}</span>
              </span>
              <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5 md:hidden">
                  <MoveHorizontal className="h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
                  {ui.diagram.swipe}
                </span>
                <a
                  href={p.image}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex min-h-[40px] items-center gap-1.5 font-medium text-text underline decoration-line/20 underline-offset-4 transition-colors hover:text-accent-ink hover:decoration-accent/50"
                >
                  <Maximize2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {ui.diagram.openFull}
                </a>
              </span>
            </figcaption>
          </figure>
        ) : (
          <figure className="fade-in mt-14" style={delay(300)}>
            <div className="card relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={p.image}
                alt={`${p.title} ${ui.previewAlt}`}
                fill
                preload
                sizes="(min-width: 1024px) 976px, 100vw"
                className="object-cover object-top"
              />
            </div>
          </figure>
        )}

        {caseCards.length ? (
          <div className={`mt-16 grid gap-4 ${caseCards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
            {caseCards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08} className="card p-6">
                <c.icon className={`h-5 w-5 ${c.tone}`} aria-hidden="true" />
                <h2 className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{c.label}</h2>
                <p className="mt-2 leading-relaxed">
                  <Bidi text={c.text} />
                </p>
              </Reveal>
            ))}
          </div>
        ) : null}

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_300px]">
          <div>
            <Reveal>
              <h2 className="eyebrow mb-6 font-sans">{ui.overview}</h2>
              <div className="space-y-6">
                {paragraphs.map((para, i) => (
                  <p key={i} className="text-pretty text-[17px] leading-[1.8] text-text/85">
                    <Bidi text={para} />
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14">
              <h2 className="eyebrow mb-6 font-sans">{copy.projectWhatItDoesLabel}</h2>
              <ul className="space-y-4">
                {p.whatItDoes.map((line) => (
                  <li key={line} className="flex gap-3 text-lg leading-relaxed">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" aria-hidden="true" />
                    <span>
                      <Bidi text={line} />
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="card p-6">
              <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal">{copy.projectTechStackLabel}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {p.tech.map((t) => (
                  <li key={t} dir="ltr" className="tag !text-[13px] !text-text/85">
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 flex items-center gap-2 border-t hairline pt-5 text-sm text-muted">
                {p.github ? (
                  <a
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-medium text-text transition-colors hover:text-accent-ink"
                  >
                    <GithubIcon />
                    <span dir="ltr">{p.github.replace(/^https:\/\/github\.com\//, "")}</span>
                  </a>
                ) : (
                  <>
                    <Lock className="h-4 w-4" aria-hidden="true" />
                    {ui.privateCode}
                  </>
                )}
              </p>
            </Reveal>
          </aside>
        </div>

        <nav className="mt-24 grid gap-4 border-t hairline pt-10 sm:grid-cols-2" aria-label={ui.allProjects}>
          <Link
            href={`/projects/${prev.slug}`}
            className="card card-hover group p-6"
            data-cursor={ui.cursorView}
            onClick={() => trackEvent("project_open", { slug: prev.slug, source: "detail-nav" })}
          >
            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
              {ui.prevProject}
            </span>
            <span className="mt-3 block font-display text-xl font-semibold transition-colors group-hover:text-accent-ink">
              <Bidi text={prevTitle} />
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="card card-hover group p-6 text-end"
            data-cursor={ui.cursorView}
            onClick={() => trackEvent("project_open", { slug: next.slug, source: "detail-nav" })}
          >
            <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-muted rtl:tracking-normal">
              {ui.nextProject}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
            </span>
            <span className="mt-3 block font-display text-xl font-semibold transition-colors group-hover:text-accent-ink">
              <Bidi text={nextTitle} />
            </span>
          </Link>
        </nav>

        <ProjectCta />
        <Footer className="mt-16" />
      </div>
    </main>
  );
}

/** Closing call to action: a recruiter who has just read the proof can act on it right here. */
function ProjectCta() {
  const copy = useCopy();
  const { ui } = copy;
  const cv = useCvDownload();
  const copyEmail = useCopyEmail();

  return (
    <Reveal as="div" className="card relative mt-16 overflow-hidden p-6 sm:p-10 md:p-12">
      <div className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 -start-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden="true" />
      <div className="relative">
        <p className="eyebrow mb-4">{ui.projectCta.eyebrow}</p>
        <h2 className="max-w-2xl text-balance text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] rtl:leading-[1.3]">
          <Bidi text={ui.projectCta.title} />
        </h2>
        <p className="mt-4 max-w-xl text-pretty text-muted md:text-lg">{ui.projectCta.body}</p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/#contact" className="btn-primary group !px-6">
            {ui.projectCta.contact}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" aria-hidden="true" />
          </Link>
          <button type="button" onClick={() => void copyEmail()} className="btn-ghost !px-5" title={ui.copyEmail}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span dir="ltr">{CONTACT_EMAIL}</span>
            <span className="sr-only">— {ui.copyEmail}</span>
          </button>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("telegram_click")}
            className="btn-ghost !px-5"
            title={TELEGRAM_HANDLE}
          >
            <TelegramIcon /> {ui.telegramLabel}
          </a>
          <a href={cv.href} download onClick={cv.onClick} className="btn-ghost !px-5">
            <Download className="h-4 w-4" aria-hidden="true" />
            {copy.contactCvLabel}
          </a>
        </div>
      </div>
    </Reveal>
  );
}
