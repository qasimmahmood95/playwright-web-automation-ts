import { test } from '@/fixtures';

test.beforeEach(async ({ page, loginPage }, testInfo) => {
  console.log(`Running ${testInfo.title}`);

  await page.goto('/');
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
  await productsPage.clickOnesieAddToCartButton();
  await productsPage.checkShoppingCartHasItems(1);
  await productsPage.clickShoppingCartButton();
  await productsPage.checkTitle('Your Cart');

  await checkoutPage.clickCheckoutButton();
  await checkoutPage.enterFirstName('Testing');
  await checkoutPage.enterLastName('Tester');
  await checkoutPage.enterPostalCode('TE5');
  await checkoutPage.clickContinueButton();

  await checkoutPage.checkCheckoutInfoPage();
  await checkoutPage.clickFinishButton();
  await checkoutPage.checkOrderConfirmation();
});
