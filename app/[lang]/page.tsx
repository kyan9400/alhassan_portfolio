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
import { Recommendations } from "@/components/sections/Recommendations";
import { Contact } from "@/components/sections/Contact";
import { MobileContactBar } from "@/components/app/MobileContactBar";
import { SectionRail } from "@/components/app/SectionRail";
import { localeAlternates } from "@/lib/seo";
import { routeLocale } from "@/lib/i18n";

type PageParams = { params: Promise<{ lang: string }> };

/** Title, description and Open Graph come from the layout; this adds the canonical and hreflang alternates. */
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { lang } = await params;
  return { alternates: localeAlternates(routeLocale(lang), "/") };
}

export const revalidate = 3600;

/**
 * Story order: who I am → ask my CV anything → where I've worked → what I built there → proof in depth → toolkit →
 * how I can help → more code → what colleagues say (only once there is a recommendation) → get in touch.
 *
 * Every section below the fold is its own Suspense boundary. Nothing suspends (the HTML is complete),
 * but React then hydrates each boundary as a separate unit and yields to the browser in between,
 * instead of hydrating the whole page in one long task. A section someone interacts with first is
 * hydrated first.
 */
export default async function HomePage() {
  const github = await getGithubRepos();

  return (
    <main>
      <Hero />
      <Marquee />
      <Suspense>
        <About />
      </Suspense>
      <Suspense>
        <AskCv />
      </Suspense>
      <Suspense>
        <Experience />
      </Suspense>
      <Suspense>
        <Projects />
      </Suspense>
      <Suspense>
        <SignatureCase />
      </Suspense>
      <Suspense>
        <Skills />
      </Suspense>
      <Suspense>
        <Services />
      </Suspense>
      <Suspense>
        <GithubRepos repos={github.ok ? github.repos : []} />
      </Suspense>
      <Suspense>
        <Recommendations />
      </Suspense>
      <Suspense>
        <Contact />
      </Suspense>
      <MobileContactBar />
      <SectionRail />
    </main>
  );
}
