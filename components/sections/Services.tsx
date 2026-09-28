"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useCopy } from "@/lib/hooks";
import { usePortfolioStore } from "@/store/portfolioStore";
import { trackEvent } from "@/lib/analytics";
import { Bidi, Reveal, SectionHeader } from "@/components/ui/primitives";
import { scrollToId } from "@/components/app/SmoothScroll";

/** Public repo that backs the multilingual / RTL service (an English + Arabic app). */
const SMART_PLATFORM_URL = "https://github.com/kyan9400/smart-platform";

/**
 * Where each service's "Example: …" link goes, in copy.servicesItems order: a case study, the
 * performance deep dive on this page, or a public repo.
 */
const PROOF_TARGETS: ({ kind: "project"; slug: string } | { kind: "section"; id: string } | { kind: "external"; href: string })[] = [
  { kind: "project", slug: "okkp-platform" },
  { kind: "project", slug: "document-intelligence-rag" },
  { kind: "project", slug: "ai-dashboard-suite" },
  { kind: "section", id: "case-study" },
  { kind: "external", href: SMART_PLATFORM_URL }
];

function ProofLink({ index, label }: { index: number; label: string }) {
  const target = PROOF_TARGETS[index];
  if (!target) return null;
  const className = "text-link text-sm";
  const text = <Bidi text={label} />;

  if (target.kind === "project") {
    return (
      <Link
        href={`/projects/${target.slug}`}
        onClick={() => trackEvent("project_open", { slug: target.slug, source: "services" })}
        className={className}
      >
        {text}
        <ArrowRight className="h-4 w-4 shrink-0 rtl:rotate-180" aria-hidden="true" />
      </Link>
    );
  }
  if (target.kind === "section") {
    return (
      <a
        href={`#${target.id}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToId(target.id);
        }}
        className={className}
      >
        {text}
        <ArrowRight className="h-4 w-4 shrink-0 rotate-90" aria-hidden="true" />
      </a>
    );
  }
  return (
    <a href={target.href} target="_blank" rel="noopener noreferrer" className={className}>
      {text}
      <ArrowUpRight className="h-4 w-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
    </a>
  );
}

export function Services() {
  const copy = useCopy();
  const setContactReason = usePortfolioStore((s) => s.setContactReason);

  const discuss = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Contact reads this and preselects "Freelance project" in its form.
    setContactReason("freelance");
    scrollToId("contact");
  };

  return (
    <section id="services" className="section cv-auto [--cv-h:1700px] md:[--cv-h:1250px] lg:[--cv-h:1100px]">
      <div className="shell">
        <SectionHeader eyebrow={copy.servicesEyebrow} title={copy.servicesTitle} description={copy.availableBody} />

        {/* Full-width rows with hairlines: number, service, one line, and the proof on the end side (under the text below lg). */}
        <ol className="border-b hairline">
          {copy.servicesItems.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              delay={Math.min(i, 3) * 0.05}
              y={16}
              className="group relative grid grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 gap-y-2 border-t py-6 ps-4 max-sm:items-baseline sm:gap-x-8 [border-top-color:rgb(var(--line)/var(--line-alpha))] before:absolute before:inset-y-0 before:start-0 before:w-0.5 before:origin-top before:scale-y-0 before:bg-accent before:transition-transform before:duration-300 before:content-[''] hover:before:scale-y-100 focus-within:before:scale-y-100 sm:grid-cols-[2.5rem_minmax(0,1fr)] md:py-7 md:ps-5 lg:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,17rem)] lg:items-baseline"
            >
              <span className="font-mono text-sm tabular-nums text-muted" aria-hidden="true">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-[1.5rem] font-semibold leading-tight md:text-[1.75rem]">
                  <Bidi text={s.title} />
                </h3>
                <p className="mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted">
                  <Bidi text={s.description} />
                </p>
              </div>
              <div className="col-start-2 lg:col-start-auto lg:justify-self-end lg:text-end">
                <ProofLink index={i} label={s.proof} />
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-10">
          <a href="#contact" onClick={discuss} className="btn-solid group !px-6">
            {copy.servicesCta}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
