"use client";

import { useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Building2, ChevronDown, Lock } from "lucide-react";
import { localizeProject, projects, type Project } from "@/lib/projects";
import { trackEvent } from "@/lib/analytics";
import { trackPointer, useCopy, useLocale, useLocalePath } from "@/lib/hooks";
import { Bidi, Reveal, SectionHeader, GithubIcon } from "@/components/ui/primitives";
import { ArchitectureFlow } from "./ArchitectureFlow";

/** Faint blueprint grid behind the architecture flow, fading out toward the far corner. */
const GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgb(var(--line) / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line) / 0.06) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
  maskImage: "radial-gradient(ellipse at 35% 30%, black 20%, transparent 75%)",
  WebkitMaskImage: "radial-gradient(ellipse at 35% 30%, black 20%, transparent 75%)"
};

/**
 * One project card. The whole card opens the case study through a single "stretched" link (the
 * CTA's ::after covers the card), so there are no nested interactive elements: Live demo and GitHub
 * are sibling links raised above that overlay. Nothing between the CTA and the <article> may be
 * positioned or transformed, or the overlay would shrink to that box.
 */
function ProjectCard({ project, index, featured, collapsible = false }: { project: Project; index: number; featured: boolean; collapsible?: boolean }) {
  const copy = useCopy();
  const lp = useLocalePath();
  const { ui } = copy;
  const titleId = useId();
  const detailsId = useId();
  // Phones (<640px) only: a collapsible card starts as a compact row (title, one line, links; work
  // projects keep their role line) and a "Show details" toggle reveals the rest. Pure CSS (max-sm:),
  // so the server HTML is the same everywhere and larger screens never change.
  const [open, setOpen] = useState(false);
  const compact = collapsible && !open;
  const phoneHidden = compact ? "max-sm:hidden" : "";
  const reduceMotion = useReducedMotion();

  const tilt = featured ? 3 : 6;
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [tilt, -tilt]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-tilt, tilt]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    trackPointer(e);
    if (reduceMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const flow = project.imageKind === "diagram" ? project.flow : undefined;

  // Work projects (private code) show their architecture as live HTML, readable at any width; the full
  // SVG diagram is on the case-study page. Open-source projects show a 16:10 screenshot of the live app.
  // Two diagram cards share a row from md, so their media areas get the same height there.
  const mediaFrame = flow
    ? featured
      ? "min-h-[15rem] md:min-h-[18rem] lg:min-h-0 lg:w-[57%] lg:border-b-0 lg:border-e"
      : "min-h-[15rem] md:min-h-[19rem] lg:aspect-[3/2] lg:min-h-0"
    : "aspect-[2/1] sm:aspect-[16/10]";

  return (
    <Reveal delay={(index % 2) * 0.08} className={featured ? "md:col-span-2" : ""}>
      <motion.article
        aria-labelledby={titleId}
        onPointerMove={onMove}
        onPointerLeave={reset}
        // Always the same style object: useReducedMotion() is null during SSR, so switching the style on
        // it would cause a hydration mismatch. Under reduced motion the values simply never move.
        style={{ rotateX, rotateY, transformPerspective: 1400 }}
        className={`card card-hover spotlight group flex h-full flex-col overflow-hidden ${featured ? "lg:flex-row" : ""}`}
      >
        <div className={`relative flex shrink-0 overflow-hidden border-b hairline ${flow ? "items-center bg-surface/40" : "bg-surface"} ${mediaFrame} ${phoneHidden}`}>
          {flow ? (
            <>
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_0%_0%,rgb(var(--glow)/0.16),transparent_60%),radial-gradient(80%_70%_at_100%_100%,rgb(var(--accent-2)/0.12),transparent_65%)]"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-0" style={GRID_STYLE} aria-hidden="true" />
              <div
                className={`relative w-full px-5 pb-6 pt-16 sm:px-6 ${featured ? "flex flex-col justify-center self-stretch md:pb-8 md:pt-16 lg:px-7" : ""}`}
                aria-hidden="true"
              >
                <ArchitectureFlow stages={flow} featured={featured} />
              </div>
              <span className="absolute start-4 top-4 inline-flex max-w-[calc(100%-5rem)] items-center gap-1.5 rounded-full border border-line/10 bg-card/85 px-3 py-1 text-[11px] font-medium text-text shadow-sm backdrop-blur-md">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                <span className="truncate">
                  {ui.workProject}
                  {project.company ? (
                    <>
                      {" · "}
                      <Bidi text={project.company} />
                    </>
                  ) : null}
                </span>
              </span>
            </>
          ) : (
            <>
              <Image
                src={project.image}
                alt=""
                fill
                unoptimized={project.image.endsWith(".svg")}
                sizes={featured ? "(min-width: 1024px) 640px, (min-width: 768px) 90vw, 100vw" : "(min-width: 1152px) 552px, (min-width: 768px) 50vw, 100vw"}
                className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/25 to-transparent" aria-hidden="true" />
            </>
          )}

          <span
            className="absolute end-4 top-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden="true"
          >
            <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" />
          </span>
        </div>

        <div id={detailsId} className={`flex flex-1 flex-col p-5 sm:p-6 md:p-8 ${featured ? "lg:p-10" : ""}`}>
          <p className={`text-balance text-xs font-medium uppercase tracking-[0.14em] text-muted rtl:tracking-normal ${project.kind === "work" ? "" : phoneHidden}`}>
            <Bidi text={project.rolePurpose} />
          </p>
          <div className={`mt-3 flex items-start justify-between gap-3 ${compact && project.kind !== "work" ? "max-sm:mt-0" : ""}`}>
            <h4
              id={titleId}
              className={`font-display font-semibold leading-tight tracking-tight transition-colors group-hover:text-accent-ink rtl:tracking-normal ${
                featured ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.75rem]"
              } ${compact ? "max-sm:text-xl" : ""}`}
            >
              <Bidi text={project.title} />
            </h4>
            {collapsible ? (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={detailsId}
                onClick={() => setOpen((v) => !v)}
                className="relative z-10 -me-2 -mt-2 inline-flex min-h-[40px] shrink-0 items-center gap-1 rounded-full px-2 text-[13px] font-medium text-muted transition hover:text-text sm:hidden"
              >
                {open ? ui.hideDetails : ui.showDetails}
                <ChevronDown className={`h-4 w-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <p className={`mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted ${compact ? "max-sm:mt-1.5 max-sm:line-clamp-1 max-sm:text-sm" : ""}`}>
            <Bidi text={project.description} />
          </p>

          {project.result ? (
            <p className={`mt-5 border-s-2 border-emerald-500/50 ps-3.5 text-sm leading-relaxed text-text/85 ${phoneHidden}`}>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">{copy.projectResultLabels[project.resultLabel ?? "result"]}:</span>{" "}
              <Bidi text={project.result} />
            </p>
          ) : null}

          {/* The stack as one quiet mono line (no pill row); phones skip it (it is on the case-study page). */}
          <p className="mt-5 font-mono text-[12px] leading-relaxed text-muted max-sm:hidden rtl:text-right" dir="ltr">
            <span className="sr-only">{copy.projectTechStackLabel}: </span>
            {project.tech.join(" · ")}
          </p>

          <div className={`mt-auto flex flex-wrap items-center gap-2.5 pt-6 md:pt-7 ${compact ? "max-sm:gap-x-2 max-sm:pt-3" : ""}`}>
            <Link
              href={lp(`/projects/${project.slug}`)}
              data-cursor={ui.cursorView}
              onClick={() => trackEvent("project_open", { slug: project.slug, source: "card" })}
              className={`text-link me-2 min-h-[40px] text-sm ${compact ? "max-sm:me-1" : ""} after:absolute after:inset-0 after:rounded-3xl after:content-[''] group-hover:decoration-current`}
            >
              {ui.caseStudyCta}
              <span className="sr-only">
                {" — "}
                {project.title}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </Link>

            {project.live ? (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className={`btn-ghost z-10 !min-h-[40px] !px-4 text-[13px] ${compact ? "max-sm:!min-h-[36px] max-sm:!px-3 max-sm:text-[12px]" : ""}`}>
                {copy.projectLiveDemo}
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
              </a>
            ) : null}

            {project.github ? (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-ghost z-10 !min-h-[40px] !px-4 text-[13px] ${compact ? "max-sm:!min-h-[36px] max-sm:!px-3 max-sm:text-[12px]" : ""}`}
                aria-label={`${copy.projectViewGithubLabel}: ${project.title}`}
              >
                <GithubIcon />
                {copy.projectViewGithubLabel}
              </a>
            ) : (
              <span className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-dashed border-line/20 px-3.5 text-[12px] font-medium text-muted ${compact ? "max-sm:min-h-[36px] max-sm:px-3" : ""}`}>
                <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                {project.codeNote === "client" ? ui.privateCodeClient : ui.privateCode}
              </span>
            )}

          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

function GroupHeading({ title, count }: { title: string; count: number }) {
  return (
    <Reveal className="mb-6 flex items-center gap-4">
      <h3 className="shrink-0 font-sans text-[13px] font-semibold uppercase tracking-[0.2em] text-text rtl:tracking-normal">{title}</h3>
      <span className="tag tabular-nums" dir="ltr">
        {String(count).padStart(2, "0")}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-line/15 to-transparent rtl:bg-gradient-to-l" aria-hidden="true" />
    </Reveal>
  );
}

/** "Full project archive →": shared with the GitHub section. */
export function ArchiveLink({ className = "mt-8 sm:mt-12 md:mt-14" }: { className?: string }) {
  const { ui } = useCopy();
  const lp = useLocalePath();
  return (
    <p className={`flex justify-end ${className}`}>
      <Link href={lp("/projects/archive")} className="text-link group min-h-[44px] text-sm">
        {ui.archive.linkLabel}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
      </Link>
    </p>
  );
}

/** Reads the catalog directly: it is already in the client bundle, so it isn't passed (and serialized) as a prop. */
export function Projects() {
  const copy = useCopy();
  const locale = useLocale();
  const localized = projects.map((p) => localizeProject(p, locale));
  const work = localized.filter((p) => p.kind === "work");
  const openSource = localized.filter((p) => p.kind === "open-source");

  return (
    <section id="projects" className="section cv-auto [--cv-h:3000px] sm:[--cv-h:6400px] md:[--cv-h:4000px] lg:[--cv-h:3600px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={copy.projectsSubtitle} />

        {localized.length === 0 ? (
          <p className="card p-10 text-center text-muted">{copy.projectsEmpty}</p>
        ) : (
          <div className="space-y-12 sm:space-y-16 md:space-y-20">
            {work.length ? (
              <div>
                <GroupHeading title={copy.ui.workProjectsTitle} count={work.length} />
                <div className="grid gap-6 max-sm:gap-3 md:grid-cols-2">
                  {work.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} index={i} featured={i === 0} collapsible={i > 0} />
                  ))}
                </div>
              </div>
            ) : null}

            {openSource.length ? (
              <div>
                <GroupHeading title={copy.ui.openSourceTitle} count={openSource.length} />
                <div className="grid gap-6 max-sm:gap-3 md:grid-cols-2">
                  {openSource.map((p, i) => (
                    <ProjectCard key={p.slug} project={p} index={i} featured={false} collapsible />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        <ArchiveLink />
      </div>
    </section>
  );
}
