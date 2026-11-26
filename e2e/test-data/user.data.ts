import { randomUUID } from 'node:crypto';

export interface TestUser {
  username: string;
  email: string;
  password: string;
}

export function generateUser(): TestUser {
  const id = randomUUID().replace(/-/g, '');

  return {
    username: `qa_${id}`,
    email: `qa_${id}@example.com`,
    password: 'Workflow@123'
  };
}

export const invalidUser = {
  username: 'invalid_user',
  password: 'InvalidPassword123'
};