import { useState } from 'react';
import type { Task } from '../utils/types';

/**
 * 単一タスクを表示するコンポーネント
 * @param task - タスク情報
 * @param onToggle - 完了状態の切り替えコールバック
 * @param onDelete - タスク削除コールバック
 * @param onEdit - タスク編集コールバック
 */
const TodoItem = ({
                      task,
                      onToggle,
                      onDelete,
                      onEdit,
                  }: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (task: Task) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [editedDescription, setEditedDescription] = useState(task.description || '');

    /** 編集を保存する処理 */
    const handleSave = () => {
        onEdit({ ...task, title: editedTitle, description: editedDescription });
        setIsEditing(false);
    };

    return (
        <div className="bg-white shadow-md rounded p-4 mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 flex-1">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 accent-green-600"
                />
                {isEditing ? (
                    <div className="flex-1">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full mb-2 px-3 py-2 border rounded"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                ) : (
                    <div>
                        <p className={`font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                            {task.title}
                        </p>
                        {task.description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>}

                        {/* 追加情報（締切・優先度・タグ） */}
                        <div className="text-xs text-gray-500 mt-1 space-x-2">
                            {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleString()}</span>}
                            {task.priority && <span>🔥 優先度: {task.priority}</span>}
                            {task.tag && <span>🏷️ {task.tag}</span>}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-4 flex gap-2">
                {isEditing ? (
                    <>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            保存
                        </button>
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-sm bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                            キャンセル
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-3 py-1 text-sm bg-yellow-400 text-white rounded hover:bg-yellow-500"
                        >
                            編集
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            削除
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;