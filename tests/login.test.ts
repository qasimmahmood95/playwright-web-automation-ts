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

test.describe('Successful login', () => {
  // Teardown needs a signed-in session — skip it when the test itself failed,
  // otherwise the sidebar lookup times out on the login page and buries the real error
  test.afterEach(async ({ loginPage }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) return;

    await loginPage.clickOpenSidebarMenuButton();
    await loginPage.clickResetAppStateButton();
    await loginPage.clickLogoutButton();
  });

  test('Standard user can login', { tag: ['@smoke', '@regression'] }, async ({ loginPage }) => {
    await loginPage.enterUsername(username);
    await loginPage.enterPassword(password);
    await loginPage.clickLoginButton();
    await loginPage.checkProductsTitle();
  });
});

test('Locked out user cannot login', { tag: '@regression' }, async ({ loginPage }) => {
  await loginPage.enterUsername(locked_username);
  await loginPage.enterPassword(password);
  await loginPage.clickLoginButton();
  await loginPage.checkLoginError();
});
