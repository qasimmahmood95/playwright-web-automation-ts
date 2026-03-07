import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporters: HTML for local review, JUnit XML for CI systems, list for real-time terminal output */
  reporter: [['html'], ['junit', { outputFile: 'test-results/results.xml' }], ['list']],
  /* Global setup runs once before all tests to persist authentication state */
  globalSetup: './global-setup',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    /* Restore authenticated session for tests that need it */
    storageState: '.auth/standard-user.json',
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    /* Screenshot on failure for CI debugging */
    screenshot: 'only-on-failure',
    /* Video on failure to aid root cause analysis */
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
