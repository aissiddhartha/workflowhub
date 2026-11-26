import { Page } from '@playwright/test';

export const authLocators = (page: Page) => ({
  username: page.getByLabel('Username'),

  email: page.getByLabel('Email'),

  password: page.getByLabel('Password'),

  createAccountButton: page.getByRole('button', {
    name: 'Create an account',
    exact: true
  }),

  registerButton: page.getByRole('button', {
    name: 'Register',
    exact: true
  }),

  loginButton: page.getByRole('button', {
    name: 'Log in',
    exact: true
  }),

  accountMenu: page.getByRole('button', {
    name: 'Account menu'
  }),

  logoutButton: page.getByRole('menuitem', {
    name: 'Log out'
  }),

  dashboardHeading: page.getByRole('heading', {
    name: 'WorkFlowHub Sprint Board'
  }),

  loginHeading: page.getByRole('heading', {
    name: 'Welcome back'
  }),

  errorMessage: page.getByRole('alert')
});