import { test, expect } from '@playwright/test';

import {
  navigateToApp,
  registerUser,
  loginUser,
  logoutUser,
  registerAndLogin
} from '../helpers/auth.helper';

import {
  generateUser,
  invalidUser
} from '../test-data/user.data';

import {
  authLocators
} from '../locators/auth.locators';


test.describe('Authentication Tests', () => {

  test.beforeEach(async ({ page }) => {
    await navigateToApp(page);
  });


  test('TC01 - Register with valid details', async ({ page }) => {
    const user = generateUser();

    await registerUser(page, user);

    await expect(
      authLocators(page).dashboardHeading
    ).toBeVisible();
  });


  test('TC02 - Login with valid credentials', async ({ page }) => {
    const user = generateUser();

    await registerAndLogin(page, user);
    await logoutUser(page);

    await expect(
      authLocators(page).loginHeading
    ).toBeVisible();

    await loginUser(
      page,
      user.username,
      user.password
    );

    await expect(
      authLocators(page).dashboardHeading
    ).toBeVisible();
  });


  test('TC03 - Reject invalid credentials', async ({ page }) => {
    await loginUser(
      page,
      invalidUser.username,
      invalidUser.password
    );

    await expect(
      authLocators(page).errorMessage
    ).toBeVisible();
  });


  test('TC04 - Logout successfully', async ({ page }) => {
    const user = generateUser();

    await registerAndLogin(page, user);
    await logoutUser(page);

    await expect(
      authLocators(page).loginHeading
    ).toBeVisible();
  });

});