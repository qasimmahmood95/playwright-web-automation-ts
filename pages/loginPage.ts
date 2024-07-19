import { Page, expect, Locator } from '@playwright/test';

export default class LoginPage {
  readonly swagLabsLogo: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly productsTitle: Locator;
  readonly loginError: Locator;
  readonly openSidebarMenuButton: Locator;
  readonly resetAppStateButton: Locator;
  readonly logoutButton: Locator;

  constructor(public page: Page) {
    this.swagLabsLogo = page.getByText('Swag Labs');
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.productsTitle = page.locator('[data-test="title"]');
    this.loginError = page.locator('[data-test="error"]');
    this.openSidebarMenuButton = page.getByRole('button', { name: 'Open Menu' });
    this.resetAppStateButton = page.locator('[data-test="reset-sidebar-link"]');
    this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.page.waitForLoadState('domcontentloaded');
    await this.checkSwagLabsLogo();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async enterUsername(username: string) {
    await this.usernameField.fill(username);
  }

  async enterPassword(password: string) {
    await this.passwordField.fill(password);
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async clickOpenSidebarMenuButton() {
    await this.openSidebarMenuButton.click();
  }

  async clickResetAppStateButton() {
    await this.resetAppStateButton.click();
  }

  async clickLogoutButton() {
    await this.logoutButton.click();
  }

  async checkSwagLabsLogo() {
    await expect(this.swagLabsLogo).toBeVisible();
  }

  async checkProductsTitle() {
    await expect(this.productsTitle).toBeVisible();
  }

  async checkLoginError() {
    await expect(this.loginError).toBeVisible();
    await expect(this.loginError).toContainText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  }
}
