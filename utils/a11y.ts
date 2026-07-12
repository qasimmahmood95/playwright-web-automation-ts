import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, type TestInfo } from '@playwright/test';
import { KnownViolations, type A11yPageKey } from '@/test-data/a11y';

type AxeResults = Awaited<ReturnType<AxeBuilder['analyze']>>;
type AxeViolation = AxeResults['violations'][number];

/** WCAG 2.0/2.1 level A + AA rule tags — the suite's compliance target. */
export const wcagTags: string[] = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const summarize = (violation: AxeViolation): string =>
  `${violation.id} [${violation.impact ?? 'n/a'}] — ${violation.help} (${violation.nodes.length} node(s))`;

/**
 * Scans the current page with axe-core and asserts there are no WCAG
 * violations beyond the documented per-page baseline in test-data/a11y.ts.
 * Full axe results are attached to the report for every scan. Baseline
 * entries that no longer fire are surfaced as 'stale-a11y-baseline'
 * annotations — a prompt to prune the baseline, never a failure.
 */
export async function expectNoNewA11yViolations(
  page: Page,
  pageKey: A11yPageKey,
  testInfo: TestInfo
): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(wcagTags).analyze();

  await testInfo.attach(`axe-results-${pageKey}`, {
    body: JSON.stringify(results, null, 2),
    contentType: 'application/json',
  });

  const baseline: readonly string[] = KnownViolations[pageKey];
  const unexpected = results.violations.filter((violation) => !baseline.includes(violation.id));

  for (const ruleId of baseline) {
    if (!results.violations.some((violation) => violation.id === ruleId)) {
      testInfo.annotations.push({
        type: 'stale-a11y-baseline',
        description: `${pageKey}: baselined rule '${ruleId}' did not fire in this ${testInfo.project.name} run — prune it from test-data/a11y.ts only if it no longer fires in any browser`,
      });
    }
  }

  expect(
    unexpected.map(summarize),
    `${pageKey}: unexpected WCAG violations — fix them or baseline them in test-data/a11y.ts with a documented reason`
  ).toEqual([]);
}
