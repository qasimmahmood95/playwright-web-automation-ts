import config from '@/config/env';

/**
 * Interception match rules and traffic-shaping parameters for saucedemo's
 * actual network surface. The app is fully client-side (login and inventory
 * ship inside the JS bundle), so the traffic that exists is documents, CRA
 * static bundles, and product images — there are no app APIs to stub.
 */
export const RoutePatterns = {
  // CRA-hashed product photos served from /static/media/. Playwright globs are
  // end-anchored — this stops matching if the site ever adds query strings
  productImages: '**/*.jpg',
  staticAssets: '**/static/**',
} as const;

/**
 * The app's own origin, derived from the same config value that
 * playwright.config.ts uses for baseURL — one source of truth.
 */
export const AppOrigin = new URL(config.url).origin;

export const NetworkConditions = {
  assetLatencyMs: 500,
} as const;
