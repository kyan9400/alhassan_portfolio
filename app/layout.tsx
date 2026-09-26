import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Sans_Arabic } from "next/font/google";
import { AppChrome } from "@/components/app/AppChrome";
import { SITE_URL, GITHUB_URL, LINKEDIN_URL } from "@/lib/ui-copy";
import "./globals.css";

const body = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-body", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap"
});

const title = "Alhassan Alfarran — Software & DevOps Engineer (Web & AI Systems)";
const description =
  "Software and DevOps engineer building web products, AI-powered systems, and reliable delivery pipelines. Available for remote, freelance, and contract work.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s — Alhassan Alfarran" },
  description,
  authors: [{ name: "Alhassan Alfarran", url: SITE_URL }],
  keywords: ["Alhassan Alfarran", "Software Engineer", "DevOps", "Next.js", "AI", "RAG", "Portfolio"],
  alternates: { canonical: "/" },
  openGraph: { title, description, url: SITE_URL, siteName: "Alhassan Alfarran", type: "website" },
  twitter: { card: "summary_large_image", title, description }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" }
  ]
};

// Dark by default; respects a stored choice. Runs before paint to avoid a flash.
const themeScript = `(function(){try{var s=localStorage.getItem("theme");if(s!=="light"){document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})();`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alhassan Alfarran",
  jobTitle: "Software & DevOps Engineer",
  url: SITE_URL,
  image: `${SITE_URL}/images/alhassan.webp`,
  address: { "@type": "PostalAddress", addressLocality: "Moscow", addressCountry: "RU" },
  knowsLanguage: ["en", "ru", "ar"],
  sameAs: [GITHUB_URL, LINKEDIN_URL]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${arabic.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
