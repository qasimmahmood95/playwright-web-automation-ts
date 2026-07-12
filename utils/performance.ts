import type { Browser, Page } from '@playwright/test';
import ProductsPage from '@/pages/productsPage';

export type NavigationTiming = { domContentLoadedMs: number; loadMs: number };

export type InventoryLoadMeasurement = NavigationTiming & {
  /** Wall-clock from navigation start until the inventory title is rendered. */
  readyMs: number;
};

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
 * and measures it. Symmetric cold contexts keep cross-role comparisons fair;
 * the context is always closed — it holds no app state.
 *
 * Cross-role deltas must use `readyMs`, not DOM-content-loaded: the glitch
 * user's seeded render busy-wait executes before DCL only on some engines
 * (CI showed pre-DCL on Firefox, post-DCL on Chromium/WebKit), but the title
 * cannot render until it completes, so wall-clock-to-rendered captures the
 * delay everywhere.
 */
export async function measureInventoryLoad(
  browser: Browser,
  storageStatePath: string
): Promise<InventoryLoadMeasurement> {
  const context = await browser.newContext({ storageState: storageStatePath });
  try {
    const page = await context.newPage();
    const start = Date.now();
    await page.goto('/inventory.html');
    await new ProductsPage(page).checkTitle('Products');
    const readyMs = Date.now() - start;

    const timing = await getNavigationTiming(page);
    return { ...timing, readyMs };
  } finally {
    await context.close();
  }
}
