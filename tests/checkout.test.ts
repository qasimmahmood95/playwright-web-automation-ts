import { test } from '@/fixtures';
import { CheckoutData, InvalidCheckoutScenarios } from '@/test-data/checkout';
import { Products } from '@/utils/helpers';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/inventory.html');
  await loginPage.checkSwagLabsLogo();
});

// Every test in this file puts an item in the cart, so all get the reset/logout teardown
test.afterEach(async ({ appMenu }) => {
  await appMenu.resetAppStateAndLogout();
});

test(
  'Standard user can add an item to the basket and checkout',
  { tag: ['@smoke', '@regression'] },
  async ({ productsPage, checkoutPage }) => {
    await productsPage.clickAddToCart(Products.onesie);
    await productsPage.checkShoppingCartHasItems(1);
    await productsPage.clickShoppingCartButton();
    await productsPage.checkTitle('Your Cart');

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillInformation(CheckoutData.valid);
    await checkoutPage.clickContinueButton();

    await checkoutPage.checkCheckoutInfoPage();
    await checkoutPage.clickFinishButton();
    await checkoutPage.checkOrderConfirmation();
  }
);

test.describe('Checkout form validation', () => {
  for (const { missing, data, error } of InvalidCheckoutScenarios) {
    test(
      `Checkout is blocked when ${missing} is missing`,
      { tag: '@regression' },
      async ({ productsPage, checkoutPage }) => {
        await productsPage.clickAddToCart(Products.onesie);
        await productsPage.clickShoppingCartButton();
        await checkoutPage.clickCheckoutButton();

        await checkoutPage.fillInformation(data);
        await checkoutPage.clickContinueButton();
        await checkoutPage.checkError(error);
      }
    );
  }
});
