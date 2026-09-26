import { getGithubRepos } from "@/lib/github";
import { projects } from "@/lib/projects";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { SignatureCase } from "@/components/sections/SignatureCase";
import { Projects } from "@/components/sections/Projects";
import { GithubRepos } from "@/components/sections/GithubRepos";
import { Skills } from "@/components/sections/Skills";
import { Experience } from "@/components/sections/Experience";
import { Contact } from "@/components/sections/Contact";

export const revalidate = 3600;

export default async function HomePage() {
  const github = await getGithubRepos();

  return (
    <main>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Projects projects={projects} />
      <SignatureCase />
      <GithubRepos repos={github.ok ? github.repos : null} />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
