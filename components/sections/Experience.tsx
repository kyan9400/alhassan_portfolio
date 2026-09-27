"use client";

import { useId, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import type { ExperienceItem } from "@/lib/copy";
import { Bidi, Reveal, SectionHeader } from "@/components/ui/primitives";

/** Bullets shown per role before "More". */
const BULLETS_SHOWN = 2;

export function Experience() {
  const copy = useCopy();

  return (
    <section id="experience" className="section cv-auto [--cv-h:2900px] md:[--cv-h:2200px] lg:[--cv-h:1800px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.experienceEyebrow} title={copy.experienceTitle} description={copy.experienceDescription} />

        <ol className="border-b hairline">
          {copy.experienceItems.map((item, i) => (
            <Role key={`${item.company}-${item.period}`} item={item} current={i === 0} />
          ))}
        </ol>

        <Education />
      </div>
    </section>
  );
}

/**
 * One role as typography, not a box: [dates | company + role | what I did], hairlines between roles.
 * The current role gets an accent start border and a "Currently" label.
 */
function Role({ item, current }: { item: ExperienceItem; current: boolean }) {
  const copy = useCopy();
  const { ui } = copy;
  const listId = useId();
  const [open, setOpen] = useState(false);
  const extra = item.highlights.length - BULLETS_SHOWN;

  return (
    <Reveal
      as="li"
      y={20}
      className={`grid gap-x-10 gap-y-4 border-s-2 border-t py-7 ps-4 [border-top-color:rgb(var(--line)/var(--line-alpha))] md:grid-cols-[9.5rem_minmax(0,1fr)] md:py-10 md:ps-6 lg:grid-cols-[9.5rem_minmax(0,0.75fr)_minmax(0,1.25fr)] ${
        current ? "border-s-accent" : "border-s-transparent"
      }`}
    >
      {/* When */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 md:flex-col md:items-start">
        <p className="font-mono text-[13px] tabular-nums text-muted">{item.period}</p>
        {current ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent-ink rtl:tracking-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden="true" />
            {ui.currentlyLabel}
          </span>
        ) : null}
      </div>

      {/* Where and as what */}
      <div className="min-w-0">
        <h3 className="text-[1.625rem] font-semibold leading-tight md:text-[1.75rem]">
          <Bidi text={item.company} />
        </h3>
        <p className="mt-1.5 font-medium leading-snug text-text/85">
          <Bidi text={item.title} />
        </p>
        {item.location ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.location}
          </p>
        ) : null}
        {/* Desktop: the one-line summary sits under the role, so the bullets column stays short. */}
        <p className="mt-4 hidden text-pretty text-[15px] leading-relaxed text-muted lg:block">
          <Bidi text={item.summary} />
        </p>
      </div>

      {/* What I did */}
      <div className="min-w-0 md:col-start-2 lg:col-start-auto">
        <p className="mb-4 text-pretty text-[15px] leading-relaxed text-muted lg:hidden">
          <Bidi text={item.summary} />
        </p>
        <ul id={listId} className="space-y-2.5">
          {item.highlights.map((h, j) => (
            <li
              key={h}
              // A class, not the hidden attribute: `flex` would override the attribute's display: none.
              className={`${!open && j >= BULLETS_SHOWN ? "hidden" : "flex"} gap-3 text-pretty text-[15px] leading-relaxed text-text/85`}
            >
              <span className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-text/40" aria-hidden="true" />
              <span>
                <Bidi text={h} />
              </span>
            </li>
          ))}
        </ul>
        {extra > 0 ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={listId}
            className="mt-2 inline-flex min-h-[40px] items-center gap-1 text-sm font-semibold text-accent-ink transition-colors hover:text-text"
          >
            {open ? ui.showLess : `${ui.showMore} (+${extra})`}
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>
        ) : null}
        {/* The stack as one quiet line instead of a row of pills. */}
        <p className="mt-4 font-mono text-[12px] leading-relaxed text-muted rtl:text-right" dir="ltr">
          <span className="sr-only">{ui.stackLabel}: </span>
          {item.stack.join(" · ")}
        </p>
      </div>
    </Reveal>
  );
}

/** Split "Course — Provider" so the provider can sit on a quieter second line. */
function splitCertification(cert: string) {
  const at = cert.lastIndexOf(" — ");
  return at === -1 ? { title: cert, provider: "" } : { title: cert.slice(0, at), provider: cert.slice(at + 3) };
}

/** Education and certifications as a plain two-column list. */
function Education() {
  const copy = useCopy();
  const certs = copy.certifications;

  return (
    <div className="mt-16 grid gap-12 md:mt-20 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted rtl:tracking-normal">
          {copy.ui.educationTitle}
        </h3>
        <ul className="mt-5 divide-y divide-line/10 border-y hairline">
          {copy.education.map((e) => (
            <li key={`${e.school}-${e.period}`} className="grid gap-1 py-4 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-4">
              <p className="font-mono text-[13px] tabular-nums text-muted">{e.period}</p>
              <div className="min-w-0">
                <p className="text-pretty font-semibold leading-snug">
                  <Bidi text={e.degree} />
                </p>
                <p className="mt-1 text-sm text-muted">
                  <Bidi text={e.school} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      {certs.length > 0 ? (
        <Reveal delay={0.06}>
          <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted rtl:tracking-normal">
            {copy.ui.certificationsTitle}
          </h3>
          {/* Course titles are English proper names in every locale; in the Arabic page they align to its start edge. */}
          <ul className="mt-5 divide-y divide-line/10 border-y hairline rtl:text-right" dir="ltr" lang="en">
            {certs.map((cert) => {
              const { title, provider } = splitCertification(cert);
              return (
                <li key={cert} className="py-3">
                  <span className="block text-sm font-medium leading-snug">{title}</span>
                  {provider ? <span className="mt-0.5 block text-xs text-muted">{provider}</span> : null}
                </li>
              );
            })}
          </ul>
        </Reveal>
      ) : null}
    </div>
  );
}
