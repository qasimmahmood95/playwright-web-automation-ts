import type { Browser, Page } from '@playwright/test';

export type NavigationTiming = { domContentLoadedMs: number; loadMs: number };

/**
 * Reads the page's navigation-timing entry via the standard Web Performance
 * API, which works across all three engines — page.metrics() is Chromium-only
 * and banned. Returns picked numeric fields: the raw entry is a class instance
 * and does not survive evaluate's serialization.
 */
export async function getNavigationTiming(page: Page): Promise<NavigationTiming> {
  return page.evaluate(() => {
    const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (!entry) {
      throw new Error('No navigation-timing entry — call this after a page navigation');
    }
    return {
      domContentLoadedMs: entry.domContentLoadedEventEnd - entry.startTime,
      // loadEventEnd can lag its dispatch by a beat — clamp so a race never reports negative
      loadMs: Math.max(0, entry.loadEventEnd - entry.startTime),
    };
  });
}

/**
 * Loads the inventory page in a fresh context seeded from a saved auth state
 * and returns its navigation timing. Symmetric cold contexts keep cross-role
 * comparisons fair; the context is always closed — it holds no app state.
 */
export async function measureInventoryLoad(
  browser: Browser,
  storageStatePath: string
): Promise<NavigationTiming> {
  const context = await browser.newContext({ storageState: storageStatePath });
  try {
    const page = await context.newPage();
    await page.goto('/inventory.html');
    return await getNavigationTiming(page);
  } finally {
    await context.close();
  }
}
