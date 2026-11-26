import { test, expect } from '@playwright/test';

import {
  registerAndLogin
} from '../helpers/auth.helper';

import {
  createTask,
  editTask,
  deleteTask,
  moveTask
} from '../helpers/board.helper';

import {
  generateUser
} from '../test-data/user.data';

import {
  generateTaskTitle,
  taskStatus,
  taskPriority
} from '../test-data/task.data';

import {
  boardLocators
} from '../locators/board.locators';


test.describe('Workflow Item Tests', () => {

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page, generateUser());
  });


  test('TC05 - Create a workflow item', async ({ page }) => {
    const title = generateTaskTitle();

    await createTask(page, title);

    await expect(
      boardLocators(page).taskCard(title)
    ).toBeVisible();
  });


  test('TC06 - Edit a workflow item', async ({ page }) => {
    const originalTitle = generateTaskTitle();
    const updatedTitle = generateTaskTitle('Updated Task');

    await createTask(page, originalTitle);

    await editTask(page, originalTitle, updatedTitle);

    await expect(
      boardLocators(page).taskCard(updatedTitle)
    ).toBeVisible();

    await expect(
      boardLocators(page).taskCard(originalTitle)
    ).toHaveCount(0);
  });


  test('TC07 - Delete a workflow item', async ({ page }) => {
    const title = generateTaskTitle();

    await createTask(page, title);
    await deleteTask(page, title);

    await expect(
      boardLocators(page).taskCard(title)
    ).toHaveCount(0);
  });


  test('TC08 - Change workflow status', async ({ page }) => {
    const title = generateTaskTitle();

    await createTask(page, title);

    await moveTask(page, title, taskStatus.inProgress);

    await expect(
      boardLocators(page)
        .column(taskStatus.inProgress)
        .getByRole('heading', {
          name: title,
          exact: true
        })
    ).toBeVisible();
  });


  test('TC09 - Create a high priority task', async ({ page }) => {
    const title = generateTaskTitle();

    await createTask(
      page,
      title,
      taskStatus.backlog,
      taskPriority.high
    );

    await expect(
      boardLocators(page)
        .taskCard(title)
        .getByText('High', { exact: true })
    ).toBeVisible();
  });


  test('TC10 - Verify persistence after refresh', async ({ page }) => {
    const title = generateTaskTitle();

    await createTask(page, title);

    await page.reload();

    await expect(
      boardLocators(page).taskCard(title)
    ).toBeVisible();
  });

});