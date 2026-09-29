import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject, localizeProject } from "@/lib/projects";
import { SITE_URL } from "@/lib/ui-copy";
import { PERSON_ID, WEBSITE_ID, jsonLdHtml, localizedPageMetadata } from "@/lib/seo";
import { localePath, routeLocale } from "@/lib/i18n";
import type { Project } from "@/lib/projects";
import type { Locale } from "@/lib/types";
import { ProjectDetail } from "@/components/sections/ProjectDetail";

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

/** Every project is prerendered in every language; unknown slugs get the global 404 (app/global-not-found.tsx). */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!project) return { robots: { index: false } };
  const locale = routeLocale(lang);
  const p = localizeProject(project, locale);
  // Images come from ./opengraph-image.tsx (Next also reuses it for the Twitter card).
  const base = localizedPageMetadata(locale, `/projects/${project.slug}`, {
    title: p.title,
    description: p.description,
    type: "article",
    siteImage: false
  });
  return { ...base, openGraph: { ...base.openGraph, type: "article", authors: [SITE_URL] } };
}

/**
 * Structured data for a case study, in the page's language: open-source projects are
 * SoftwareSourceCode with their public repository; work projects (private code) are a CreativeWork.
 * Only facts from lib/projects.ts.
 */
function projectJsonLd(project: Project, locale: Locale) {
  const p = localizeProject(project, locale);
  const url = `${SITE_URL}${localePath(locale, `/projects/${project.slug}`)}`;
  const common = {
    "@context": "https://schema.org",
    "@id": `${url}#work`,
    name: p.title,
    description: p.description,
    url,
    image: `${SITE_URL}${project.image}`,
    inLanguage: locale,
    keywords: project.tech.join(", "),
    author: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
    ...(project.year ? { dateCreated: String(project.year) } : {})
  };
  if (project.kind === "open-source" && project.github) {
    return {
      ...common,
      "@type": "SoftwareSourceCode",
      codeRepository: project.github
    };
  }
  return { ...common, "@type": "CreativeWork" };
}

export default async function ProjectPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = routeLocale(lang);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(projectJsonLd(projects[index], locale))} />
      <ProjectDetail project={projects[index]} prev={prev} next={next} />
    </>
  );
}
