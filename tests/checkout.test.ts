import { test, expect } from '@playwright/test';
import config from '../config/env';
import LoginPage from '../pages/loginPage';
import ProductsPage from '../pages/productsPage';
import CheckoutPage from '../pages/checkoutPage';

const { url, password, username, locked_username } = config;

test.beforeEach(async ({ page }, testInfo) => {
  const login = new LoginPage(page);

  console.log(`Running ${testInfo.title}`);

  await page.goto(url);
  await login.checkSwagLabsLogo();
});

test.afterEach(async ({ page }) => {
  const login = new LoginPage(page);

  await login.clickOpenSidebarMenuButton();
  await login.clickResetAppStateButton();
  await login.clickLogoutButton();
});

test('Standard user can add an item to the basket and checkout', async ({ page }) => {
  const login = new LoginPage(page);
  const products = new ProductsPage(page);
  const checkout = new CheckoutPage(page);

  await login.login(username, password);

  await products.clickOnesieAddToCartButton();
  await products.checkShoppingCartHasItems(1);
  await products.clickShoppingCartButton();
  await products.checkTitle('Your Cart');

  await checkout.clickCheckoutButton();
  await checkout.enterFirstName('Testing');
  await checkout.enterLastName('Tester');
  await checkout.enterPostalCode('TE5');
  await checkout.clickContinueButton();

  await checkout.checkCheckoutInfoPage();
  await checkout.clickFinishButton();
  await checkout.checkOrderConfirmation();
});
