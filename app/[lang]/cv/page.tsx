import type { Metadata } from "next";
import { getCopy } from "@/lib/ui-copy";
import { localizedPageMetadata } from "@/lib/seo";
import { routeLocale } from "@/lib/i18n";
import { CvPage } from "@/components/sections/CvPage";

type PageParams = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const locale = routeLocale((await params).lang);
  const { ui } = getCopy(locale);
  return localizedPageMetadata(locale, "/cv", { title: ui.cv.metaTitle, description: ui.meta.cvDescription, type: "profile" });
}

export default function Cv() {
  return <CvPage />;
}
