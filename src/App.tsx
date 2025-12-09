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
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] antialiased">
            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-semibold tracking-tight">Todo</h1>
                        <div className="text-sm opacity-70">シンプルに、進める。</div>
                    </div>
                </header>

                {/* 2-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Input area */}
                    <section className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                        <h2 className="text-lg font-medium mb-4">新規タスク</h2>
                        {/* Input */}
                        <TodoInput onAddTask={handleAddTask} tasks={tasks} />
                    </section>

                    {/* Right: Task list */}
                    <section className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-medium">タスク一覧</h2>
                            {/* Filter Tabs */}
                            <FilterTabs currentFilter={filter} onChange={setFilter} />
                        </div>
                        {/* List */}
                        <TodoList
                            tasks={tasks}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                            onEdit={handleEditTask}
                            filter={filter}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;