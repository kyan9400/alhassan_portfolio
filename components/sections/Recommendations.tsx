"use client";

import { useCopy } from "@/lib/hooks";
import { Bidi, Reveal, SectionHeader, LinkedinIcon } from "@/components/ui/primitives";

/**
 * Recommendations from people I have worked with, driven by copy.recommendations.items (lib/copy.ts).
 * Renders nothing at all while the list is empty: no heading, no placeholder, no section id.
 * Quotes are hairline rows, like the skills table: the quote, then name · role, company.
 */
export function Recommendations() {
  const copy = useCopy();
  const { eyebrow, title, linkedinLabel, items } = copy.recommendations;
  if (items.length === 0) return null;

  return (
    <section id="recommendations" className="section">
      <div className="shell">
        <SectionHeader eyebrow={eyebrow} title={title} />
        <ul className="border-b hairline">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={`${item.name}-${i}`}
              delay={(i % 2) * 0.06}
              className="border-t py-7 [border-top-color:rgb(var(--line)/var(--line-alpha))] md:py-9"
            >
              <figure className="grid gap-x-10 gap-y-5 md:grid-cols-[minmax(0,1fr)_15rem]">
                <blockquote className="max-w-3xl text-pretty font-display text-lg leading-relaxed text-text/90 md:text-xl">
                  <p>
                    <Bidi text={item.quote} />
                  </p>
                </blockquote>
                <figcaption className="text-sm leading-snug">
                  <span className="flex items-center gap-2 font-semibold text-text">
                    <Bidi text={item.name} />
                    {item.linkedin ? (
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="-m-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:text-text"
                        aria-label={linkedinLabel.replace("{name}", item.name)}
                        title={linkedinLabel.replace("{name}", item.name)}
                      >
                        <LinkedinIcon className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-muted">
                    <Bidi text={item.role} />
                    {copy.dir === "rtl" ? "، " : ", "}
                    <Bidi text={item.company} />
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
