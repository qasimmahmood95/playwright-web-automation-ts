import { test as setup } from '@playwright/test';
import * as fs from 'fs';
import config from '@/config/env';

setup('authenticate as standard user', async ({ page }, testInfo) => {
  const browser = testInfo.project.name.replace('setup:', '');
  const authFile = `.auth/${browser}.json`;

  fs.mkdirSync('.auth', { recursive: true });

  await page.goto('/');
  await page.getByTestId('username').fill(config.username);
  await page.getByTestId('password').fill(config.password);
  await page.getByTestId('login-button').click();
  await page.waitForURL('**/inventory.html');

  await page.context().storageState({ path: authFile });
});
