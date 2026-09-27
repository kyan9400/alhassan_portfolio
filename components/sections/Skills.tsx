"use client";

import { useCopy } from "@/lib/hooks";
import { Bidi, Reveal, SectionHeader } from "@/components/ui/primitives";

/** Position of the "AI & Search" group in copy.skillsGroups (the same in every locale): set in accent ink. */
const HIGHLIGHT_GROUP = 2;

/** The stack as one index table: layer label in mono, tools as plain text, hairlines between rows. */
export function Skills() {
  const copy = useCopy();

  return (
    <section id="skills" className="section cv-auto [--cv-h:1150px] md:[--cv-h:850px] lg:[--cv-h:760px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.skillsEyebrow} title={copy.skillsTitle} description={copy.skillsDescription} />
        <Reveal>
          <dl className="border-b hairline">
            {copy.skillsGroups.map((group, i) => (
              <div
                key={group.name}
                className="grid gap-x-8 gap-y-1.5 border-t py-4 [border-top-color:rgb(var(--line)/var(--line-alpha))] sm:grid-cols-[12rem_minmax(0,1fr)] md:py-5 lg:grid-cols-[15rem_minmax(0,1fr)]"
              >
                <dt
                  className={`pt-0.5 font-mono text-[11px] font-medium uppercase tracking-[0.16em] rtl:tracking-normal ${
                    i === HIGHLIGHT_GROUP ? "text-accent-ink" : "text-muted"
                  }`}
                >
                  {group.name}
                </dt>
                <dd className={`text-pretty text-[15px] leading-relaxed md:text-base ${i === HIGHLIGHT_GROUP ? "text-accent-ink" : "text-text/90"}`}>
                  {group.items.map((item, j) => (
                    <span key={item}>
                      {j > 0 ? (
                        <span className="text-muted/60" aria-hidden="true">
                          {"\u00a0· "}
                        </span>
                      ) : null}
                      <span className="whitespace-nowrap">
                        <Bidi text={item} />
                      </span>
                      {j < group.items.length - 1 ? <span className="sr-only">, </span> : null}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
