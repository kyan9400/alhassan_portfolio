import type { Metadata } from "next";
import { getCuratedRepos } from "@/lib/github";
import { SITE_URL } from "@/lib/ui-copy";
import { languageAlternates } from "@/lib/seo";
import { ProjectArchive } from "@/components/sections/ProjectArchive";

const title = "Project archive";
const description =
  "Every project by Alhassan Alfarran in one table — work, freelance and open source, plus curated GitHub repositories — with year, context, stack and links.";
const path = "/projects/archive";

// Server metadata is English; the client component keeps the tab title in the visitor's language.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path, languages: languageAlternates(path) },
  openGraph: {
    title: `${title} — Alhassan Alfarran`,
    description,
    url: `${SITE_URL}${path}`,
    type: "website",
    siteName: "Alhassan Alfarran",
    locale: "en_US"
  },
  twitter: { card: "summary_large_image", title: `${title} — Alhassan Alfarran`, description }
};

/** Static: the curated repository data is baked in, so the archive needs no GitHub request. */
export default function ProjectArchivePage() {
  return <ProjectArchive repos={getCuratedRepos()} />;
}
