"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Atom, AudioLines, Building2, CarFront, Coffee, Dna, Globe, Rocket, Sparkles, Sprout, Watch, type LucideIcon } from "lucide-react";
import { WEB3D_SITES, WEB3D_STACK, type Web3dIcon, type Web3dSite } from "@/lib/web3d";
import { typographAr, typographRu } from "@/lib/typograph";
import { useCopy, useLocale } from "@/lib/hooks";
import { Bidi, GithubIcon, Reveal, SectionHeader } from "@/components/ui/primitives";
import type { Locale } from "@/lib/types";

/**
 * Cards shown before "Show all": fewer on phones. As in the GitHub section, the phone limit is CSS
 * (`max-sm:hidden`), so the server HTML is already right on every screen.
 */
const INITIAL_DESKTOP = 6;
const INITIAL_MOBILE = 3;
const MOBILE_QUERY = "(max-width: 639px)";

const ICONS: Record<Web3dIcon, LucideIcon> = {
  towers: Sprout,
  coffee: Coffee,
  sparkles: Sparkles,
  orb: Atom,
  building: Building2,
  watch: Watch,
  rocket: Rocket,
  globe: Globe,
  audio: AudioLines,
  dna: Dna,
  car: CarFront
};

/** A receding grid floor under the placeholder glyph: a hint of a 3D stage, drawn in CSS only. */
const FLOOR_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(rgb(255 255 255 / 0.14) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.14) 1px, transparent 1px)",
  backgroundSize: "36px 36px",
  transform: "perspective(320px) rotateX(62deg)",
  transformOrigin: "50% 100%",
  maskImage: "linear-gradient(to top, black 10%, transparent 85%)",
  WebkitMaskImage: "linear-gradient(to top, black 10%, transparent 85%)"
};

const typograph: Record<Locale, (text: string) => string> = { en: (t) => t, ru: typographRu, ar: typographAr };

/**
 * Header art while a site has no screenshot (or it fails to load): a dark "scene" lit in the site's own
 * two colours, with its glyph on a grid floor. Always dark, like the 3D scenes themselves, so the white
 * label keeps its contrast in both themes. Decorative: the name is in the card title.
 */
function SceneArt({ site }: { site: Web3dSite }) {
  const Icon = ICONS[site.icon];
  const [glow, rim] = site.palette;
  return (
    <div className="absolute inset-0 bg-[#07070c]" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${glow}59, transparent 55%), radial-gradient(circle at 85% 95%, ${rim}4d, transparent 50%)`
        }}
      />
      <div className="absolute -inset-x-1/2 bottom-0 h-3/5" style={FLOOR_STYLE} />
      <span
        className="absolute left-1/2 top-[42%] flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm transition-transform duration-700 ease-out group-hover:scale-110 motion-reduce:transition-none sm:h-20 sm:w-20"
        style={{ boxShadow: `0 0 60px -10px ${glow}, inset 0 1px 0 rgb(255 255 255 / 0.15)` }}
      >
        <Icon className="h-7 w-7 text-white sm:h-8 sm:w-8" strokeWidth={1.5} />
      </span>
      <p className="absolute inset-x-5 bottom-4 truncate font-mono text-[12px] text-white/80">
        <bdi>kyan9400 / {site.slug}</bdi>
      </p>
    </div>
  );
}

/**
 * A site card. Like the repository cards, the title link is stretched over the whole card: it opens the
 * live site once it is deployed and the repository until then. The GitHub link sits above that overlay
 * as a sibling, so no interactive element is nested in another.
 */
function SiteCard({ site, screenshot }: { site: Web3dSite; screenshot: boolean }) {
  const copy = useCopy();
  const { ui } = copy;
  const locale = useLocale();
  const [imageFailed, setImageFailed] = useState(false);
  const live = site.liveStatus === "live";
  const primaryHref = live ? site.live : site.repo;
  const fix = typograph[locale];

  return (
    <>
      <div className="relative aspect-[2/1] overflow-hidden border-b hairline bg-[#07070c] sm:aspect-[16/10]">
        {screenshot && !imageFailed ? (
          <Image
            src={site.screenshot}
            alt={`${site.name} ${ui.previewAlt}`}
            fill
            sizes="(min-width: 1152px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            onError={() => setImageFailed(true)}
            className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
          />
        ) : (
          <SceneArt site={site} />
        )}
        <span
          className={`absolute end-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur rtl:tracking-normal ${
            live ? "text-emerald-300" : "text-amber-200"
          }`}
        >
          <span
            className={`inline-flex h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400 shadow-[0_0_6px_rgb(52_211_153/0.9)]" : "bg-amber-300"}`}
            aria-hidden="true"
          />
          {live ? ui.liveBadge : copy.web3d.soonBadge}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-accent-ink rtl:tracking-normal">
          <Bidi text={fix(site.kind[locale])} />
        </p>
        <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug transition-colors group-hover:text-accent-ink">
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor={ui.cursorOpen}
            className="after:absolute after:inset-0 after:rounded-3xl after:content-['']"
          >
            <bdi>{site.name}</bdi>
            <span className="sr-only"> ({live ? ui.liveBadge : `${copy.web3d.soonBadge}, ${copy.projectViewGithubLabel}`})</span>
          </a>
        </h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
          <Bidi text={fix(site.description[locale])} />
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-muted">
          {live ? (
            <span className="inline-flex items-center gap-1 font-medium text-text transition-colors group-hover:text-accent-ink" aria-hidden="true">
              {copy.web3d.openSite}
              <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
            </span>
          ) : (
            <span />
          )}
          {live ? (
            <a
              href={site.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${copy.projectViewGithubLabel}: ${site.name}`}
              className="relative z-10 inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border hairline px-3 font-medium transition hover:border-accent/40 hover:text-text"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              {copy.projectViewGithubLabel}
            </a>
          ) : (
            // The whole card already opens the repository; this is only the visual cue.
            <span
              className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border hairline px-3 font-medium transition group-hover:border-accent/40 group-hover:text-text"
              aria-hidden="true"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              {copy.projectViewGithubLabel}
              <ArrowUpRight className="h-3 w-3 rtl:-scale-x-100" />
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * "3D web experiences": real-time 3D sites (lib/web3d.ts). `screenshots` lists the slugs whose capture is
 * committed under public/repo-screenshots/ (checked on the server); the others get a placeholder.
 */
export function Web3d({ screenshots }: { screenshots: string[] }) {
  const copy = useCopy();
  const t = copy.web3d;
  const [expanded, setExpanded] = useState(false);

  // Sites with a screenshot first (a stable sort keeps the data order within each group).
  const sites = useMemo(() => {
    const has = new Set(screenshots);
    return [...WEB3D_SITES].sort((a, b) => Number(has.has(b.slug)) - Number(has.has(a.slug))).map((site) => ({ site, screenshot: has.has(site.slug) }));
  }, [screenshots]);

  const shown = expanded ? sites : sites.slice(0, INITIAL_DESKTOP);
  const remainingDesktop = sites.length - shown.length;
  const remainingMobile = expanded ? 0 : Math.max(0, sites.length - INITIAL_MOBILE);

  // "Show all" disappears once used, so keyboard focus moves to the first newly shown card.
  const gridRef = useRef<HTMLUListElement>(null);
  const focusIndex = useRef<number | null>(null);
  const expand = () => {
    focusIndex.current = window.matchMedia(MOBILE_QUERY).matches ? INITIAL_MOBILE : shown.length;
    setExpanded(true);
  };
  useEffect(() => {
    if (!expanded || focusIndex.current === null) return;
    const index = focusIndex.current;
    focusIndex.current = null;
    gridRef.current?.querySelectorAll<HTMLAnchorElement>("h3 a")[index]?.focus();
  }, [expanded]);

  return (
    <section id="web-3d" className="section cv-auto [--cv-h:2300px] sm:[--cv-h:2200px] lg:[--cv-h:1700px]">
      <div className="shell">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

        {/* Four performance points as one hairline strip: 2 × 2 from sm, a single row from lg. */}
        <Reveal>
          <ul aria-label={t.principlesLabel} className="grid gap-px overflow-hidden rounded-3xl border hairline bg-line/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {t.principles.map((p, i) => (
              <li key={p.title} className="bg-card p-5 md:p-6">
                <p className="flex items-baseline gap-3">
                  <span className="font-mono text-xs tabular-nums text-muted" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <span className="font-semibold leading-snug text-text">
                    <Bidi text={p.title} />
                  </span>
                </p>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
                  <Bidi text={p.body} />
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mb-8 mt-6 flex flex-wrap items-center gap-2 md:mb-10">
          <span className="me-1 text-[12px] font-semibold uppercase tracking-wider text-muted rtl:tracking-normal">{t.stackLabel}</span>
          <ul className="flex flex-wrap gap-1.5" dir="ltr">
            {WEB3D_STACK.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>

        <ul ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ site, screenshot }, index) => (
            <Reveal
              as="li"
              key={site.slug}
              delay={(index % 3) * 0.05}
              y={16}
              className={`card card-hover group flex flex-col overflow-hidden ${!expanded && index >= INITIAL_MOBILE ? "max-sm:hidden" : ""}`}
            >
              <SiteCard site={site} screenshot={screenshot} />
            </Reveal>
          ))}
        </ul>

        {remainingMobile > 0 ? (
          // Phones hide at least as many cards as larger screens; from sm the button only shows if cards are hidden there too.
          <div className={`mt-10 flex justify-center ${remainingDesktop > 0 ? "" : "sm:hidden"}`}>
            <button type="button" className="btn-ghost" onClick={expand}>
              {t.showAll}
              <span className="tabular-nums text-muted">{sites.length}</span>
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
