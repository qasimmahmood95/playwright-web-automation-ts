import { expect, test } from '@/fixtures';
import { Products } from '@/utils/helpers';

// Baselines are Linux-only and generated exclusively by the update-snapshots
// workflow (see README "Visual regression") — never regenerate them locally.

test.describe('Login page', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, loginPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/');
    await loginPage.checkSwagLabsLogo();
  });

  test('Login page matches baseline', { tag: '@visual' }, async ({ page }) => {
    await expect(page).toHaveScreenshot('login.png', { fullPage: true });
  });
});

test.describe('Inventory — standard user', () => {
  test.beforeEach(async ({ page, productsPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    // Screenshot only once every product image has finished loading
    await productsPage.checkAllProductImagesRendered();
  });

  test('Inventory page matches baseline', { tag: '@visual' }, async ({ page }) => {
    await expect(page).toHaveScreenshot('inventory.png', { fullPage: true });
  });
});

test.describe('Inventory — problem user', () => {
  test.use({ role: 'problem' });

  test.beforeEach(async ({ page, productsPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    // problem_user images load fine — they are wrong, not broken
    await productsPage.checkAllProductImagesRendered();
  });

  test('Problem user inventory matches baseline', { tag: '@visual' }, async ({ page }) => {
    // Captures the known problem_user defect: every card shows the same image
    await expect(page).toHaveScreenshot('inventory-problem.png', { fullPage: true });
  });
});

test.describe('Cart and checkout', () => {
  // Both snapshots need an item in the cart, so both mutate state and get teardown
  test.beforeEach(async ({ page, productsPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    await productsPage.clickAddToCart(Products.onesie);
    await productsPage.clickShoppingCartButton();
    await productsPage.checkTitle('Your Cart');
  });

  test.afterEach(async ({ loginPage }) => {
    await loginPage.clickOpenSidebarMenuButton();
    await loginPage.clickResetAppStateButton();
    await loginPage.clickLogoutButton();
  });

  test('Cart with an item matches baseline', { tag: '@visual' }, async ({ page }) => {
    await expect(page).toHaveScreenshot('cart.png', { fullPage: true });
  });

  test('Checkout step one matches baseline', { tag: '@visual' }, async ({ page, checkoutPage }) => {
    await checkoutPage.clickCheckoutButton();
    await checkoutPage.checkInformationForm();
    await expect(page).toHaveScreenshot('checkout-step-one.png', { fullPage: true });
  });
});
