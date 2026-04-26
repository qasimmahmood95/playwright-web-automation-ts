import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  /* GitHub Actions annotation reporter in CI; list + HTML locally */
  reporter: process.env.CI
    ? [['github'], ['html'], ['junit', { outputFile: 'test-results/results.xml' }]]
    : [['list'], ['html']],
  globalSetup: './global-setup',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    storageState: '.auth/standard-user.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
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
