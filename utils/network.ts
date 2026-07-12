import { setTimeout as sleep } from 'node:timers/promises';
import type { Page } from '@playwright/test';

/**
 * Route-interception helpers. Register these BEFORE page.goto() — routes only
 * affect requests issued after registration. No unroute() teardown is needed:
 * every test gets a fresh context, and routes die with it.
 *
 * Each helper returns a live counter so tests can assert the interception
 * actually fired — a silent pattern mismatch fails loudly instead of passing.
 * Never assert inside a route handler; failures there are swallowed.
 */
export type RouteCounter = { count: number };

// 1x1 transparent PNG used as a deterministic image stub
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

/** Aborts every request matching the pattern. */
export async function blockRequests(page: Page, pattern: string): Promise<RouteCounter> {
  const counter: RouteCounter = { count: 0 };
  await page.route(pattern, async (route) => {
    counter.count += 1;
    await route.abort();
  });
  return counter;
}

/** Answers every matching request with a tiny valid PNG. */
export async function fulfillWithPlaceholderImage(
  page: Page,
  pattern: string
): Promise<RouteCounter> {
  const counter: RouteCounter = { count: 0 };
  await page.route(pattern, async (route) => {
    counter.count += 1;
    await route.fulfill({ contentType: 'image/png', body: PLACEHOLDER_PNG });
  });
  return counter;
}

export type CrossOriginCounters = { blocked: number; passedThrough: number };

/**
 * Blocks all traffic to origins other than the app's own. Third-party traffic
 * is not guaranteed on every load, so tests assert on `passedThrough` (the
 * app's own requests — always present) to prove the route engaged.
 */
export async function blockCrossOrigin(
  page: Page,
  appOrigin: string
): Promise<CrossOriginCounters> {
  const counters: CrossOriginCounters = { blocked: 0, passedThrough: 0 };
  await page.route('**/*', async (route) => {
    if (new URL(route.request().url()).origin === appOrigin) {
      counters.passedThrough += 1;
      await route.fallback();
    } else {
      counters.blocked += 1;
      await route.abort();
    }
  });
  return counters;
}

/**
 * Injects latency into matching requests before letting them proceed.
 * Traffic shaping only — timers never belong in test bodies.
 */
export async function delayRequests(
  page: Page,
  pattern: string,
  ms: number
): Promise<RouteCounter> {
  const counter: RouteCounter = { count: 0 };
  await page.route(pattern, async (route) => {
    counter.count += 1;
    await sleep(ms);
    await route.fallback();
  });
  return counter;
}
