"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Lightbulb, ShieldAlert } from "lucide-react";
import type { Project } from "@/lib/projects";
import { useCopy } from "@/lib/hooks";
import { Reveal, GithubIcon } from "@/components/ui/primitives";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ProjectDetail({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  const copy = useCopy();
  const paragraphs = project.longDescription.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  const caseCards = [
    { icon: ShieldAlert, label: copy.projectProblemLabel, text: project.problem, tone: "text-rose-500" },
    { icon: Lightbulb, label: copy.projectSolutionLabel, text: project.solution, tone: "text-accent" },
    { icon: CheckCircle2, label: copy.projectResultLabel, text: project.result, tone: "text-emerald-500" }
  ].filter((c) => c.text);

  return (
    <main className="pb-24 pt-28 md:pt-36">
      <div className="shell max-w-5xl">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/#projects" className="btn-ghost group !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
            {copy.projectBackLabel}
          </Link>
        </motion.div>

        <header className="mt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE }} className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{copy.projectsBadge}</span>
            {project.kindBadge ? <span className="tag !text-accent-ink">{project.kindBadge}</span> : null}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
            className="mt-5 text-balance text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[1.02]"
          >
            {project.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.15 }} className="mt-4 text-sm uppercase tracking-[0.18em] text-muted">
            {project.rolePurpose}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 }} className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
            {project.description}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }} className="mt-8 flex flex-wrap gap-3">
            {project.live ? (
              <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary">
                {copy.projectLiveDemo}
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            <a href={project.github} target="_blank" rel="noreferrer" className="btn-ghost">
              <GithubIcon />
              {copy.projectViewGithubLabel}
            </a>
          </motion.div>
        </header>

        {project.image ? (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
            className="card relative mt-14 aspect-[16/9] overflow-hidden md:aspect-[21/9]"
          >
            <Image src={project.image} alt={`${project.title} preview`} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
          </motion.div>
        ) : null}

        {caseCards.length ? (
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {caseCards.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.08} className="card p-6">
                <c.icon className={`h-5 w-5 ${c.tone}`} aria-hidden="true" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{c.label}</p>
                <p className="mt-2 leading-relaxed">{c.text}</p>
              </Reveal>
            ))}
          </div>
        ) : null}

        <div className="mt-20 grid gap-14 lg:grid-cols-[1fr_300px]">
          <div>
            <Reveal>
              <h2 className="eyebrow mb-6">{copy.projectWhatItDoesLabel}</h2>
              <ul className="space-y-4">
                {project.whatItDoes.map((line) => (
                  <li key={line} className="flex gap-3 text-lg leading-relaxed">
                    <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" aria-hidden="true" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
            <div className="mt-14 space-y-6">
              {paragraphs.map((p, i) => (
                <Reveal key={i}>
                  <p className="text-pretty text-[17px] leading-[1.8] text-text/85">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="card p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{copy.projectTechStackLabel}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li key={t} className="tag !text-[13px] !text-text/85">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </aside>
        </div>

        <nav className="mt-24 grid gap-4 border-t hairline pt-10 sm:grid-cols-2" aria-label={copy.ui.allProjects}>
          <Link href={`/projects/${prev.slug}`} className="card card-hover group p-6" data-cursor={copy.ui.cursorView}>
            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 rtl:rotate-180" aria-hidden="true" />
              {copy.ui.prevProject}
            </span>
            <span className="mt-3 block font-display text-xl font-semibold group-hover:text-accent-ink">{prev.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}`} className="card card-hover group p-6 text-end" data-cursor={copy.ui.cursorView}>
            <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.2em] text-muted">
              {copy.ui.nextProject}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 rtl:rotate-180" aria-hidden="true" />
            </span>
            <span className="mt-3 block font-display text-xl font-semibold group-hover:text-accent-ink">{next.title}</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
