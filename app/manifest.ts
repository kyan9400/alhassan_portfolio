import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";

/** Built once at build time (also required by the static GitHub Pages export). */
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alhassan Alfarran — Portfolio",
    short_name: "Alhassan",
    description:
      "Full-Stack & Python Developer — Web & AI Systems. React, TypeScript, Node.js, Python/FastAPI and RAG search. Based in Moscow.",
    id: "/",
    lang: "en",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      { src: withBasePath("/icon.svg"), sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: withBasePath("/apple-icon.png"), sizes: "180x180", type: "image/png", purpose: "any" }
    ]
  };
}
