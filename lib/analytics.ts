import { track } from "@vercel/analytics";

/** Every custom event the site reports. Keep this list short and intentional. */
export type AnalyticsEvent = "cv_download" | "contact_submit_success" | "project_open" | "email_copy" | "telegram_click";

/**
 * Report a custom event to Vercel Web Analytics.
 * Safe to call anywhere on the client: it is a no-op on the server, and it never throws
 * (ad blockers, missing script or a disabled analytics project must not break a click handler).
 */
export function trackEvent(name: AnalyticsEvent, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    track(name, props);
  } catch {
    /* analytics must never break the UI */
  }
}
