import { Page, expect, Locator } from '@playwright/test';

export default class ProductsPage {
  readonly backToProductsButton: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartButton: Locator;
  readonly title: Locator;
  /** Generic add-to-cart button used on the product detail page (single item in view) */
  readonly addToCartButton: Locator;
  /** Generic remove button used on the product detail page (single item in view) */
  readonly removeButton: Locator;

  constructor(public page: Page) {
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.shoppingCartButton = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.title = page.locator('[data-test="title"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
  }

  /**
   * Returns the add-to-cart button for a specific product by its slug.
   * Example: addToCart('sauce-labs-onesie')
   */
  addToCart(productSlug: string): Locator {
    return this.page.locator(`[data-test="add-to-cart-${productSlug}"]`);
  }

  /**
   * Returns the remove button for a specific product by its slug.
   * Example: removeFromCart('sauce-labs-onesie')
   */
  removeFromCart(productSlug: string): Locator {
    return this.page.locator(`[data-test="remove-${productSlug}"]`);
  }

  /**
   * Returns the title link for a specific product by its item ID.
   * Example: productTitleLink(0) => Sauce Labs Bike Light
   */
  productTitleLink(itemId: number): Locator {
    return this.page.locator(`[data-test="item-${itemId}-title-link"]`);
  }

  async clickShoppingCartButton() {
    await this.shoppingCartButton.click();
  }

  async clickAddToCartButton() {
    await this.addToCartButton.click();
  }

  async clickRemoveButton() {
    await this.removeButton.click();
  }

  async clickBackToProductsButton() {
    await this.backToProductsButton.click();
  }

  async checkTitle(title: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText(title);
  }

  async assertCartBadgeCount(expected: number) {
    await expect(this.shoppingCartBadge).toBeVisible();
    await expect(this.shoppingCartBadge).toContainText(String(expected));
  }

  async assertCartIsEmpty() {
    await expect(this.shoppingCartBadge).not.toBeVisible();
  }
}
