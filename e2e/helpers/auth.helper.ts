import { Page, expect } from '@playwright/test';
import { authLocators } from '../locators/auth.locators';
import { TestUser } from '../test-data/user.data';

export async function navigateToApp(page: Page) {
  await page.goto('/');
}

export async function registerUser(
  page: Page,
  user: TestUser
) {
  const locators = authLocators(page);

  await locators.createAccountButton.click();

  await locators.username.fill(user.username);
  await locators.email.fill(user.email);
  await locators.password.fill(user.password);

  await locators.registerButton.click();
}

export async function loginUser(
  page: Page,
  username: string,
  password: string
) {
  const locators = authLocators(page);

  await locators.username.fill(username);
  await locators.password.fill(password);

  await locators.loginButton.click();
}

export async function logoutUser(page: Page) {
  const locators = authLocators(page);

  await locators.accountMenu.click();
  await locators.logoutButton.click();
}

export async function registerAndLogin(
  page: Page,
  user: TestUser
) {
  await navigateToApp(page);
  await registerUser(page, user);

  await expect(
    authLocators(page).dashboardHeading
  ).toBeVisible();
}