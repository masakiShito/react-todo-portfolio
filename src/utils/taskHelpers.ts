import { v4 as uuidv4 } from 'uuid';
import type { Task, History, Comment, TaskStatus } from './types';

/**
 * 履歴エントリーを作成する
 */
export const createHistoryEntry = (
    type: History['type'],
    message: string,
    diff?: History['diff']
): History => ({
    id: uuidv4(),
    type,
    message,
    at: new Date().toISOString(),
    diff,
});

/**
 * タスク作成時の履歴を追加
 */
export const createTaskWithHistory = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'history'>): Task => {
    const now = new Date().toISOString();
    const task: Task = {
        ...taskData,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        comments: [],
        history: [
            createHistoryEntry('created', 'タスクを作成しました'),
        ],
    };
    return task;
};

/**
 * タスク更新時に差分を検出して履歴を追加
 */
export const updateTaskWithHistory = (oldTask: Task, updates: Partial<Task>): Task => {
    const now = new Date().toISOString();
    const newHistory: History[] = [];

    // タイトル変更
    if (updates.title !== undefined && updates.title !== oldTask.title) {
        newHistory.push(
            createHistoryEntry('updated', 'タイトルを変更しました', {
                field: 'title',
                oldValue: oldTask.title,
                newValue: updates.title,
            })
        );
    }

    // 説明変更
    if (updates.description !== undefined && updates.description !== oldTask.description) {
        newHistory.push(
            createHistoryEntry('updated', '説明を変更しました', {
                field: 'description',
                oldValue: oldTask.description || '',
                newValue: updates.description,
            })
        );
    }

    // ステータス変更
    if (updates.status !== undefined && updates.status !== oldTask.status) {
        const statusLabels: Record<TaskStatus, string> = {
            todo: '未着手',
            in_progress: '進行中',
            done: '完了',
        };
        newHistory.push(
            createHistoryEntry('status_changed', `ステータスを ${statusLabels[oldTask.status]} → ${statusLabels[updates.status]} に変更しました`, {
                field: 'status',
                oldValue: oldTask.status,
                newValue: updates.status,
            })
        );
    }

    // 優先度変更
    if (updates.priority !== undefined && updates.priority !== oldTask.priority) {
        newHistory.push(
            createHistoryEntry('updated', `優先度を ${oldTask.priority || 'なし'} → ${updates.priority} に変更しました`, {
                field: 'priority',
                oldValue: oldTask.priority,
                newValue: updates.priority,
            })
        );
    }

    // タグ変更
    if (updates.tag !== undefined && updates.tag !== oldTask.tag) {
        newHistory.push(
            createHistoryEntry('updated', `タグを ${oldTask.tag || 'なし'} → ${updates.tag} に変更しました`, {
                field: 'tag',
                oldValue: oldTask.tag,
                newValue: updates.tag,
            })
        );
    }

    // 期限変更
    if (updates.endDate !== undefined && updates.endDate !== oldTask.endDate) {
        newHistory.push(
            createHistoryEntry('updated', '期限を変更しました', {
                field: 'endDate',
                oldValue: oldTask.endDate,
                newValue: updates.endDate,
            })
        );
    }

    const updatedTask: Task = {
        ...oldTask,
        ...updates,
        updatedAt: now,
        history: [...(oldTask.history || []), ...newHistory],
    };

    return updatedTask;
};

/**
 * コメントを追加してタスクを更新
 */
export const addCommentToTask = (task: Task, body: string, author: string = 'me'): Task => {
    const now = new Date().toISOString();
    const newComment: Comment = {
        id: uuidv4(),
        body,
        author,
        createdAt: now,
    };

    const commentHistory = createHistoryEntry(
        'comment_added',
        'コメントを追加しました'
    );

    return {
        ...task,
        updatedAt: now,
        comments: [...(task.comments || []), newComment],
        history: [...(task.history || []), commentHistory],
    };
};

/**
 * コメントを削除してタスクを更新
 */
export const removeCommentFromTask = (task: Task, commentId: string): Task => {
    const now = new Date().toISOString();
    return {
        ...task,
        updatedAt: now,
        comments: (task.comments || []).filter((c) => c.id !== commentId),
    };
};

/**
 * タスクの完了/未完了を切り替え
 */
export const toggleTaskCompletion = (task: Task): Task => {
    const nextCompleted = !task.completed;
    const nextStatus: TaskStatus = nextCompleted ? 'done' : 'todo';

    return updateTaskWithHistory(task, {
        completed: nextCompleted,
        status: nextStatus,
    });
};
