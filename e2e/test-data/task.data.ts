import { randomUUID } from 'node:crypto';

export function generateTaskTitle(
  prefix = 'Automation Task'
) {
  return `${prefix} ${randomUUID().slice(0, 8)}`;
}

export const taskStatus = {
  backlog: 'Backlog',
  inProgress: 'In Progress'
};

export const taskPriority = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};