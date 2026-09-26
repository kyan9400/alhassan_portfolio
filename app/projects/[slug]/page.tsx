import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import { SITE_URL } from "@/lib/ui-copy";
import { ProjectDetail } from "@/components/sections/ProjectDetail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Every project is prerendered; unknown slugs 404 instead of rendering on demand. */
export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };

  const path = `/projects/${project.slug}`;
  // Page-level openGraph/twitter replace the layout's objects, so they carry the full title.
  // Images come from ./opengraph-image.tsx (Next also reuses it for the Twitter card).
  const fullTitle = `${project.title} — Alhassan Alfarran`;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description: project.description,
      url: `${SITE_URL}${path}`,
      type: "article",
      siteName: "Alhassan Alfarran",
      locale: "en_US",
      authors: [SITE_URL]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: project.description
    }
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return <ProjectDetail project={projects[index]} prev={prev} next={next} />;
}
