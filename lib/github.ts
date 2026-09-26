import { publicPathForRepoScreenshot } from "@/lib/repoScreenshot";

const GITHUB_USER = "kyan9400";

/** Curated hides — exact GitHub `name` (case-insensitive). */
const EXCLUDED_REPO_NAMES = new Set(
  [
    "one-page-website-html-css-project-master",
    "Real-estate",
    "Real_estate_website",
    "naumen.scala.course.2023.spring"
  ].map((n) => n.toLowerCase())
);

const PER_PAGE = 100;
/** Safety cap: 100 pages × 100 = 10,000 repos (GitHub API limit per page is 100) */
const MAX_PAGES = 100;

export type GithubRepo = {
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  homepage?: string;
  topics?: string[];
  /** Set when `public/repo-screenshots/{name}.png` (or .webp) exists */
  previewImage?: string;
};

export type GithubReposResult = { ok: true; repos: GithubRepo[] } | { ok: false };

type RawRepo = Record<string, unknown>;

/** Drop placeholder repos (e.g. name "1", "-_-", no real identifier). */
function isMeaningfulRepoName(name: string): boolean {
  const n = name.trim();
  if (n.length < 2) return false;
  if (/^\d+$/.test(n)) return false;
  if (/^[\d_-]+$/.test(n)) return false;
  return true;
}

async function fetchReposPage(page: number): Promise<{ ok: boolean; data: RawRepo[] }> {
  const url = new URL(`https://api.github.com/users/${GITHUB_USER}/repos`);
  url.searchParams.set("per_page", String(PER_PAGE));
  url.searchParams.set("page", String(page));
  /** `all` = owned + forks + org member visibility where API exposes them for this user */
  url.searchParams.set("type", "all");
  url.searchParams.set("sort", "updated");
  url.searchParams.set("direction", "desc");

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "alhassan-portfolio (Next.js; +https://github.com/kyan9400)"
    }
  });

  if (!res.ok) {
    return { ok: false, data: [] };
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    return { ok: false, data: [] };
  }

  if (!Array.isArray(data)) {
    return { ok: false, data: [] };
  }

  return { ok: true, data: data.filter((item): item is RawRepo => item !== null && typeof item === "object") };
}

/**
 * Public repos for `kyan9400` (every API page), cached 1h.
 * Includes forks; trivial names removed. **Only repos with a committed screenshot**
 * (`public/repo-screenshots/{name}.png` or `.webp`) are returned so the grid stays consistent.
 */
export async function getGithubRepos(): Promise<GithubReposResult> {
  const chunks: RawRepo[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { ok, data } = await fetchReposPage(page);
    if (!ok) {
      if (page === 1) {
        return { ok: false };
      }
      break;
    }
    if (data.length === 0) {
      break;
    }
    chunks.push(...data);
    if (data.length < PER_PAGE) {
      break;
    }
  }

  const repos: GithubRepo[] = chunks
    .filter((repo) => typeof repo.name === "string")
    .map((repo) => {
      const homepageRaw = typeof repo.homepage === "string" ? repo.homepage.trim() : "";
      return {
        name: String(repo.name).trim(),
        description: typeof repo.description === "string" ? repo.description : null,
        html_url: typeof repo.html_url === "string" ? repo.html_url : "",
        stargazers_count: typeof repo.stargazers_count === "number" ? repo.stargazers_count : 0,
        language: typeof repo.language === "string" ? repo.language : null,
        homepage: homepageRaw.length > 0 ? homepageRaw : undefined,
        topics: Array.isArray(repo.topics) ? (repo.topics as string[]).filter((t) => typeof t === "string") : []
      };
    })
    .filter((repo) => repo.html_url.length > 0 && repo.name.length > 0)
    .filter((repo) => isMeaningfulRepoName(repo.name))
    .filter((repo) => !EXCLUDED_REPO_NAMES.has(repo.name.toLowerCase()))
    .map(
      (repo): GithubRepo => ({
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        homepage: repo.homepage,
        topics: repo.topics,
        previewImage: publicPathForRepoScreenshot(repo.name)
      })
    )
    .filter((repo) => Boolean(repo.previewImage))
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  return { ok: true, repos };
}
