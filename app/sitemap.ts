import type { MetadataRoute } from "next";
import { projects } from "@/lib/projects";
import { getPublishedNotes } from "@/lib/notes";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { SITE_URL } from "@/lib/ui-copy";
import { languageAlternates } from "@/lib/seo";

/** Absolute hreflang alternates for a translated page (same URL, `?lang=`; see lib/seo.ts). */
function alternates(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const languages = Object.fromEntries(Object.entries(languageAlternates(path)).map(([lang, href]) => [lang, href === "/" ? SITE_URL : `${SITE_URL}${href}`]));
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Notes are listed only once the section is live; drafts never (getPublishedNotes excludes them).
  const notes: MetadataRoute.Sitemap = NOTES_ENABLED
    ? [
        { url: `${SITE_URL}/notes`, changeFrequency: "weekly", priority: 0.6, alternates: alternates("/notes") },
        ...getPublishedNotes().map((n) => ({
          url: `${SITE_URL}/notes/${n.slug}`,
          lastModified: n.date,
          changeFrequency: "yearly" as const,
          priority: 0.5
        }))
      ]
    : [];

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1, alternates: alternates("/") },
    { url: `${SITE_URL}/cv`, changeFrequency: "monthly", priority: 0.8, alternates: alternates("/cv") },
    { url: `${SITE_URL}/projects/archive`, changeFrequency: "monthly", priority: 0.6, alternates: alternates("/projects/archive") },
    ...projects.map((p) => ({
      url: `${SITE_URL}/projects/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
      alternates: alternates(`/projects/${p.slug}`)
    })),
    ...notes
  ];
}
