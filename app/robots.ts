import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/ui-copy";

/** Built once at build time (also required by the static GitHub Pages export). */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`
  };
}
