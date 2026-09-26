import { Suspense } from "react";
import { getGithubRepos } from "@/lib/github";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { SignatureCase } from "@/components/sections/SignatureCase";
import { Skills } from "@/components/sections/Skills";
import { Services } from "@/components/sections/Services";
import { GithubRepos } from "@/components/sections/GithubRepos";
import { Contact } from "@/components/sections/Contact";

export const revalidate = 3600;

/**
 * Story order: who I am → where I've worked → what I built there → proof in depth → toolkit →
 * how I can help → more code → get in touch.
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
        <Contact />
      </Suspense>
    </main>
  );
}
