# alhassan-portfolio

Source of [alhassan-portfolio-sigma.vercel.app](https://alhassan-portfolio-sigma.vercel.app) — the portfolio of Alhassan Alfarran, Full-Stack & Python Developer (Web & AI Systems) in Moscow.

A trilingual (English / Russian / Arabic with RTL) single-page portfolio with project case studies, a curated GitHub showcase and a contact form.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 3** with theme tokens in `app/globals.css` (dark by default, light variant)
- **Framer Motion**, **Lenis** (smooth scroll), **lucide-react**, **zustand** (locale / UI state)
- `next/og` for Open Graph images, `next/font` for self-hosted fonts
- **Vercel Analytics** + **Speed Insights**; contact email via the **Resend** HTTP API

## Structure

```
app/                  routes, root layout, metadata (OG images, sitemap, robots), error pages
app/api/contact/      contact form endpoint (validation, spam checks, Resend)
app/projects/[slug]/  statically generated case-study pages
components/app/       chrome: navbar, command palette, cursor, background, toasts
components/sections/  home page sections and the project detail view
lib/copy.ts           long-form copy (en / ru / ar)
lib/ui-copy.ts        UI strings and site-wide constants (URLs, email)
lib/projects.ts       project catalogue + translations
lib/github.ts         curated repository showcase (static data, enriched by the GitHub API)
public/               CVs, images, repository screenshots
```

## Notes (MDX blog)

Posts live in `content/notes/<slug>.mdx` with a frontmatter block (`title`, `description`, `date: YYYY-MM-DD`,
`lang: en|ru|ar`, `draft: true|false`) and are compiled by `@next/mdx` (`mdx-components.tsx`).
`content/notes/example-draft.mdx` is a template.

The section is switched by `NOTES_ENABLED` in `lib/notes-config.ts`: it is true once **two or more** posts are
published. Until then `/notes`, `/notes/<slug>` and `/notes/rss.xml` return 404, nothing links to `/notes`
(navbar, command palette, footer) and the sitemap lists no notes. Drafts are never listed, never in RSS or the
sitemap, and 404 in production; in `next dev` a draft opens at `/notes/<slug>` for proofreading.

## Languages and SEO

The language is client-side state, so all three languages share one URL. `?lang=en|ru|ar` opens a page in that
language (applied before first paint in `app/layout.tsx`, then saved by `hydrateLocale()`), and the pages declare
hreflang alternates `/`, `/?lang=ru`, `/?lang=ar` (x-default `/`) via `lib/seo.ts`.

## Scripts

| Command                 | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `npm run dev`           | Dev server on http://localhost:3000 (Turbopack)                 |
| `npm run build`         | Production build                                                |
| `npm start`             | Serve the production build                                      |
| `npm run lint`          | ESLint (`eslint-config-next`, core web vitals)                  |
| `npx tsc --noEmit`      | Type-check                                                      |
| `npm run capture:repos` | Capture repository screenshots into `public/repo-screenshots/` (Playwright) |

Requires Node.js 20.9 or newer.

## Environment variables

All optional — the site builds and runs without any of them.

| Variable             | Used by              | Purpose                                                                                     |
| -------------------- | -------------------- | ------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`     | `/api/contact`       | Sends contact-form email. Without it the endpoint answers `{ ok: false, error: "not_configured" }` and the form shows the direct email fallback. |
| `CONTACT_FROM_EMAIL` | `/api/contact`       | Sender, e.g. `Portfolio <hello@your-domain>` (must be a Resend-verified domain). Defaults to `onboarding@resend.dev`. |
| `CONTACT_TO_EMAIL`   | `/api/contact`       | Recipient. Defaults to the address in `lib/ui-copy.ts`.                                     |
| `GITHUB_TOKEN`       | `lib/github.ts`      | Read-only token for the GitHub REST API (raises the rate limit). The showcase falls back to baked-in data if the API is unavailable. |

For local development put them in `.env.local` (git-ignored).

## Deployment

Vercel builds and deploys every push to `main`. Set the environment variables in the Vercel project settings.

Security headers (nosniff, referrer policy, permissions policy, frame blocking, COOP, HSTS) are configured in `next.config.mjs`.
