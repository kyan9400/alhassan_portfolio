/*
 * The GitHub Pages copy (`npm run build:pages`): a static export served under /alhassan_portfolio on
 * github.io, for networks that block vercel.app. next.config.mjs defines both values only in that
 * build, so on Vercel BASE_PATH is "" and STATIC_EXPORT is false: nothing below changes there.
 */

/** "/alhassan_portfolio" in the Pages build, "" on Vercel. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Where the Pages copy lives. Its metadataBase: relative metadata URLs (the Open Graph images) point
 * to this copy, which is reachable where vercel.app is not. Canonical and hreflang URLs stay on SITE_URL.
 */
export const PAGES_URL = `https://kyan9400.github.io${BASE_PATH}`;

/** True in the Pages build: no proxy, no API routes, no request headers. */
export const STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

/**
 * A site-absolute URL ("/cv/x.pdf", "/ru") under the base path, for plain <a>, <video> and next/image
 * with a string src (unoptimized), which do not add it. next/link and the router add it themselves.
 */
export function withBasePath(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
