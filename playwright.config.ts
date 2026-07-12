import { defineConfig, devices } from '@playwright/test';
import config from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html']],
  use: {
    baseURL: config.url,
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup projects run once per browser before their dependent test project.
    // Each logs in once per auth role and saves state to .auth/<browser>-<role>.json,
    // so CI jobs remain isolated per browser.
    {
      name: 'setup:chromium',
      testMatch: '**/global.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'setup:firefox',
      testMatch: '**/global.setup.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'setup:webkit',
      testMatch: '**/global.setup.ts',
      use: { ...devices['Desktop Safari'] },
    },

    // Test projects depend on their respective setup project. The auth state
    // each test loads is resolved per browser + role by the `role` fixture
    // option in fixtures/index.ts (default: 'standard').
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup:chromium'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup:firefox'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup:webkit'],
    },
  ],
});
