"use client";

import { useId, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Award, ChevronDown, GraduationCap, MapPin } from "lucide-react";
import { useCopy, trackPointer } from "@/lib/hooks";
import { useElementScrollProgress } from "@/lib/scroll";
import type { ExperienceItem } from "@/lib/copy";
import { Bidi, Reveal, SectionHeader } from "@/components/ui/primitives";

/** Certifications shown on phones before "Show more" (all of them from `sm` up). */
const CERTS_COLLAPSED = 4;

export function Experience() {
  const copy = useCopy();
  const trackRef = useRef<HTMLDivElement>(null);
  // The rail fills from when the track's top reaches 75% of the viewport until its end reaches 70%.
  const scrollYProgress = useElementScrollProgress(trackRef, 0.75, 0.7);
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" className="section cv-auto [--cv-h:3900px] md:[--cv-h:3300px] lg:[--cv-h:2700px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.experienceEyebrow} title={copy.experienceTitle} description={copy.experienceDescription} />

        <div ref={trackRef} className="relative">
          {/* Timeline rail along the start edge; the gradient fills it as you scroll. */}
          <div className="absolute bottom-6 start-[11px] top-6 w-px bg-line/10 md:start-[15px]" aria-hidden="true" />
          {/* Reduced motion: the CSS override shows the rail fully drawn (same markup on server and client). */}
          <motion.div
            className="absolute bottom-6 start-[11px] top-6 w-px origin-top bg-gradient-to-b from-violet-500 via-violet-400 to-cyan-400 shadow-[0_0_12px_rgb(var(--glow)/0.55)] motion-reduce:!transform-none md:start-[15px]"
            style={{ scaleY: progress }}
            aria-hidden="true"
          />

          <ol className="space-y-5 md:space-y-8">
            {copy.experienceItems.map((item, i) => (
              <TimelineRole
                key={`${item.company}-${item.period}`}
                item={item}
                current={i === 0}
                currentLabel={copy.ui.currentlyLabel}
                stackLabel={copy.ui.stackLabel}
              />
            ))}
          </ol>
        </div>

        <Education />
      </div>
    </section>
  );
}

function TimelineRole({
  item,
  current,
  currentLabel,
  stackLabel
}: {
  item: ExperienceItem;
  current: boolean;
  currentLabel: string;
  stackLabel: string;
}) {
  return (
    <Reveal as="li" y={28} className="relative ps-9 md:ps-16">
      {/* Node on the rail, lights up as it scrolls into view. */}
      <motion.span
        className="absolute start-[4px] top-8 flex h-[15px] w-[15px] md:start-[8px] md:top-10"
        initial={{ scale: 0.4, opacity: 0.3 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "0px 0px -35% 0px" }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        aria-hidden="true"
      >
        {current ? <span className="absolute inset-0 animate-ping rounded-full bg-violet-500/50" /> : null}
        <span className="relative h-full w-full rounded-full border-[3px] border-bg bg-gradient-to-br from-violet-500 to-cyan-400 shadow-[0_0_0_4px_rgb(var(--accent)/0.18)]" />
      </motion.span>

      <article
        className={`card spotlight card-hover overflow-hidden p-5 sm:p-6 md:p-8 ${
          current ? "border-accent/30 shadow-[0_1px_0_rgb(255_255_255/0.05)_inset,0_30px_80px_-40px_rgb(var(--glow)/0.65)]" : ""
        }`}
        onPointerMove={trackPointer}
      >
        {current ? (
          <span
            className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            aria-hidden="true"
          />
        ) : null}

        <div className="grid gap-5 md:grid-cols-[minmax(0,210px)_minmax(0,1fr)] md:gap-10 lg:grid-cols-[minmax(0,250px)_minmax(0,1fr)]">
          {/* Meta: when, where */}
          <div className="md:border-e md:border-line/10 md:pe-8">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-sm font-semibold tabular-nums text-accent-ink">{item.period}</p>
              {current ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                  {currentLabel}
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 text-2xl font-semibold leading-tight">
              <Bidi text={item.company} />
            </h3>
            {item.location ? (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {item.location}
              </p>
            ) : null}
          </div>

          {/* Role: what I did */}
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-snug md:text-xl">
              <Bidi text={item.title} />
            </p>
            <p className="mt-2 text-pretty text-[15px] leading-relaxed text-muted">
              <Bidi text={item.summary} />
            </p>

            <ul className="mt-5 space-y-2.5">
              {item.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-pretty text-[15px] leading-relaxed text-text/85">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" aria-hidden="true" />
                  <span>
                    <Bidi text={h} />
                  </span>
                </li>
              ))}
            </ul>

            {/* A real list (display: contents would drop its role and name in some browsers). */}
            <div className="mt-6 flex items-start gap-3">
              <span className="shrink-0 pt-[5px] text-[11px] font-semibold uppercase tracking-[0.2em] text-muted rtl:tracking-normal" aria-hidden="true">
                {stackLabel}
              </span>
              <ul className="flex min-w-0 flex-wrap gap-1.5" aria-label={stackLabel}>
                {item.stack.map((tech) => (
                  <li key={tech} className="tag" dir="ltr">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/** Split "Course — Provider" so the provider can sit on a quieter second line. */
function splitCertification(cert: string) {
  const at = cert.lastIndexOf(" — ");
  return at === -1 ? { title: cert, provider: "" } : { title: cert.slice(0, at), provider: cert.slice(at + 3) };
}

function Education() {
  const copy = useCopy();
  const listId = useId();
  const [showAll, setShowAll] = useState(false);
  const firstHiddenRef = useRef<HTMLLIElement>(null);
  const certs = copy.certifications;
  const hasHiddenCerts = certs.length > CERTS_COLLAPSED;

  // The button disappears once used, so hand focus to the first revealed item.
  const expand = () => {
    setShowAll(true);
    requestAnimationFrame(() => firstHiddenRef.current?.focus({ preventScroll: true }));
  };

  return (
    <div className="mt-16 md:mt-24">
      <Reveal>
        <h3 className="mb-5 flex items-center gap-3 text-xl font-semibold md:mb-6 md:text-2xl">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          {copy.ui.educationTitle}
        </h3>
      </Reveal>
      <ul className="grid gap-3 md:grid-cols-2 md:gap-4">
        {copy.education.map((e, i) => (
          <Reveal as="li" key={`${e.school}-${e.period}`} delay={i * 0.06} className="card spotlight card-hover p-5 md:p-7" onPointerMove={trackPointer}>
            <p className="font-display text-sm font-semibold tabular-nums text-accent-ink">{e.period}</p>
            <p className="mt-2 text-pretty text-lg font-semibold leading-snug md:text-xl">
              <Bidi text={e.degree} />
            </p>
            <p className="mt-1.5 text-sm text-muted">
              <Bidi text={e.school} />
            </p>
          </Reveal>
        ))}
      </ul>

      {certs.length > 0 ? (
        <div className="mt-12 md:mt-16">
          <Reveal>
            <h3 className="mb-5 flex items-center gap-3 text-xl font-semibold md:mb-6 md:text-2xl">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              {copy.ui.certificationsTitle}
            </h3>
          </Reveal>
          <Reveal className="card p-2 sm:p-4 md:p-5">
            {/* Course titles are English proper names in every locale. */}
            <ul id={listId} className="grid sm:grid-cols-2 sm:gap-x-4 lg:grid-cols-3" dir="ltr" lang="en">
              {certs.map((cert, i) => {
                const { title, provider } = splitCertification(cert);
                return (
                  <li
                    key={cert}
                    ref={i === CERTS_COLLAPSED ? firstHiddenRef : undefined}
                    tabIndex={i === CERTS_COLLAPSED ? -1 : undefined}
                    className={`flex gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-surface/60 ${
                      !showAll && i >= CERTS_COLLAPSED ? "max-sm:hidden" : ""
                    }`}
                  >
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-snug">{title}</span>
                      {provider ? <span className="mt-0.5 block text-xs text-muted">{provider}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ul>
            {hasHiddenCerts && !showAll ? (
              <button
                type="button"
                onClick={expand}
                aria-controls={listId}
                aria-expanded={false}
                className="mx-auto mt-1 flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-medium text-accent-ink sm:hidden"
              >
                {copy.ui.showAllCertifications} ({certs.length})
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </Reveal>
        </div>
      ) : null}
    </div>
  );
}
