import type { Metadata } from "next";
import { getCuratedRepos } from "@/lib/github";
import { getCopy } from "@/lib/ui-copy";
import { localizedPageMetadata } from "@/lib/seo";
import { routeLocale } from "@/lib/i18n";
import { ProjectArchive } from "@/components/sections/ProjectArchive";

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const locale = routeLocale((await params).lang);
  const { archive } = getCopy(locale).ui;
  return localizedPageMetadata(locale, "/projects/archive", { title: archive.metaTitle, description: archive.description });
}

/** Static: the curated repository data is baked in, so the archive needs no GitHub request. */
export default function ProjectArchivePage() {
  return <ProjectArchive repos={getCuratedRepos()} />;
}
