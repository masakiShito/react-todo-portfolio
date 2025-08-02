// utils/types.ts

/** タスクの優先度 */
export type Priority = '低' | '中' | '高';

/** タスクのタグ */
export type Tag = '開発' | 'レビュー' | 'MTG' | 'その他';

/** タスク構造 */
export type Task = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    dueDate?: string;       // ISO文字列（例: '2025-08-01T17:00'）
    priority?: Priority;    // 優先度（オプション）
    tag?: Tag;              // タグ（オプション）
};