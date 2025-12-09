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
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 mb-2">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 accent-[#38BDF8]"
                />
                {isEditing ? (
                    <div className="flex-1 space-y-2">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
                        />
                    </div>
                ) : (
                    <div className="flex-1">
                        <p className={`font-medium text-[#F8FAFC] ${task.completed ? 'line-through text-[#F8FAFC]/60' : ''}`}>
                            {task.title}
                        </p>
                        {task.description && (
                            <p className="text-sm text-[#F8FAFC]/80 whitespace-pre-wrap">{task.description}</p>
                        )}

                        {/* 追加情報（締切・優先度・タグ） */}
                        <div className="text-xs text-[#F8FAFC]/70 mt-1 space-x-2">
                            {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleString()}</span>}
                            {task.priority && <span>🔥 優先度: {task.priority}</span>}
                            {task.tag && <span>🏷️ {task.tag}</span>}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-3 flex gap-2">
                {isEditing ? (
                    <>
                        <button onClick={handleSave} className="px-3 py-1.5 text-sm rounded-lg bg-[#38BDF8] text-[#0F172A] hover:opacity-95">
                            保存
                        </button>
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15">
                            キャンセル
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15">
                            編集
                        </button>
                        <button onClick={() => onDelete(task.id)} className="px-3 py-1.5 text-sm rounded-lg bg-[#38BDF8] text-[#0F172A] hover:opacity-95">
                            削除
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default TodoItem;