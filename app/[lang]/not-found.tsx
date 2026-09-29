import type { Metadata } from "next";
import { lang } from "next/root-params";
import { getCopy } from "@/lib/ui-copy";
import { routeLocale } from "@/lib/i18n";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

// Server component so it can set the title in the route's language (an unknown first segment such as
// /de renders in English); the animated, localized UI is a client component.
export async function generateMetadata(): Promise<Metadata> {
  return { title: getCopy(routeLocale(await lang())).notFoundTitle };
}

export default function NotFound() {
  return <NotFoundContent />;
}
