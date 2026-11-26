import { Page, expect } from '@playwright/test';
import { boardLocators } from '../locators/board.locators';

export async function createTask(
  page: Page,
  title: string,
  status = 'Backlog',
  priority = 'Medium'
) {
  const column = boardLocators(page).column(status);

  await column.getByRole('button', {
    name: '+ Add task',
    exact: true
  }).click();

  await column.getByPlaceholder('Task title').fill(title);

  await column.getByLabel('Priority').selectOption(priority);

  await column.getByRole('button', {
    name: 'Add',
    exact: true
  }).click();

  await expect(
    boardLocators(page).taskCard(title)
  ).toBeVisible();
}

export async function editTask(
  page: Page,
  oldTitle: string,
  newTitle: string
) {
  const locators = boardLocators(page);

  await locators.taskCard(oldTitle).getByRole('button', {
    name: 'Edit task'
  }).click();

  await locators.titleInput.fill(newTitle);
  await locators.saveButton.click();

  await expect(
    locators.taskCard(newTitle)
  ).toBeVisible();
}

export async function deleteTask(
  page: Page,
  title: string
) {
  page.once('dialog', dialog => dialog.accept());

  await boardLocators(page)
    .taskCard(title)
    .getByRole('button', {
      name: 'Delete task'
    }).click();
}

export async function moveTask(
  page: Page,
  title: string,
  status: string
) {
  const locators = boardLocators(page);

  await locators.taskCard(title)
    .dragTo(locators.column(status));
}