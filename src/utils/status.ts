import type { TaskStatus } from './types';

export const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  done: 'Done',
};

export const getStatusLabel = (status: TaskStatus) => statusLabels[status] ?? status;
