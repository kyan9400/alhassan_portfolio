import { Suspense } from "react";
import type { Metadata } from "next";
import { getGithubRepos } from "@/lib/github";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { AskCv } from "@/components/sections/AskCv";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { SignatureCase } from "@/components/sections/SignatureCase";
import { Skills } from "@/components/sections/Skills";
import { Services } from "@/components/sections/Services";
import { GithubRepos } from "@/components/sections/GithubRepos";
import { Web3d } from "@/components/sections/Web3d";
import { Recommendations } from "@/components/sections/Recommendations";
import { Contact } from "@/components/sections/Contact";
import { MobileContactBar } from "@/components/app/MobileContactBar";
import { SectionRail } from "@/components/app/SectionRail";
import { localeAlternates } from "@/lib/seo";
import { localePath, routeLocale } from "@/lib/i18n";
import { WEB3D_SITES, WEB3D_STACK, type Web3dSiteView } from "@/lib/web3d";
import { localizeProject, projects } from "@/lib/projects";
import { typographAr, typographRu } from "@/lib/typograph";
import { PERSON_ID, WEBSITE_ID, jsonLdHtml } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { getCopy } from "@/lib/ui-copy";
import type { Locale } from "@/lib/types";
import { existingRepoScreenshot } from "@/lib/repoScreenshot";

type PageParams = { params: Promise<{ lang: string }> };

/** Title, description and Open Graph come from the layout; this adds the canonical and hreflang alternates. */
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: localeAlternates(routeLocale(lang), "/") };
}

export const revalidate = 3600;

const typograph: Record<Locale, (text: string) => string> = { en: (t) => t, ru: typographRu, ar: typographAr };

/**
 * Story order: who I am → ask my CV anything → where I've worked → what I built there → proof in depth → toolkit →
 * how I can help → real-time 3D sites → more code → what colleagues say (only once there is a recommendation) → get in touch.
 *
 * Every section below the fold is its own Suspense boundary. Nothing suspends (the HTML is complete),
 * but React then hydrates each boundary as a separate unit and yields to the browser in between,
 * instead of hydrating the whole page in one long task. A section someone interacts with first is
 * hydrated first.
 */
export default async function HomePage({ params }: PageParams) {
  const locale = routeLocale((await params).lang);
  const github = await getGithubRepos();
  // Localized here so the client bundle carries only the page language (not all three).
  const localizedProjects = projects.map((p) => localizeProject(p, locale));
  const fix = typograph[locale];
  const web3dSites: Web3dSiteView[] = WEB3D_SITES.map((site) => ({
    ...site,
    kind: fix(site.kind[locale]),
    description: fix(site.description[locale])
  }));
  // Visual section numbers ("01", "02", …) in page order; Recommendations only counts when it renders.
  const numbered = ["about", "experience", "projects", "skills", "services", "web3d", "github"];
  if (getCopy(locale).recommendations.items.length > 0) numbered.push("recommendations");
  numbered.push("contact");
  const idx = (key: string) => String(numbered.indexOf(key) + 1).padStart(2, "0");
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${SITE_URL}${localePath(locale, "/")}`,
    inLanguage: locale,
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID }
  };
  // 3D sites whose screenshot is committed (the others render a placeholder until it is added).
  const web3dScreenshots = WEB3D_SITES.filter((site) => existingRepoScreenshot(site.screenshot)).map((site) => site.slug);
  // Same for the phone captures (public/repo-screenshots/mobile/): cards without one keep the desktop capture on phones.
  const web3dMobileScreenshots = WEB3D_SITES.filter((site) => existingRepoScreenshot(site.mobileScreenshot)).map((site) => site.slug);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(profileJsonLd)} />
      <Hero />
      <Marquee />
      <Suspense>
        <About index={idx("about")} />
      </Suspense>
      <Suspense>
        <AskCv />
      </Suspense>
      <Suspense>
        <Experience index={idx("experience")} />
      </Suspense>
      <Suspense>
        <Projects projects={localizedProjects} index={idx("projects")} />
      </Suspense>
      <Suspense>
        <SignatureCase />
      </Suspense>
      <Suspense>
        <Skills index={idx("skills")} />
      </Suspense>
      <Suspense>
        <Services index={idx("services")} />
      </Suspense>
      <Suspense>
        <Web3d index={idx("web3d")} sites={web3dSites} stack={WEB3D_STACK} screenshots={web3dScreenshots} mobileScreenshots={web3dMobileScreenshots} />
      </Suspense>
      <Suspense>
        <GithubRepos index={idx("github")} repos={github.ok ? github.repos : []} />
      </Suspense>
      <Suspense>
        <Recommendations index={idx("recommendations")} />
      </Suspense>
      <Suspense>
        <Contact index={idx("contact")} />
      </Suspense>
      <MobileContactBar />
      <SectionRail />
    </main>
  );
}
