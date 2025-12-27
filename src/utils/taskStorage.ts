import type { Task, TaskStatus } from './types';

export type TaskStore = {
  version: 1;
  tasks: Task[];
};

export const TASK_STORE_VERSION = 1;

const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

const normalizeStatus = (status?: string, completed?: boolean): TaskStatus => {
  if (status && validStatuses.includes(status as TaskStatus)) {
    return status as TaskStatus;
  }
  return completed ? 'done' : 'todo';
};

const normalizeDueDate = (dueDate?: string): string | undefined => {
  if (!dueDate) return undefined;
  const date = new Date(dueDate);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const normalizeTask = (raw: Partial<Task>): Task => {
  const status = normalizeStatus(raw.status, raw.completed);
  return {
    id: raw.id ?? crypto.randomUUID(),
    title: raw.title ?? 'Untitled',
    description: raw.description ?? '',
    completed: status === 'done',
    status,
    dueDate: normalizeDueDate(raw.dueDate),
    priority: raw.priority,
    tag: raw.tag,
  };
};

export const createEmptyTaskStore = (): TaskStore => ({
  version: TASK_STORE_VERSION,
  tasks: [],
});

export const migrateTaskStore = (raw: unknown): TaskStore => {
  if (!raw) return createEmptyTaskStore();

  if (Array.isArray(raw)) {
    return {
      version: TASK_STORE_VERSION,
      tasks: raw.map((task) => normalizeTask(task)),
    };
  }

  if (typeof raw === 'object' && raw !== null) {
    const maybeStore = raw as { version?: number; tasks?: unknown };
    if (Array.isArray(maybeStore.tasks)) {
      return {
        version: TASK_STORE_VERSION,
        tasks: maybeStore.tasks.map((task) => normalizeTask(task as Partial<Task>)),
      };
    }
  }

  return createEmptyTaskStore();
};
