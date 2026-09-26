import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import { ProjectDetail } from "@/components/sections/ProjectDetail";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { title: project.title, description: project.description }
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
