"use client";

import { Fragment } from "react";
import { useCopy } from "@/lib/hooks";
import { Bidi } from "@/components/ui/primitives";

/**
 * Where I've worked and studied, as quiet wordmarks: the names only, no skills, no motion.
 * (Kept under its old name so the page composition does not change.)
 */
export function Marquee() {
  const copy = useCopy();

  return (
    <section aria-labelledby="proof-strip-label" className="border-y hairline py-6 md:py-7">
      <div className="shell flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
        <p
          id="proof-strip-label"
          className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted rtl:tracking-normal"
        >
          {copy.proofStripLabel}
        </p>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-display text-base font-semibold text-muted md:text-lg">
          {copy.proofStripItems.map((name, i) => (
            <Fragment key={name}>
              {i > 0 ? (
                <li aria-hidden="true" className="text-line/25">
                  ·
                </li>
              ) : null}
              <li className="whitespace-nowrap">
                <Bidi text={name} />
              </li>
            </Fragment>
          ))}
        </ul>
      </div>
    </section>
  );
}
