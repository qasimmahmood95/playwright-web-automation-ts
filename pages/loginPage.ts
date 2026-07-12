import { Page, expect, Locator } from '@playwright/test';
import HeaderComponent from '@/components/HeaderComponent';

export default class LoginPage {
  readonly header: HeaderComponent;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly productsTitle: Locator;
  readonly loginError: Locator;

  constructor(public page: Page) {
    this.header = new HeaderComponent(page);
    this.usernameField = page.getByTestId('username');
    this.passwordField = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.productsTitle = page.getByTestId('title');
    this.loginError = page.getByTestId('error');
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
    await this.checkSwagLabsLogo();
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

  async checkSwagLabsLogo() {
    await this.header.checkSwagLabsLogo();
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
