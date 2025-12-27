import TodoItem from './TodoItem';
import type { Task } from '../utils/types';

/**
 * TodoList コンポーネント
 * タスク一覧をフィルターに応じて表示する
 *
 * @param {Task[]} tasks - 全タスク配列
 * @param {'all' | 'completed' | 'incomplete'} filter - 表示条件
 * @param {Function} onToggle - 完了状態の切り替え関数
 * @param {Function} onDelete - タスク削除関数
 * @param {Function} onEditRequest - タスク編集リクエスト関数
 */
const TodoList = ({ tasks, onToggle, onDelete, onEditRequest, filter }: { tasks: Task[]; onToggle: (id: string) => void; onDelete: (id: string) => void; onEditRequest: (task: Task) => void; filter: 'all' | 'completed' | 'incomplete'; }) => {
    /**
     * フィルター条件に応じてタスクリストをフィルタリング
     */
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true; // 'all'
    });

    return (
        <div className="space-y-3">
            {filteredTasks.length === 0 ? (
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 p-6 text-center">
                    <p className="text-zinc-500">タスクはありません</p>
                </div>
            ) : (
                filteredTasks.map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEditRequest={onEditRequest}
                    />
                ))
            )}
        </div>
    );
};

export default TodoList;
