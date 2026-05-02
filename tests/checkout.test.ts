import { test } from '@/fixtures';
import { CheckoutData } from '@/test-data/checkout';
import { Products } from '@/utils/helpers';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/inventory.html');
  await loginPage.checkSwagLabsLogo();
});

test.afterEach(async ({ loginPage }) => {
  await loginPage.clickOpenSidebarMenuButton();
  await loginPage.clickResetAppStateButton();
  await loginPage.clickLogoutButton();
});

test('Standard user can add an item to the basket and checkout', async ({
  productsPage,
  checkoutPage,
}) => {
  await productsPage.clickAddToCart(Products.onesie);
  await productsPage.checkShoppingCartHasItems(1);
  await productsPage.clickShoppingCartButton();
  await productsPage.checkTitle('Your Cart');

  await checkoutPage.clickCheckoutButton();
  await checkoutPage.enterFirstName(CheckoutData.valid.firstName);
  await checkoutPage.enterLastName(CheckoutData.valid.lastName);
  await checkoutPage.enterPostalCode(CheckoutData.valid.postalCode);
  await checkoutPage.clickContinueButton();

  await checkoutPage.checkCheckoutInfoPage();
  await checkoutPage.clickFinishButton();
  await checkoutPage.checkOrderConfirmation();
});
