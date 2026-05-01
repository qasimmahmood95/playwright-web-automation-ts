import { test } from '@/fixtures';
import config from '@/config/env';

const { password, username, locked_username } = config;

// Login tests must run without stored auth — they exercise the login form itself
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/');
  await loginPage.checkSwagLabsLogo();
});

test('Standard user can login', async ({ loginPage }) => {
  await loginPage.enterUsername(username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
  await loginPage.checkProductsTitle();
  await loginPage.clickOpenSidebarMenuButton();
  await loginPage.clickResetAppStateButton();
  await loginPage.clickLogoutButton();
});

test('Locked out user cannot login', async ({ loginPage }) => {
  await loginPage.enterUsername(locked_username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
  await loginPage.checkLoginError();
});
