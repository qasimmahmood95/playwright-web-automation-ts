import { expect, test } from '@/fixtures';
import { PerformanceThresholds } from '@/test-data/performance';
import { authFile } from '@/utils/auth';
import { getNavigationTiming, measureInventoryLoad } from '@/utils/performance';

// Read-only suite: navigations and timing reads only — no teardown per convention.
test.beforeEach(async ({ browserName }, testInfo) => {
  console.log(`Running ${testInfo.title} [${browserName}]`);
});

test(
  'Standard user inventory DOM content loads within the sanity ceiling',
  { tag: '@performance' },
  async ({ page }, testInfo) => {
    await page.goto('/inventory.html');
    const timing = await getNavigationTiming(page);

    testInfo.annotations.push({
      type: 'performance',
      description: `standard inventory DCL ${Math.round(timing.domContentLoadedMs)}ms, load ${Math.round(timing.loadMs)}ms`,
    });
    // Generous sanity bound, not an SLO — see test-data/performance.ts
    expect(timing.domContentLoadedMs).toBeLessThan(PerformanceThresholds.standardDclCeilingMs);
  }
);

test(
  'Performance glitch user inventory load measurably exceeds standard user',
  { tag: '@performance' },
  async ({ browser, browserName }, testInfo) => {
    // Standard first: any connection warm-up then favours the glitch run,
    // keeping the delta assertion conservative
    const standard = await measureInventoryLoad(browser, authFile(browserName, 'standard'));
    const glitch = await measureInventoryLoad(browser, authFile(browserName, 'glitch'));

    testInfo.annotations.push({
      type: 'performance',
      description: `inventory DCL standard ${Math.round(standard.domContentLoadedMs)}ms vs glitch ${Math.round(glitch.domContentLoadedMs)}ms`,
    });
    // The glitch user's seeded render busy-wait must dominate runner noise
    expect(glitch.domContentLoadedMs - standard.domContentLoadedMs).toBeGreaterThan(
      PerformanceThresholds.glitchMinDclDeltaMs
    );
  }
);
