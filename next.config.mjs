import path from "node:path";
import createMDX from "@next/mdx";
import { fileURLToPath } from "node:url";

/** This project's own folder. A package-lock.json higher up (e.g. in the home folder) must not become the workspace root. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Baseline security headers for every route (pages, API, metadata images and /public files).
 * A full Content-Security-Policy is intentionally out of scope: the CSP below only forbids
 * framing (clickjacking), which is safe to enforce without nonces or a script allowlist.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Stop `next dev` from writing agent instruction files into the project root.
  // Keeps the tree deterministic; the bundled docs stay at node_modules/next/dist/docs.
  agentRules: false,
  turbopack: { root: projectRoot },
  // app/global-not-found.tsx: the 404 for unmatched URLs. The root layout sits under app/[lang]/, so
  // there is no single layout above every route to compose a 404 from.
  experimental: { globalNotFound: true },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90]
    // SVG diagrams (/images/projects/*.svg): no `dangerouslyAllowSVG`. next/image's default loader
    // detects a `.svg` src and serves the file as-is (unoptimized), so the optimizer never
    // rasterises or proxies SVG. Passing `unoptimized` on those <Image>s is optional but explicit.
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // lib/notes.ts reads content/notes/*.mdx with fs (frontmatter for the list, RSS, sitemap and the
  // NOTES_ENABLED flag). Pages that revalidate at runtime must still find those files on the server.
  outputFileTracingIncludes: { "/*": ["./content/notes/**/*.mdx"] }
};

/*
 * GitHub Pages copy (`npm run build:pages`, scripts/build-pages.mjs sets GH_PAGES=1): a static export
 * served from https://kyan9400.github.io/alhassan_portfolio/ for networks that block vercel.app.
 * Nothing here applies to the default (Vercel) build. Pages has no server: no proxy, API routes,
 * image optimizer or response headers, so lib/base-path.ts tells the code it is in this build
 * (NEXT_PUBLIC_STATIC_EXPORT) and which prefix public/ files need (NEXT_PUBLIC_BASE_PATH).
 */
const BASE_PATH = "/alhassan_portfolio";

/** No server on Pages: response headers and output file tracing do not apply to a static export. */
const { headers: _headers, outputFileTracingIncludes: _tracing, ...staticConfig } = nextConfig;

/** @type {import('next').NextConfig} */
const pagesConfig = {
  ...staticConfig,
  output: "export",
  // "/" exists only here, as app/(pages-root)/page.pages.tsx: on Vercel proxy.ts redirects it.
  pageExtensions: ["pages.tsx", "tsx", "ts", "jsx", "js"],
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  images: { unoptimized: true },
  trailingSlash: true,
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH, NEXT_PUBLIC_STATIC_EXPORT: "1" }
};

/*
 * MDX for /notes (official @next/mdx setup; see mdx-components.tsx). The posts are imported from
 * content/notes, not used as routes, so pageExtensions stays default. remark-frontmatter parses the
 * YAML block at the top of each post so it is not rendered; lib/notes.ts reads the same block.
 * Plugins are passed by name so they also work under Turbopack.
 */
const withMDX = createMDX({
  options: { remarkPlugins: ["remark-frontmatter"] }
});

export default withMDX(process.env.GH_PAGES === "1" ? pagesConfig : nextConfig);
