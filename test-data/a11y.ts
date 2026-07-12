/**
 * Axe rule ids that currently fire on saucedemo.com for each scanned page.
 * These are documented defects of the demo site itself, not of this suite.
 * Adding an entry requires a comment naming the concrete defect. Entries that
 * stop firing are flagged as 'stale-a11y-baseline' report annotations by
 * utils/a11y.ts — prune them once they no longer fire in any browser.
 *
 * Granularity is rule id per page: node targets churn between deploys, rule
 * ids are stable. The baseline is the union across chromium/firefox/webkit.
 */
export const KnownViolations = {
  // No known violations — axe's label rule accepts saucedemo's placeholder-only inputs
  login: [],
  // The product sort <select> has no accessible name
  inventory: ['select-name'],
  // No known violations
  cart: [],
  // No known violations — same placeholder-only inputs as login
  'checkout-step-one': [],
} as const satisfies Record<string, readonly string[]>;

export type A11yPageKey = keyof typeof KnownViolations;
