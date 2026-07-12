import { Page, expect, Locator } from '@playwright/test';

/**
 * Shared app header, present on every signed-in Swag Labs page (and the logo on
 * the login page): the Swag Labs title, the cart icon + item badge, and the
 * burger button that opens the sidebar navigation. Owned by no single page —
 * composed into page objects and injected as the `appHeader` fixture.
 */
export default class HeaderComponent {
  readonly swagLabsLogo: Locator;
  readonly openMenuButton: Locator;
  readonly cartButton: Locator;
  readonly cartBadge: Locator;

  constructor(public page: Page) {
    this.swagLabsLogo = page.getByText('Swag Labs');
    this.openMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.cartButton = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async openMenu() {
    await this.openMenuButton.click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async checkSwagLabsLogo() {
    await expect(this.swagLabsLogo).toBeVisible();
  }

  async checkCartCount(itemAmount: number) {
    if (itemAmount === 0) {
      await expect(this.cartBadge).not.toBeVisible();
    } else {
      const string = itemAmount.toString();
      await expect(this.cartBadge).toBeVisible();
      await expect(this.cartBadge).toContainText(string);
    }
  }
}
