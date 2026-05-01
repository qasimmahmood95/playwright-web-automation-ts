import { chromium } from '@playwright/test';
import * as fs from 'fs';
import config from './config/env';

async function globalSetup() {
  fs.mkdirSync('.auth', { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(config.url);
  await page.getByTestId('user-name').fill(config.username);
  await page.getByTestId('password').fill(config.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');

  await page.context().storageState({ path: '.auth/user.json' });
  await browser.close();
}

export default globalSetup;
