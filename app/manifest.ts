import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alhassan Alfarran — Portfolio",
    short_name: "Alhassan",
    description:
      "Software Engineer — Web & AI Systems. React, TypeScript, Node.js, Python/FastAPI and RAG search. Based in Moscow.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#0a0a0f",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png", purpose: "any" }
    ]
  };
}
