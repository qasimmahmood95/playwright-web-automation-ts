import config from '@/config/env';

/**
 * Interception match rules and traffic-shaping parameters for saucedemo's
 * actual network surface. The app is fully client-side (login and inventory
 * ship inside the JS bundle), so the traffic that exists is documents,
 * hashed JS/CSS bundles, and product images — there are no app APIs to stub.
 */
export const RoutePatterns = {
  // Hash-named product photos — the only .jpg assets the app requests, and
  // CI-proven to be fetched on every load. Path-based patterns (e.g.
  // '**/static/**') matched nothing on the current site build, so match by
  // extension, not path. Playwright globs are end-anchored — this stops
  // matching if the site ever adds query strings
  productImages: '**/*.jpg',
} as const;

/**
 * The app's own origin, derived from the same config value that
 * playwright.config.ts uses for baseURL — one source of truth.
 */
export const AppOrigin = new URL(config.url).origin;

export const NetworkConditions = {
  imageLatencyMs: 500,
} as const;
