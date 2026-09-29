# alhassan-portfolio

Source of [alhassan-portfolio-sigma.vercel.app](https://alhassan-portfolio-sigma.vercel.app) — the portfolio of Alhassan Alfarran, Full-Stack & Python Developer (Web & AI Systems) in Moscow.

A trilingual (English / Russian / Arabic with RTL) single-page portfolio with project case studies, a curated GitHub showcase and a contact form.

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS 3** with theme tokens in `app/globals.css` (dark by default, light variant)
- **Framer Motion**, **Lenis** (smooth scroll), **lucide-react**, **zustand** (UI state)
- `next/og` for Open Graph images, `next/font` for self-hosted fonts
- **Vercel Analytics** + **Speed Insights**; contact email via the **Resend** HTTP API

## Structure

```
app/[lang]/           every page, per language (/en, /ru, /ar): root layout, home, cv, projects, notes, 404, error
app/[lang]/projects/[slug]/  statically generated case-study pages (+ their OG images)
app/                  language-neutral routes: sitemap, robots, manifest, icons, RSS, global 404, global error
app/api/contact/      contact form endpoint (validation, spam checks, Resend)
proxy.ts              locale redirects for URLs without a language (see "Languages and SEO")
components/app/       chrome: navbar, command palette, cursor, background, toasts
components/sections/  home page sections and the project detail view
lib/i18n.ts           locales, locale paths and cookie names (shared by server, client and proxy)
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
published. Until then `/{lang}/notes`, `/{lang}/notes/<slug>` and `/notes/rss.xml` return 404, nothing links to
the notes (navbar, command palette, footer) and the sitemap lists no notes. Drafts are never listed, never in RSS or
the sitemap, and 404 in production; in `next dev` a draft opens at `/<lang>/notes/<slug>` for proofreading.

A post is written in one language and lives only at `/<post lang>/notes/<slug>`; the same slug under another
language redirects there (308). The list (`/en/notes`, `/ru/notes`, `/ar/notes`) shows every post in each
language, marked with the post's language. The RSS feed stays at `/notes/rss.xml` and links each post's URL.

## Languages and SEO

Every page has one URL per language: `/en`, `/ru/cv`, `/ar/projects/<slug>` and so on (`app/[lang]/`, all
prerendered). The root layout `app/[lang]/layout.tsx` renders `<html lang dir>` and the metadata on the server, and
passes the language to the client components (`useLocale()` / `useCopy()` in `lib/hooks.ts`), so the server HTML
and the first client render agree and Arabic never flips direction after loading.

- **Redirects** (`proxy.ts`): a page URL without a language (`/`, `/cv`, `/projects/<slug>`, `/notes`) gets a
  307 to the visitor's language: the `NEXT_LOCALE` cookie if set, else the best of `ru`/`ar`/`en` in
  `Accept-Language`, else English. Old `?lang=xx` links get a 308 to `/xx/...` without the parameter.
  Unsupported languages (`/de`) and unknown paths are 404s (`app/global-not-found.tsx`, in the URL's language).
- **Switching language** (navbar or command palette) opens the same page in the other language and stores the
  choice in the `NEXT_LOCALE` cookie. From a note it opens the notes list (a post exists in one language).
- **SEO** (`lib/seo.ts`): each page has its own title and description in its language, a canonical URL in its
  own language, hreflang alternates for `en`/`ru`/`ar` plus `x-default` (`/en/...`), and a matching `og:locale`.
  The sitemap lists every language URL with its alternates.
- Internal links are built with `useLocalePath()` (`/cv` becomes `/ru/cv`, `/#contact` becomes `/ru#contact`).

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
| `NEXT_PUBLIC_SITE_URL` | `lib/ui-copy.ts` (`SITE_URL`), `cv-src/render.mjs` | Canonical origin, e.g. `https://your-domain.com` (no path; a trailing slash is ignored). Used for metadata, canonical and hreflang URLs, the sitemap, robots.txt, OG images, JSON-LD, the RSS feed, the online CV and the PDF CVs. Defaults to `https://alhassan-portfolio-sigma.vercel.app`. Inlined at build time, so a change needs a redeploy. |
| `RESEND_API_KEY`     | `/api/contact`       | Sends contact-form email. Without it the endpoint answers `{ ok: false, error: "not_configured" }` and the form shows the direct email fallback. |
| `CONTACT_FROM_EMAIL` | `/api/contact`       | Sender, e.g. `Portfolio <hello@your-domain>` (must be a Resend-verified domain). Defaults to `onboarding@resend.dev`. |
| `CONTACT_TO_EMAIL`   | `/api/contact`       | Recipient. Defaults to the address in `lib/ui-copy.ts`.                                     |
| `GITHUB_TOKEN`       | `lib/github.ts`      | Read-only token for the GitHub REST API (raises the rate limit). The showcase falls back to baked-in data if the API is unavailable. |

For local development put them in `.env.local` (git-ignored).

The contact email is defined once, as `CONTACT_EMAIL` in `lib/ui-copy.ts`; the site, the contact form and the PDF CVs
all read it from there.

## PDF CVs

The PDFs in `public/cv/` are rendered from `cv-src/{en,ru,ar}.html` by `node cv-src/render.mjs all` (Playwright).
The sources use `{{CONTACT_EMAIL}}`, `{{SITE_URL}}` and `{{SITE_HOST}}` placeholders, filled from `lib/ui-copy.ts` and
`NEXT_PUBLIC_SITE_URL`. To pick up the variable from `.env.local`: `node --env-file=.env.local cv-src/render.mjs all`.
Re-render and commit the PDFs after changing the domain or the email.

## Recommendations

The Recommendations section (before Contact) is driven by `recommendations.items` in `lib/copy.ts`, one array per
locale, and renders nothing while the array is empty. Add only real recommendations, with the person's permission:

```ts
items: [
  {
    quote: "Their words, unedited (translated for the other locales).",
    name: "Full Name",
    role: "Their role",
    company: "Company",
    linkedin: "https://www.linkedin.com/in/their-profile/" // optional
  }
]
```

Add the same entries, in the same order, to `en`, `ru` and `ar`.

## Deployment

Vercel builds and deploys every push to `main`. Set the environment variables in the Vercel project settings.

## Custom domain

1. **Add the domain in Vercel**: Project → Settings → Domains → Add, e.g. `your-domain.com` (and `www.your-domain.com`
   redirecting to it). Create the DNS records Vercel shows (an `A` record for the apex, a `CNAME` for `www`) at the
   registrar, and wait for the domain to be verified; Vercel issues the certificate.
2. **Set the canonical origin**: Settings → Environment Variables → `NEXT_PUBLIC_SITE_URL=https://your-domain.com`
   for Production, then redeploy (the value is inlined at build time). Canonical URLs, hreflang, the sitemap,
   robots.txt, OG images, JSON-LD, RSS and the online CV switch to the new domain.
3. **Redirect the old address**: in Settings → Domains, edit `alhassan-portfolio-sigma.vercel.app` and set it to
   redirect to `your-domain.com` with **301 (Moved Permanently)**. Paths and query strings are kept, so old links
   (including unprefixed and `?lang=` URLs, which the proxy then sends to the right language) land on the same page.
4. **Update the PDFs**: `node --env-file=.env.local cv-src/render.mjs all` with the new value in `.env.local`
   (or `NEXT_PUBLIC_SITE_URL=https://your-domain.com node cv-src/render.mjs all`), then commit `public/cv/`.
5. Update the links elsewhere: the GitHub repository's website field, LinkedIn, job profiles, and the sitemap in
   Google Search Console / Yandex Webmaster (add the new domain as a property).

Security headers (nosniff, referrer policy, permissions policy, frame blocking, COOP, HSTS) are configured in `next.config.mjs`.
