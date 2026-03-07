import { test } from '../fixtures';
import { Products } from '../utils/helpers';

/**
 * Products tests start from an authenticated session (storageState from global-setup).
 * afterEach resets cart state via the sidebar to ensure test isolation.
 */
test.beforeEach(async ({ page }) => {
  await page.goto('/inventory.html');
});

test.afterEach(async ({ loginPage }) => {
  await loginPage.resetAndLogout();
});

test.describe('Products — smoke @smoke', () => {
  test('inventory page displays the products title', async ({ productsPage }) => {
    await productsPage.checkTitle('Products');
  });

  test('adding a single item to the cart updates the badge count', async ({ productsPage }) => {
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.assertCartBadgeCount(1);
  });

  test('removing an item from the cart clears the badge', async ({ productsPage }) => {
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.assertCartBadgeCount(1);
    await productsPage.removeFromCart(Products.ONESIE).click();
    await productsPage.assertCartIsEmpty();
  });
});

test.describe('Products — regression @regression', () => {
  test('adding multiple items to the cart shows correct badge count', async ({ productsPage }) => {
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.addToCart(Products.BIKE_LIGHT).click();
    await productsPage.assertCartBadgeCount(2);
  });

  test('navigating to the cart shows the correct page title', async ({ productsPage }) => {
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.clickShoppingCartButton();
    await productsPage.checkTitle('Your Cart');
  });

  test('navigating to a product detail page and adding to cart from there', async ({
    productsPage,
  }) => {
    await productsPage.productTitleLink(0).click();
    await productsPage.clickAddToCartButton();
    await productsPage.assertCartBadgeCount(1);
    await productsPage.clickBackToProductsButton();
    await productsPage.checkTitle('Products');
  });

  test('removing an item from within the product detail page clears the badge', async ({
    productsPage,
  }) => {
    await productsPage.productTitleLink(0).click();
    await productsPage.clickAddToCartButton();
    await productsPage.assertCartBadgeCount(1);
    await productsPage.clickRemoveButton();
    await productsPage.assertCartIsEmpty();
  });

  test('removing items from the cart page updates the badge correctly', async ({
    productsPage,
  }) => {
    await productsPage.addToCart(Products.ONESIE).click();
    await productsPage.addToCart(Products.BIKE_LIGHT).click();
    await productsPage.assertCartBadgeCount(2);

    await productsPage.clickShoppingCartButton();
    await productsPage.removeFromCart(Products.ONESIE).click();
    await productsPage.assertCartBadgeCount(1);

    await productsPage.removeFromCart(Products.BIKE_LIGHT).click();
    await productsPage.assertCartIsEmpty();
  });

  test('cart badge is not visible when no items have been added', async ({ productsPage }) => {
    await productsPage.assertCartIsEmpty();
  });
});
