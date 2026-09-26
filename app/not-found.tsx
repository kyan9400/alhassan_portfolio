import type { Metadata } from "next";
import { NotFoundContent } from "@/components/sections/NotFoundContent";

// Server component so it can export metadata; the animated, localized UI is a client component.
export const metadata: Metadata = {
  title: "Page not found"
};

export default function NotFound() {
  return <NotFoundContent />;
}
