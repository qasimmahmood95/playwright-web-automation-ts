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
    this.addToCartButton = page.getByTestId('add-to-cart');
    this.removeButton = page.getByTestId('remove');
    this.backToProductsButton = page.getByTestId('back-to-products');
    this.shoppingCartButton = page.getByTestId('shopping-cart-link');
    this.shoppingCartBadge = page.getByTestId('shopping-cart-badge');
    this.bikeLightTitle = page.getByTestId('item-0-title-link');
    this.onesieAddToCartButton = page.getByTestId('add-to-cart-sauce-labs-onesie');
    this.onesieRemoveButton = page.getByTestId('remove-sauce-labs-onesie');
    this.bikeLightRemoveButton = page.getByTestId('remove-sauce-labs-bike-light');
    this.bikeLightAddToCartButton = page.getByTestId('add-to-cart-sauce-labs-bike-light');
    this.title = page.getByTestId('title');
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
    if (itemAmount === 0) {
      await expect(this.shoppingCartBadge).not.toBeVisible();
    } else {
      const string = itemAmount.toString();
      await expect(this.shoppingCartBadge).toBeVisible();
      await expect(this.shoppingCartBadge).toContainText(string);
    }
  }
}
