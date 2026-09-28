"use client";

import Link from "next/link";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { localizeProject, projects } from "@/lib/projects";
import { CONTACT_EMAIL, GITHUB_URL, LINKEDIN_URL, SITE_URL, TELEGRAM_HANDLE, TELEGRAM_URL } from "@/lib/ui-copy";
import { useCopy, useCvDownload, useDocumentTitle } from "@/lib/hooks";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Bidi } from "@/components/ui/primitives";

/** "https://github.com/kyan9400" → "github.com/kyan9400": readable on paper, still a link on screen. */
const bare = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-heading border-b pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink hairline rtl:tracking-normal print:text-[8pt]">
      {children}
    </h2>
  );
}

/**
 * /cv: a one-page CV in the current language, built from the same copy as the site (lib/copy.ts,
 * lib/ui-copy.ts, lib/projects.ts), so it never drifts from it. On screen it follows the site theme;
 * printed (globals.css, "Print") it is black on white A4 with the site chrome hidden.
 */
export function CvPage() {
  const copy = useCopy();
  const { ui } = copy;
  const t = ui.cv;
  const cv = useCvDownload();
  const locale = usePortfolioStore((s) => s.locale);
  const localeReady = usePortfolioStore((s) => s.localeReady);

  useDocumentTitle(localeReady ? `${t.metaTitle} — ${ui.meta.nameSuffix}` : null);

  const localized = projects.map((p) => localizeProject(p, locale));

  const contacts = [
    { label: ui.telegramLabel, value: TELEGRAM_HANDLE, href: TELEGRAM_URL },
    { label: ui.emailShort, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { label: copy.githubLabel, value: bare(GITHUB_URL), href: GITHUB_URL },
    { label: copy.linkedinLabel, value: bare(LINKEDIN_URL), href: LINKEDIN_URL },
    { label: t.portfolio, value: bare(SITE_URL), href: SITE_URL }
  ];

  return (
    <main className="cv-main pb-16 pt-28 md:pt-36 print:p-0">
      <div className="shell max-w-4xl print:max-w-none print:px-0">
        <div role="toolbar" aria-label={t.toolbarLabel} className="fade-in flex flex-wrap items-center gap-2.5 print:hidden">
          <Link href="/" className="btn-ghost group me-auto !min-h-[40px] text-[13px]">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" aria-hidden="true" />
            {copy.notFoundCta}
          </Link>
          <a href={cv.href} download type="application/pdf" onClick={cv.onClick} className="btn-solid !min-h-[40px] !px-4 text-[13px]">
            <Download className="h-4 w-4" aria-hidden="true" />
            {t.downloadPdf}
          </a>
          <button type="button" onClick={() => window.print()} className="btn-ghost !min-h-[40px] !px-4 text-[13px]">
            <Printer className="h-4 w-4" aria-hidden="true" />
            {t.print}
          </button>
        </div>

        <article className="cv-sheet fade-in mt-10 md:mt-12 print:mt-0" style={{ "--d": "80ms" } as React.CSSProperties}>
          <header className="border-b pb-6 hairline print:pb-2">
            <h1 className="text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] rtl:leading-[1.25] print:text-[22pt]">{copy.heroTitle}</h1>
            <p className="mt-2 text-pretty text-base font-medium text-text/85 md:text-lg print:mt-1 print:text-[11pt]">
              <Bidi text={copy.heroEyebrow} />
            </p>
            <p className="mt-1 text-sm text-muted print:text-[9pt]">
              <Bidi text={ui.availabilityLine} />
            </p>
            <h2 className="sr-only">{t.contacts}</h2>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm print:mt-1.5 print:gap-x-3.5 print:gap-y-0.5 print:text-[8.5pt]">
              {contacts.map((c) => (
                <li key={c.label} className="min-w-0">
                  <span className="text-muted">{c.label}: </span>
                  <a href={c.href} dir="ltr" className="break-all font-medium underline decoration-line/25 underline-offset-4 hover:text-accent-ink print:no-underline">
                    {c.value}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          <section className="mt-6 print:mt-2" aria-labelledby="cv-summary">
            <h2 id="cv-summary" className="sr-only">
              {t.summary}
            </h2>
            <p className="text-pretty leading-relaxed text-text/90 print:text-[9pt] print:leading-snug">
              <Bidi text={ui.heroIntro} />
            </p>
          </section>

          <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,1fr)_15rem] print:mt-3 print:grid-cols-[minmax(0,1fr)_50mm] print:gap-5">
            <div className="min-w-0 space-y-8 print:space-y-3">
              <section>
                <Heading>{t.experience}</Heading>
                <ol className="mt-4 space-y-5 print:mt-1.5 print:space-y-2">
                  {copy.experienceItems.map((item) => (
                    <li key={`${item.company}-${item.period}`} className="cv-block">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-base font-semibold leading-snug print:text-[10pt]">
                          <Bidi text={item.title} />
                          <span className="mx-1.5 font-normal text-muted">·</span>
                          <Bidi text={item.company} />
                        </h3>
                        <p className="font-mono text-[12px] tabular-nums text-muted print:text-[8.5pt]">{item.period}</p>
                      </div>
                      {item.location ? <p className="text-[13px] text-muted print:text-[8pt] print:leading-snug">{item.location}</p> : null}
                      <ul className="mt-2 space-y-1 print:mt-1 print:space-y-0.5">
                        {item.highlights.map((h) => (
                          <li key={h} className="flex gap-2.5 text-pretty text-sm leading-relaxed text-text/85 print:text-[8.5pt] print:leading-snug">
                            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-text/50" aria-hidden="true" />
                            <span>
                              <Bidi text={h} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <Heading>{t.projects}</Heading>
                <ul className="mt-4 space-y-2 print:mt-1.5 print:space-y-0.5">
                  {localized.map((p) => (
                    <li key={p.slug} className="cv-block text-sm leading-snug print:text-[8.5pt]">
                      <span className="font-semibold">
                        <Bidi text={p.title} />
                      </span>
                      <span className="text-muted">
                        {" — "}
                        <Bidi text={p.rolePurpose} />
                      </span>
                      {p.live ? (
                        // Screen only: on paper the portfolio link in the header covers it.
                        <span className="print:hidden">
                          {" · "}
                          <a href={p.live} dir="ltr" className="break-all text-muted underline decoration-line/25 underline-offset-4 hover:text-accent-ink print:no-underline">
                            {bare(p.live)}
                          </a>
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <Heading>{t.languages}</Heading>
                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm print:mt-1.5 print:gap-x-4 print:text-[8.5pt] print:leading-snug">
                  {copy.languages.map((l) => (
                    <li key={l.name}>
                      <span className="font-semibold">{l.name}</span>
                      <span className="text-muted"> — {l.level}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <aside className="min-w-0 space-y-8 print:space-y-3">
              <section>
                <Heading>{t.skills}</Heading>
                <dl className="mt-4 space-y-3 print:mt-1.5 print:space-y-1">
                  {copy.skillsGroups.map((g) => (
                    <div key={g.name} className="cv-block">
                      <dt className="text-sm font-semibold print:text-[8.5pt] print:leading-snug">{g.name}</dt>
                      <dd className="text-[13px] leading-relaxed text-muted print:text-[8pt] print:leading-snug">
                        <Bidi text={g.items.join(" · ")} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section>
                <Heading>{t.education}</Heading>
                <ul className="mt-4 space-y-3 print:mt-1.5 print:space-y-1">
                  {copy.education.map((e) => (
                    <li key={`${e.school}-${e.period}`} className="cv-block text-sm print:text-[8.5pt] print:leading-snug">
                      <p className="font-semibold leading-snug">
                        <Bidi text={e.degree} />
                      </p>
                      <p className="text-[13px] text-muted print:text-[8pt] print:leading-snug">
                        <Bidi text={e.school} />
                        {" · "}
                        <span className="whitespace-nowrap tabular-nums">{e.period}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <Heading>{t.certifications}</Heading>
                {/* Course titles are English proper names in every locale. */}
                <ul className="mt-4 space-y-2 rtl:text-right print:mt-1.5 print:space-y-0.5" dir="ltr" lang="en">
                  {copy.certifications.map((c) => (
                    <li key={c.name} className="cv-block text-[13px] leading-snug print:text-[8pt]">
                      <span className="font-medium">{c.name}</span>
                      {c.issuer || c.year ? <span className="text-muted"> — {[c.issuer, c.year].filter(Boolean).join(", ")}</span> : null}
                    </li>
                  ))}
                </ul>
              </section>

            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
