import { test } from '@/fixtures';
import { expectNoNewA11yViolations } from '@/utils/a11y';
import { Products } from '@/utils/helpers';

test.describe('Login page', () => {
  // The login scan must see the signed-out page
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, loginPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/');
    await loginPage.checkSwagLabsLogo();
  });

  test(
    'Login page has no unexpected WCAG violations',
    { tag: '@a11y' },
    async ({ page }, testInfo) => {
      await expectNoNewA11yViolations(page, 'login', testInfo);
    }
  );
});

test.describe('Inventory', () => {
  test.beforeEach(async ({ page, productsPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
  });

  test(
    'Inventory page has no unexpected WCAG violations',
    { tag: '@a11y' },
    async ({ page }, testInfo) => {
      await expectNoNewA11yViolations(page, 'inventory', testInfo);
    }
  );
});

test.describe('Cart and checkout', () => {
  // Both scans need an item in the cart, so both mutate state and get teardown
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

  test(
    'Cart page with an item has no unexpected WCAG violations',
    { tag: '@a11y' },
    async ({ page }, testInfo) => {
      await expectNoNewA11yViolations(page, 'cart', testInfo);
    }
  );

  test(
    'Checkout step one has no unexpected WCAG violations',
    { tag: '@a11y' },
    async ({ page, checkoutPage }, testInfo) => {
      await checkoutPage.clickCheckoutButton();
      await checkoutPage.checkInformationForm();
      await expectNoNewA11yViolations(page, 'checkout-step-one', testInfo);
    }
  );
});
