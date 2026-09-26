import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppChrome } from "@/components/app/AppChrome";
import { SITE_URL, GITHUB_URL, LINKEDIN_URL, TELEGRAM_URL } from "@/lib/ui-copy";
import "./globals.css";

/*
 * Fonts. `subsets` only decides what gets a <link rel="preload">: next/font still self-hosts
 * every unicode-range Google serves (Inter's Cyrillic included), so Russian text keeps Inter
 * without making every first visit pay for Cyrillic and Arabic files up front.
 * Arabic is loaded on demand (preload: false) and only in the two weights the UI uses.
 */
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600"],
  variable: "--font-arabic",
  display: "swap",
  preload: false
});

const title = "Alhassan Alfarran — Software Engineer (Web & AI Systems)";
const description =
  "Software engineer building web platforms and AI systems: React, TypeScript, Node.js, Python/FastAPI, RAG and document search. Based in Moscow, available immediately.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s — Alhassan Alfarran" },
  description,
  applicationName: "Alhassan Alfarran",
  authors: [{ name: "Alhassan Alfarran", url: SITE_URL }],
  creator: "Alhassan Alfarran",
  keywords: [
    "Alhassan Alfarran",
    "Альхассан Альфарран",
    "Software Engineer",
    "Full-stack Developer",
    "Python Developer",
    "React",
    "TypeScript",
    "Node.js",
    "FastAPI",
    "RAG",
    "AI systems",
    "Moscow"
  ],
  alternates: { canonical: "/" },
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: "Alhassan Alfarran",
    type: "profile",
    firstName: "Alhassan",
    lastName: "Alfarran",
    locale: "en_US",
    alternateLocale: ["ru_RU", "ar_AR"]
  },
  twitter: { card: "summary_large_image", title, description }
};

// One color: the site is dark by default whatever the OS scheme (see prePaintScript), so an
// OS-driven light value would paint an off-white browser bar over a dark page on first visit.
export const viewport: Viewport = {
  themeColor: "#0a0a0f"
};

/*
 * Runs before first paint:
 * - js: marks that scripts run, so scroll-reveal content may start hidden (see globals.css);
 * - cv-all: a deep link (/#section) renders every section at once, for an exact landing (.cv-auto);
 * - theme: dark by default, respects a stored "light" choice (no flash);
 * - locale: a stored "ru"/"ar" choice sets <html lang/dir> immediately, so Arabic does not
 *   paint LTR and then flip to RTL after hydration (layout shift). The store in
 *   store/portfolioStore.ts writes the same "locale" key.
 */
const prePaintScript = `(function(){var d=document.documentElement;d.classList.add("js");if(location.hash)d.classList.add("cv-all");try{if(localStorage.getItem("theme")!=="light"){d.classList.add("dark")}var l=localStorage.getItem("locale");if(l==="ru"||l==="ar"){d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}}catch(e){d.classList.add("dark")}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Alhassan Alfarran",
      inLanguage: ["en", "ru", "ar"],
      publisher: { "@id": `${SITE_URL}/#person` }
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Alhassan Alfarran",
      alternateName: ["Альхассан Альфарран"],
      jobTitle: "Software Engineer — Web & AI Systems",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${arabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <AppChrome>{children}</AppChrome>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
