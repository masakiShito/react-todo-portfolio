import type { Task } from '../utils/types';
import { getStatusLabel } from '../utils/status';

/**
 * 単一タスクを表示するコンポーネント
 * @param task - タスク情報
 * @param onToggle - 完了状態の切り替えコールバック
 * @param onDelete - タスク削除コールバック
 * @param onEditRequest - タスク編集リクエストコールバック
 */
const TodoItem = ({
                      task,
                      onToggle,
                      onDelete,
                      onEditRequest,
                  }: {
    task: Task;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEditRequest: (task: Task) => void;
}) => {
    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 mb-2">
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggle(task.id)}
                    className="mt-1 accent-[#38BDF8]"
                />
                <div className="flex-1">
                    <p className={`font-medium text-[#F8FAFC] ${task.completed ? 'line-through text-[#F8FAFC]/60' : ''}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-sm text-[#F8FAFC]/80 whitespace-pre-wrap">{task.description}</p>
                    )}

                    {/* 追加情報（締切・優先度・タグ） */}
                    <div className="text-xs text-[#F8FAFC]/70 mt-1 space-x-2">
                        <span className="rounded-full bg-white/10 px-2 py-0.5">
                            状態: {getStatusLabel(task.status)}
                        </span>
                        {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleString()}</span>}
                        {task.priority && <span>🔥 優先度: {task.priority}</span>}
                        {task.tag && <span>🏷️ {task.tag}</span>}
                    </div>
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                <button onClick={() => onEditRequest(task)} className="px-3 py-1.5 text-sm rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15">
                    編集
                </button>
                <button onClick={() => onDelete(task.id)} className="px-3 py-1.5 text-sm rounded-lg bg-[#38BDF8] text-[#0F172A] hover:opacity-95">
                    削除
                </button>
            </div>
        </div>
    );
};

export default TodoItem;
