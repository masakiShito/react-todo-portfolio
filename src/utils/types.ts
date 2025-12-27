// utils/types.ts

/** タスクの優先度 */
export type Priority = '低' | '中' | '高';

/** タスクのタグ */
export type Tag = '開発' | 'レビュー' | 'MTG' | 'その他';

/** タスク構造 */
export type TaskStatus = 'todo' | 'in_progress' | 'done';

/** コメント構造 */
export type Comment = {
    id: string;
    body: string;
    author: string;         // 投稿者（今回は "me" で固定）
    createdAt: string;      // ISO文字列
};

/** 履歴の種類 */
export type HistoryType = 'created' | 'updated' | 'status_changed' | 'comment_added';

/** 履歴構造 */
export type History = {
    id: string;
    type: HistoryType;
    message: string;        // 表示用メッセージ
    at: string;             // ISO文字列
    diff?: {                // 変更差分（オプション）
        field: string;
        oldValue?: string;
        newValue?: string;
    };
};

/** タスク構造 */
export type Task = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    status: TaskStatus;
    dueDate?: string;       // ISO文字列（例: '2025-08-01T17:00'）※後方互換のため残す
    startDate?: string;     // 開始日（ISO文字列またはyyyy-mm-dd）
    endDate?: string;       // 終了日（ISO文字列またはyyyy-mm-dd）
    priority?: Priority;    // 優先度（オプション）
    tag?: Tag;              // タグ（オプション）
    createdAt?: string;     // 作成日時（ISO文字列）※後方互換のためオプション
    updatedAt?: string;     // 更新日時（ISO文字列）※後方互換のためオプション
    comments?: Comment[];   // コメント配列（後方互換のためオプション）
    history?: History[];    // 履歴配列（後方互換のためオプション）
};
