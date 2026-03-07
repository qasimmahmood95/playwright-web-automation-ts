import { test, expect } from '../fixtures';
import { Products } from '../utils/helpers';
import { CheckoutData } from '../test-data/checkout';

/**
 * Checkout tests start from an authenticated session.
 * Each test navigates to the inventory page and adds an item before proceeding.
 * afterEach resets and logs out to restore a clean state.
 */
test.beforeEach(async ({ page, productsPage }) => {
  await page.goto('/inventory.html');
  await productsPage.addToCart(Products.ONESIE).click();
  await productsPage.assertCartBadgeCount(1);
  await productsPage.clickShoppingCartButton();
});

test.afterEach(async ({ loginPage }) => {
  await loginPage.resetAndLogout();
});

test.describe('Checkout — smoke @smoke', () => {
  test('standard user can complete checkout end-to-end', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutData.VALID;

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();

    await checkoutPage.checkCheckoutInfoPage();
    await checkoutPage.clickFinishButton();
    await checkoutPage.checkOrderConfirmation();
  });
});

test.describe('Checkout — regression @regression', () => {
  test('checkout form shows an error when first name is empty', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutData.EMPTY_FIRST_NAME;

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await checkoutPage.checkFormError('Error: First Name is required');
  });

  test('checkout form shows an error when last name is empty', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutData.EMPTY_LAST_NAME;

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await checkoutPage.checkFormError('Error: Last Name is required');
  });

  test('checkout form shows an error when postal code is empty', async ({ checkoutPage }) => {
    const { firstName, lastName, postalCode } = CheckoutData.EMPTY_POSTAL_CODE;

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await checkoutPage.checkFormError('Error: Postal Code is required');
  });

  test('cancelling checkout returns the user to the cart', async ({ checkoutPage, productsPage }) => {
    await checkoutPage.clickCheckoutButton();
    await checkoutPage.clickCancelButton();
    await productsPage.checkTitle('Your Cart');
  });

  test('order summary page displays payment, shipping, and total info', async ({
    checkoutPage,
  }) => {
    const { firstName, lastName, postalCode } = CheckoutData.VALID;

    await checkoutPage.clickCheckoutButton();
    await checkoutPage.fillShippingDetails(firstName, lastName, postalCode);
    await checkoutPage.clickContinueButton();
    await checkoutPage.checkCheckoutInfoPage();
  });
});
