"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
import { ArrowUpRight, Atom, AudioLines, Building2, CarFront, Coffee, Dna, Globe, Rocket, Sparkles, Sprout, Watch, type LucideIcon } from "lucide-react";
import type { Web3dIcon, Web3dSiteView } from "@/lib/web3d";
import { useCopy } from "@/lib/hooks";
import { Bidi, GithubIcon, Reveal, SectionHeader } from "@/components/ui/primitives";

/**
 * Cards shown before "Show all": fewer on phones. As in the GitHub section, the phone limit is CSS
 * (`max-sm:hidden`), so the server HTML is already right on every screen.
 */
const INITIAL_DESKTOP = 6;
const INITIAL_MOBILE = 3;
const MOBILE_QUERY = "(max-width: 639px)";
/** Same breakpoint as Tailwind's `sm`: below it the card shows the phone capture (art direction in <picture>). */
const DESKTOP_MEDIA = "(min-width: 640px)";
/** Card image sizes from `sm` up (the grid columns), and the phone layout where the card spans the screen. */
const DESKTOP_SIZES = "(min-width: 1152px) 360px, (min-width: 1024px) 33vw, 50vw";
/** The same for a single image used at every width: full width below `sm`. */
const ALL_SIZES = "(min-width: 1152px) 360px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";
const DESKTOP_IMAGE_CLASS =
  "object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05] motion-reduce:transition-none";

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

/**
 * Header art while a site has no screenshot (or it fails to load): a dark "scene" lit in the site's own
 * two colours, with its glyph on a grid floor. Always dark, like the 3D scenes themselves, so the white
 * label keeps its contrast in both themes. Decorative: the name is in the card title.
 */
function SceneArt({ site }: { site: Web3dSiteView }) {
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
 * The card header image. With both captures it is a <picture>: the phone capture below `sm` (where the card
 * spans a phone screen, so a phone layout reads better than a shrunken desktop page) and the desktop capture
 * from `sm` up. Both srcsets come from next/image (getImageProps), so they stay optimized and lazy.
 * With only one capture it is a plain next/image of that file.
 */
function CardImage({ site, desktop, mobile, alt, onError }: { site: Web3dSiteView; desktop: boolean; mobile: boolean; alt: string; onError: () => void }) {
  if (!(desktop && mobile)) {
    return (
      <Image
        src={desktop ? site.screenshot : site.mobileScreenshot}
        alt={alt}
        fill
        sizes={ALL_SIZES}
        onError={onError}
        className={DESKTOP_IMAGE_CLASS}
      />
    );
  }
  const {
    props: { srcSet: desktopSrcSet }
  } = getImageProps({ src: site.screenshot, alt, fill: true, sizes: DESKTOP_SIZES });
  const {
    props: { srcSet: mobileSrcSet, ...rest }
  } = getImageProps({ src: site.mobileScreenshot, alt, fill: true, sizes: "100vw" });
  return (
    <picture>
      <source media={DESKTOP_MEDIA} srcSet={desktopSrcSet} sizes={DESKTOP_SIZES} />
      {/* next/image's own art-direction pattern: the optimized srcset is spread onto a plain <img>. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from `rest` */}
      <img {...rest} srcSet={mobileSrcSet} onError={onError} className={DESKTOP_IMAGE_CLASS} />
    </picture>
  );
}

/**
 * From `sm` up, the phone capture as a small phone frame over the corner of the desktop capture: shows the
 * responsive layout without a second card. Decorative (the card already has its image alt and title) and
 * light: ~80 px wide, lazy, and simply not rendered if the file fails to load.
 */
function PhoneFrame({ site }: { site: Web3dSiteView }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <span
      className="pointer-events-none absolute bottom-3 start-3 hidden aspect-[390/844] w-[18%] max-w-[84px] overflow-hidden rounded-[12px] border-[3px] border-[#101014] bg-[#07070c] shadow-[0_12px_30px_-8px_rgb(0_0_0/0.7)] ring-1 ring-white/15 transition-transform duration-700 ease-out group-hover:-translate-y-1 motion-reduce:transition-none sm:block"
      aria-hidden="true"
    >
      <Image src={site.mobileScreenshot} alt="" fill sizes="84px" onError={() => setFailed(true)} className="object-cover object-top" />
    </span>
  );
}

/**
 * A site card. Like the repository cards, the title link is stretched over the whole card: it opens the
 * live site once it is deployed and the repository until then. The GitHub link sits above that overlay
 * as a sibling, so no interactive element is nested in another.
 */
/**
 * Hover preview: a short muted clip of the live site (public/web3d-video/<slug>.mp4) fades in over the screenshot.
 * Only for a mouse/trackpad (hovering is a deliberate request to see it move); with preload="none" nothing is downloaded until the first hover,
 * so the section costs no extra bytes on load. A missing clip simply never shows.
 */
function HoverVideo({ slug }: { slug: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    const card = video?.closest<HTMLElement>(".group");
    if (!video || !card) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const enter = () => {
      video.play().then(() => setPlaying(true)).catch(() => {});
    };
    const leave = () => {
      video.pause();
      setPlaying(false);
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    };
  }, []);

  if (failed) return null;
  return (
    <video
      ref={ref}
      src={`/web3d-video/${slug}.mp4`}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      onError={() => setFailed(true)}
      className={`pointer-events-none absolute inset-0 hidden h-full w-full object-cover object-top transition-opacity duration-500 sm:block ${playing ? "opacity-100" : "opacity-0"}`}
    />
  );
}

function SiteCard({ site, screenshot, mobileScreenshot }: { site: Web3dSiteView; screenshot: boolean; mobileScreenshot: boolean }) {
  const copy = useCopy();
  const { ui } = copy;
  const [imageFailed, setImageFailed] = useState(false);
  const live = site.liveStatus === "live";
  const primaryHref = live ? site.live : site.repo;

  return (
    <>
      {/* A taller header on phones when it shows the phone capture, so more than its top bar is visible. */}
      <div
        className={`relative overflow-hidden border-b hairline bg-[#07070c] sm:aspect-[16/10] ${mobileScreenshot && !imageFailed ? "aspect-[4/3]" : "aspect-[2/1]"}`}
      >
        {(screenshot || mobileScreenshot) && !imageFailed ? (
          <>
            <CardImage
              site={site}
              desktop={screenshot}
              mobile={mobileScreenshot}
              alt={`${site.name} ${ui.previewAlt}`}
              onError={() => setImageFailed(true)}
            />
            {screenshot ? <HoverVideo slug={site.slug} /> : null}
            {screenshot && mobileScreenshot ? <PhoneFrame site={site} /> : null}
          </>
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
          <Bidi text={site.kind} />
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
          <Bidi text={site.description} />
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
 * `mobileScreenshots` does the same for the phone captures under public/repo-screenshots/mobile/.
 */
export function Web3d({
  sites: siteList,
  stack,
  index,
  screenshots,
  mobileScreenshots
}: {
  /** The catalogue in the page language (kind/description resolved on the server). */
  sites: Web3dSiteView[];
  stack: readonly string[];
  /** Visual section number ("06"). */
  index?: string;
  screenshots: string[];
  mobileScreenshots: string[];
}) {
  const copy = useCopy();
  const t = copy.web3d;
  const [expanded, setExpanded] = useState(false);

  // Sites with a screenshot first (a stable sort keeps the data order within each group).
  const sites = useMemo(() => {
    const has = new Set(screenshots);
    const hasMobile = new Set(mobileScreenshots);
    return [...siteList]
      .sort((a, b) => Number(has.has(b.slug)) - Number(has.has(a.slug)))
      .map((site) => ({ site, screenshot: has.has(site.slug), mobileScreenshot: hasMobile.has(site.slug) }));
  }, [siteList, screenshots, mobileScreenshots]);

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
    <section id="web-3d" className="section cv-auto [--cv-h:2750px] sm:[--cv-h:2420px] lg:[--cv-h:1870px]">
      <div className="shell">
        <SectionHeader index={index} eyebrow={t.eyebrow} title={t.title} description={t.description} />

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
            {stack.map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>
        </Reveal>

        <ul ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ site, screenshot, mobileScreenshot }, index) => (
            <Reveal
              as="li"
              key={site.slug}
              delay={(index % 3) * 0.05}
              y={16}
              className={`card card-hover group flex flex-col overflow-hidden ${!expanded && index >= INITIAL_MOBILE ? "max-sm:hidden" : ""}`}
            >
              <SiteCard site={site} screenshot={screenshot} mobileScreenshot={mobileScreenshot} />
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
