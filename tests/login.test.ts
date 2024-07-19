import { test, expect } from '@playwright/test';
import config from '../config/env';
import LoginPage from '../pages/loginPage';

const { url, password, username, locked_username } = config;

test.beforeEach(async ({ page }, testInfo) => {
  const login = new LoginPage(page);

  console.log(`Running ${testInfo.title}`);

  await page.goto(url);
  await login.checkSwagLabsLogo();
});

test('Standard user can login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.enterUsername(username);
  await login.enterPassword(password);
  await login.clickLoginButton();
  await login.checkProductsTitle();
  await login.clickOpenSidebarMenuButton();
  await login.clickResetAppStateButton();
  await login.clickLogoutButton();
});

test('Locked out user cannot login', async ({ page }) => {
  const login = new LoginPage(page);
  await login.enterUsername(locked_username);
  await login.enterPassword(password);
  await login.clickLoginButton();
  await login.checkLoginError();
});
