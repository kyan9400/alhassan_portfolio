import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppChrome } from "@/components/app/AppChrome";
import { FONT_VARIABLES, PRE_PAINT_SCRIPT } from "@/lib/document";
import { SITE_URL, GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL, getCopy } from "@/lib/ui-copy";
import { PERSON_ID, WEBSITE_ID, jsonLdHtml } from "@/lib/seo";
import { NOTES_ENABLED } from "@/lib/notes-config";
import { LOCALES, OG_LOCALES, localeDir, localePath, routeLocale } from "@/lib/i18n";
import "../globals.css";

type LayoutParams = { params: Promise<{ lang: string }> };

/**
 * Every language is prerendered. Any other first segment (/de) is unmatched, so it gets the global 404
 * (app/global-not-found.tsx), like any other unknown URL.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

/**
 * Site-wide metadata in the page's language. Pages add their own title, description, canonical and
 * hreflang alternates (lib/seo.ts); the title here is the home page's and the template for the rest.
 */
export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const locale = routeLocale((await params).lang);
  const { homeTitle: title, homeDescription: description, nameSuffix } = getCopy(locale).ui.meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${nameSuffix}` },
    description,
    applicationName: "Alhassan Alfarran",
    authors: [{ name: "Alhassan Alfarran", url: SITE_URL }],
    creator: "Alhassan Alfarran",
    keywords: [
      "Alhassan Alfarran",
      "Альхассан Альфарран",
      "Full-stack Developer",
      "Full-stack разработчик",
      "Python-разработчик",
      "Software Engineer",
      "Python Developer",
      "React",
      "TypeScript",
      "Node.js",
      "FastAPI",
      "RAG",
      "AI systems",
      "Moscow"
    ],
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localePath(locale, "/")}`,
      siteName: "Alhassan Alfarran",
      type: "profile",
      firstName: "Alhassan",
      lastName: "Alfarran",
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALES[l])
    },
    twitter: { card: "summary_large_image", title, description }
  };
}

// One color: the site is dark by default whatever the OS scheme (see prePaintScript), so an
// OS-driven light value would paint an off-white browser bar over a dark page on first visit.
export const viewport: Viewport = {
  themeColor: "#0a0a0f"
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: SITE_URL,
      name: "Alhassan Alfarran",
      inLanguage: ["en", "ru", "ar"],
      publisher: { "@id": PERSON_ID }
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Alhassan Alfarran",
      alternateName: ["Альхассан Альфарран"],
      jobTitle: "Full-Stack & Python Developer",
      url: SITE_URL,
      image: `${SITE_URL}/images/alhassan.webp`,
      worksFor: { "@type": "Organization", name: "Elektroservis", alternateName: "Электросервис" },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "National University of Science and Technology MISIS", alternateName: "НИТУ МИСИС" },
        { "@type": "CollegeOrUniversity", name: "Ural Federal University", alternateName: "УрФУ" }
      ],
      address: { "@type": "PostalAddress", addressLocality: "Moscow", addressCountry: "RU" },
      knowsLanguage: ["en", "ar", "ru"],
      knowsAbout: [
        "Web development",
        "React",
        "TypeScript",
        "Node.js",
        "Python",
        "FastAPI",
        "PostgreSQL",
        "MongoDB",
        "Retrieval-augmented generation",
        "Semantic search",
        "OCR",
        "Docker",
        "CI/CD"
      ],
      sameAs: [GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL]
    }
  ]
};

/** Root layout for one language (/en, /ru, /ar): <html lang dir> comes from the URL, on the server. */
export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode }> & LayoutParams) {
  const locale = routeLocale((await params).lang);
  return (
    <html
      lang={locale}
      dir={localeDir(locale)}
      suppressHydrationWarning
      className={FONT_VARIABLES}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_PAINT_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />
      </head>
      <body>
        <AppChrome locale={locale} notesEnabled={NOTES_ENABLED}>
          {children}
        </AppChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
