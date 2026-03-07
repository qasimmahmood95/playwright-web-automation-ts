import { test, expect } from '../fixtures';
import { Users } from '../test-data/users';

/**
 * Login tests always operate on an unauthenticated session.
 * We explicitly clear the storageState set in playwright.config.ts
 * so that tests start at the login page rather than the products page.
 */
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeEach(async ({ page, loginPage }) => {
  await page.goto('/');
  await loginPage.checkSwagLabsLogo();
});

test.describe('Login — smoke @smoke', () => {
  test('standard user can log in successfully', async ({ loginPage }) => {
    await loginPage.login(Users.STANDARD.username, Users.STANDARD.password);
    await loginPage.checkProductsTitle();
    await loginPage.resetAndLogout();
  });

  test('locked out user sees an error message', async ({ loginPage }) => {
    await loginPage.enterUsername(Users.LOCKED.username);
    await loginPage.enterPassword(Users.LOCKED.password);
    await loginPage.clickLoginButton();
    await loginPage.checkLoginError('Epic sadface: Sorry, this user has been locked out.');
  });
});

test.describe('Login — regression @regression', () => {
  test('submitting empty credentials shows username validation error', async ({ loginPage }) => {
    await loginPage.clickLoginButton();
    await loginPage.checkLoginError('Epic sadface: Username is required');
  });

  test('submitting with only a username shows password validation error', async ({ loginPage }) => {
    await loginPage.enterUsername(Users.STANDARD.username);
    await loginPage.clickLoginButton();
    await loginPage.checkLoginError('Epic sadface: Password is required');
  });

  test('problem user can log in', async ({ loginPage }) => {
    await loginPage.login(Users.PROBLEM.username, Users.PROBLEM.password);
    await loginPage.checkProductsTitle();
    await loginPage.resetAndLogout();
  });

  test('performance glitch user can log in despite artificial latency', async ({
    loginPage,
  }) => {
    await loginPage.login(Users.PERFORMANCE_GLITCH.username, Users.PERFORMANCE_GLITCH.password);
    await loginPage.checkProductsTitle();
    await loginPage.resetAndLogout();
  });

  test('logo is visible on the login page', async ({ loginPage }) => {
    await loginPage.checkSwagLabsLogo();
  });

  test('accepted usernames are listed on the login page', async ({ page }) => {
    await expect(page.locator('[data-test="login-credentials"]')).toBeVisible();
  });
});
