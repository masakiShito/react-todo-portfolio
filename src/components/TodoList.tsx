import TodoItem from './TodoItem';
import type { Task } from '../utils/types';

/**
 * TodoList コンポーネント Props
 */
type TodoListProps = {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (updatedTask: Task) => void;
    filter: 'all' | 'completed' | 'incomplete';
};

/**
 * TodoList コンポーネント
 * タスク一覧をフィルターに応じて表示する
 *
 * @param {Task[]} tasks - 全タスク配列
 * @param {'all' | 'completed' | 'incomplete'} filter - 表示条件
 * @param {Function} onToggle - 完了状態の切り替え関数
 * @param {Function} onDelete - タスク削除関数
 * @param {Function} onEdit - タスク編集関数
 */
const TodoList = ({ tasks, onToggle, onDelete, onEdit, filter }: TodoListProps) => {
    /**
     * フィルター条件に応じてタスクリストをフィルタリング
     */
    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true; // 'all'
    });

    return (
        <div className="flex flex-col gap-3">
            {filteredTasks.length === 0 ? (
                <p className="text-center text-green-500">タスクはありません</p>
            ) : (
                filteredTasks.map((task) => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))
            )}
        </div>
    );
};

export default TodoList;