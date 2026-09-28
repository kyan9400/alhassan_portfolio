import type { Metadata } from "next";
import { SITE_URL } from "@/lib/ui-copy";
import { languageAlternates } from "@/lib/seo";
import { CvPage } from "@/components/sections/CvPage";

const title = "CV";
const description =
  "One-page CV of Alhassan Alfarran, Full-Stack & Python Developer in Moscow: experience, projects, skills, education, certifications and languages. Printable, with a PDF download.";

// Server metadata is English; the client component keeps the tab title in the visitor's language.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cv", languages: languageAlternates("/cv") },
  openGraph: {
    title: `${title} — Alhassan Alfarran`,
    description,
    url: `${SITE_URL}/cv`,
    type: "profile",
    siteName: "Alhassan Alfarran",
    locale: "en_US"
  },
  twitter: { card: "summary_large_image", title: `${title} — Alhassan Alfarran`, description }
};

export default function Cv() {
  return <CvPage />;
}
