import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.BASE_URL?.trim();

if (!baseURL) {
  throw new Error('BASE_URL is required.');
}

const parsedURL = new URL(baseURL);

if (!['http:', 'https:'].includes(parsedURL.protocol)) {
  throw new Error('BASE_URL must use HTTP or HTTPS.');
}

export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 30000,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
  launchOptions: {
    slowMo: Number(process.env.SLOW_MO || 0),
  },
    baseURL,

    trace: 'retain-on-failure',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});