import path from "node:path";
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
  // Next 16.3's `next dev` writes AGENTS.md/CLAUDE.md into the project root when it detects a coding
  // agent. Keep the tree deterministic; the bundled docs stay at node_modules/next/dist/docs.
  agentRules: false,
  turbopack: { root: projectRoot },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90]
    // SVG diagrams (/images/projects/*.svg): no `dangerouslyAllowSVG`. next/image's default loader
    // detects a `.svg` src and serves the file as-is (unoptimized), so the optimizer never
    // rasterises or proxies SVG. Passing `unoptimized` on those <Image>s is optional but explicit.
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  }
};

export default nextConfig;
