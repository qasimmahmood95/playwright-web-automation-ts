import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html']] : [['list'], ['html']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup projects run once per browser before their dependent test project.
    // Each saves auth state to a browser-specific file so CI jobs remain isolated.
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

    // Test projects depend on their respective setup project and load the saved auth state.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/chromium.json' },
      dependencies: ['setup:chromium'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: '.auth/firefox.json' },
      dependencies: ['setup:firefox'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: '.auth/webkit.json' },
      dependencies: ['setup:webkit'],
    },
  ],
});
