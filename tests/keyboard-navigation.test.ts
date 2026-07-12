import { test } from '@/fixtures';
import config from '@/config/env';
import { Products } from '@/test-data/products';
import { CheckoutData } from '@/test-data/checkout';

const { username, password } = config;

// Keyboard-operability checks that go beyond the static axe scans: they drive the
// login and checkout forms with Tab and Enter only, asserting focus order and
// that the forms submit without a mouse click.

test.describe('Login page keyboard navigation', () => {
  // These exercise the signed-out login form
  test.use({ storageState: { cookies: [], origins: [] } });

  test.beforeEach(async ({ page, loginPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/');
    await loginPage.checkSwagLabsLogo();
  });

  test('Login form fields are tabbable in order', { tag: '@a11y' }, async ({ loginPage }) => {
    await loginPage.checkKeyboardTabOrder();
  });

  test.describe('Enter-key submit', () => {
    // A keyboard login lands signed in, so it mutates state and gets teardown.
    // Skip it when the test itself failed, or the sidebar lookup buries the error.
    test.afterEach(async ({ appMenu }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) return;

      await appMenu.resetAppStateAndLogout();
    });

    test(
      'Enter submits the login form from the password field',
      { tag: '@a11y' },
      async ({ loginPage }) => {
        await loginPage.loginWithEnterKey(username, password);
        await loginPage.checkProductsTitle();
      }
    );
  });
});

test.describe('Checkout form keyboard navigation', () => {
  // Reaching checkout step one mutates cart state, so these get teardown
  test.beforeEach(async ({ page, productsPage, checkoutPage }, testInfo) => {
    console.log(`Running ${testInfo.title}`);

    await page.goto('/inventory.html');
    await productsPage.checkTitle('Products');
    await productsPage.clickAddToCart(Products.onesie);
    await productsPage.clickShoppingCartButton();
    await productsPage.checkTitle('Your Cart');
    await checkoutPage.clickCheckoutButton();
    await checkoutPage.checkInformationForm();
  });

  test.afterEach(async ({ appMenu }) => {
    await appMenu.resetAppStateAndLogout();
  });

  test(
    'Checkout information fields are tabbable in order',
    { tag: '@a11y' },
    async ({ checkoutPage }) => {
      await checkoutPage.checkInformationFormTabOrder();
    }
  );

  test(
    'Continue button submits the information form via keyboard',
    { tag: '@a11y' },
    async ({ checkoutPage }) => {
      await checkoutPage.submitInformationWithKeyboard(CheckoutData.valid);
      await checkoutPage.checkCheckoutInfoPage();
    }
  );
});
