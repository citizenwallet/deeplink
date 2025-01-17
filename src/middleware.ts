import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: ["en", "fr", "nl"],

  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale: "en",

  // This will prevent adding the locale prefix to URLs
  localePrefix: "never",
});

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /icons, /images, /videos (static files)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
