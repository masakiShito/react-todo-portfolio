import { useState } from 'react';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import type { Task } from './utils/types';
import { useLocalStorage } from './hooks/useLocalStorage';

/**
 * アプリ全体のメインコンポーネント
 */
function App() {
    // タスクリストを localStorage に保存
    const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

    /** タスク追加 */
    const handleAddTask = (task: Task) => {
        setTasks([...tasks, task]);
    };

    /** タスク削除 */
    const handleDeleteTask = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    /** タスク完了状態の切り替え */
    const handleToggleTask = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    /** タスク編集 */
    const handleEditTask = (updatedTask: Task) => {
        setTasks(
            tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
    };

    return (
        <div className="min-h-screen bg-green-50 text-green-900 transition-colors">
            <div className="max-w-2xl mx-auto px-4 py-8">

                {/* ↓ 以下いつものUI */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">📋 TODOリスト</h1>
                </div>

                <TodoInput onAddTask={handleAddTask} />
                <FilterTabs currentFilter={filter} onChange={setFilter} />
                <TodoList
                    tasks={tasks}
                    onToggle={handleToggleTask}
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                    filter={filter}
                />
            </div>
        </div>
    );
}

export default App;