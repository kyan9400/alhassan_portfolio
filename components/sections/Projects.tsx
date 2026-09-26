"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { useCopy } from "@/lib/hooks";
import { Reveal, SectionHeader, GithubIcon } from "@/components/ui/primitives";

function ProjectCard({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  const copy = useCopy();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <Reveal delay={index * 0.08} className={featured ? "lg:col-span-2" : ""}>
      <motion.article
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformPerspective: 1200 }}
        className="card card-hover group relative h-full overflow-hidden"
      >
        <Link href={`/projects/${project.slug}`} data-cursor={copy.ui.cursorView} className="block" aria-label={`${project.title} — ${copy.projectViewCaseStudy}`}>
          <div className={`relative overflow-hidden border-b hairline ${featured ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10]"}`}>
            {project.image ? (
              <Image
                src={project.image}
                alt=""
                fill
                sizes={featured ? "(min-width: 1024px) 1100px, 100vw" : "(min-width: 1024px) 550px, 100vw"}
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
            {project.kindBadge ? (
              <span className="absolute start-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                {project.kindBadge}
              </span>
            ) : null}
            <span className="absolute end-4 top-4 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-white text-black opacity-0 shadow-xl transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5 rtl:-scale-x-100" aria-hidden="true" />
            </span>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{project.rolePurpose}</p>
            <h3 className="mt-3 text-2xl font-semibold transition-colors group-hover:text-accent-ink md:text-3xl">{project.title}</h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{project.description}</p>

            {project.result ? (
              <p className="mt-5 flex gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
                <span className="font-semibold">{copy.projectResultLabel}:</span>
                <span>{project.result}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap gap-2 px-6 pb-6 md:px-8 md:pb-8">
          {project.live ? (
            <a href={project.live} target="_blank" rel="noreferrer" className="btn-primary !min-h-[40px] text-[13px]">
              {copy.projectLiveDemo}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : null}
          <a href={project.github} target="_blank" rel="noreferrer" className="btn-ghost !min-h-[40px] text-[13px]">
            <GithubIcon />
            {copy.projectViewGithubLabel}
          </a>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const copy = useCopy();

  return (
    <section id="projects" className="section">
      <div className="shell">
        <SectionHeader eyebrow={copy.projectsEyebrow} title={copy.projectsTitle} description={copy.projectsSubtitle} />
        {projects.length === 0 ? (
          <p className="card p-10 text-center text-muted">{copy.projectsEmpty}</p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} featured={i === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
