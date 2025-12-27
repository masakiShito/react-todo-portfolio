import type { Task } from './types';

export type TaskInput = {
  title: string;
  description?: string;
  priority: Task['priority'];
  tag: Task['tag'];
  dueDate?: string; // datetime-local string or ISO（後方互換）
  startDate?: string; // date string
  endDate?: string; // date string
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

  // dueDateの検証（後方互換）
  if (input.dueDate) {
    const d = new Date(input.dueDate);
    if (isNaN(d.getTime())) errors.dueDate = '期限の形式が不正です';
    else if (d.getTime() < Date.now()) errors.dueDate = '過去の日時は設定できません';
  }

  // startDate/endDateの検証
  if (input.startDate) {
    const d = new Date(input.startDate);
    if (isNaN(d.getTime())) {
      errors.startDate = '開始日の形式が不正です';
    }
  }

  if (input.endDate) {
    const d = new Date(input.endDate);
    if (isNaN(d.getTime())) {
      errors.endDate = '終了日の形式が不正です';
    }
  }

  // startとendの両方が入力されている場合の整合性チェック
  // 注: normalizeDateRangeで自動入れ替えされるため、ここでは検証をスキップ
  // エラーにする場合は以下のコメントを外す
  // if (input.startDate && input.endDate && !errors.startDate && !errors.endDate) {
  //   const start = new Date(input.startDate);
  //   const end = new Date(input.endDate);
  //   if (start > end) {
  //     errors.startDate = '開始日は終了日より前である必要があります';
  //   }
  // }

  return { valid: Object.keys(errors).length === 0, errors };
}
