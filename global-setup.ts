import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * Global setup: runs once before the entire test suite.
 *
 * Logs in as the standard user and saves the browser's storage state
 * (cookies, localStorage) to .auth/standard-user.json. Tests that use
 * the default storageState in playwright.config.ts will restore this
 * session, bypassing the UI login flow entirely.
 *
 * Tests that cover the login flow itself explicitly clear storageState
 * via test.use({ storageState: { cookies: [], origins: [] } }).
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const username = process.env.SAUCEDEMO_USERNAME ?? 'standard_user';
  const password = process.env.SAUCEDEMO_PASSWORD ?? 'secret_sauce';

  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(baseURL!);
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="title"]').waitFor({ state: 'visible' });

  await page.context().storageState({ path: '.auth/standard-user.json' });
  await browser.close();
}

export default globalSetup;
