import type { Task } from './types';

export type TaskInput = {
  title: string;
  description?: string;
  priority: Task['priority'];
  tag: Task['tag'];
  dueDate?: string; // datetime-local string or ISO
  startDate?: string; // yyyy-mm-dd
  endDate?: string; // yyyy-mm-dd
};

export type ValidationResult = {
  valid: boolean;
  errors: Record<string, string>;
};

export function validateTask(
  input: TaskInput,
  existing: Task[],
  options?: { excludeId?: string }
): ValidationResult {
  const errors: Record<string, string> = {};

  const title = (input.title ?? '').trim();
  const desc = (input.description ?? '').trim();

  if (!title) errors.title = 'タイトルは必須です';
  if (title && title.length > 100) errors.title = '100文字以内で入力してください';

  const normalizedTitle = title.toLowerCase();
  const isDup = existing.some((t) => {
    if (options?.excludeId && t.id === options.excludeId) return false;
    return t.title.trim().toLowerCase() === normalizedTitle;
  });
  if (!errors.title && isDup) errors.title = '同じタイトルが既に存在します';

  if (desc.length > 1000) errors.description = '1000文字以内で入力してください';

  const priority = input.priority ?? '' as string;
  const tag = input.tag ?? '' as string;
  if (!['高', '中', '低'].includes(priority)) errors.priority = '優先度が不正です';
  if (!['開発', 'レビュー', 'MTG', 'その他'].includes(tag)) errors.tag = 'タグが不正です';

  if (input.dueDate) {
    const d = new Date(input.dueDate);
    if (isNaN(d.getTime())) errors.dueDate = '期限の形式が不正です';
    else if (d.getTime() < Date.now()) errors.dueDate = '過去の日時は設定できません';
  }

  if (input.startDate) {
    const d = new Date(`${input.startDate}T00:00:00`);
    if (isNaN(d.getTime())) errors.startDate = '開始日の形式が不正です';
  }

  if (input.endDate) {
    const d = new Date(`${input.endDate}T00:00:00`);
    if (isNaN(d.getTime())) errors.endDate = '終了日の形式が不正です';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
