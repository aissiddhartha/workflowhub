import { Page } from '@playwright/test';

export const boardLocators = (page: Page) => ({
  column: (status: string) =>
    page.locator(`section[data-status="${status}"]`),

  taskCard: (title: string) =>
    page.locator('article').filter({
      has: page.getByRole('heading', {
        name: title,
        exact: true
      })
    }),

  titleInput: page.getByLabel('Title', {
    exact: true
  }),

  saveButton: page.getByRole('button', {
    name: 'Save',
    exact: true
  })
});