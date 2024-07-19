import { Page, expect, Locator } from '@playwright/test';

export default class ProductsPage {
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;
  readonly shoppingCartBadge: Locator;
  readonly shoppingCartButton: Locator;
  readonly onesieAddToCartButton: Locator;
  readonly onesieRemoveButton: Locator;
  readonly bikeLightAddToCartButton: Locator;
  readonly bikeLightTitle: Locator;
  readonly title: Locator;
  readonly bikeLightRemoveButton: Locator;

  constructor(public page: Page) {
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.removeButton = page.locator('[data-test="remove"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
    this.shoppingCartButton = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.bikeLightTitle = page.locator('[data-test="item-0-title-link"]');
    this.onesieAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');
    this.onesieRemoveButton = page.locator('[data-test="remove-sauce-labs-onesie"]');
    this.bikeLightRemoveButton = page.locator('[data-test="remove-sauce-labs-bike-light"]');
    this.bikeLightAddToCartButton = page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]');
    this.title = page.locator('[data-test="title"]');
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

  async clickBikeLightTitle() {
    await this.bikeLightTitle.click();
  }

  async clickOnesieAddToCartButton() {
    await this.onesieAddToCartButton.click();
  }

  async checkOnesieRemoveButton() {
    await expect(this.onesieRemoveButton).toBeVisible();
  }

  async clickOnesieRemoveButton() {
    await this.onesieRemoveButton.click();
  }

  async clickBikeLightAddToCartButton() {
    await this.bikeLightAddToCartButton.click();
  }

  async checkBikeLightRemoveButton() {
    await expect(this.bikeLightRemoveButton).toBeVisible();
  }

  async clickBikeLightRemoveButton() {
    await this.bikeLightRemoveButton.click();
  }

  async checkTitle(title: string) {
    await expect(this.title).toBeVisible();
    await expect(this.title).toContainText(title);
  }

  async checkShoppingCartHasItems(itemAmount: number) {
    await this.page.waitForLoadState('load');
    await this.page.waitForLoadState('domcontentloaded');

    if (itemAmount == 0) {
      await expect(this.shoppingCartBadge).not.toBeVisible();
    } else {
      const string = itemAmount.toString();
      await expect(this.shoppingCartBadge).toBeVisible();
      await expect(this.shoppingCartBadge).toContainText(string);
    }
  }
}
