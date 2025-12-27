import { useState } from 'react';
import { NavLink, Route, Routes, Navigate } from 'react-router-dom';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import TaskEditModal from './components/TaskEditModal';
import type { Task } from './utils/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createEmptyTaskStore, migrateTaskStore, type TaskStore } from './utils/taskStorage';

/**
 * アプリ全体のメインコンポーネント
 */
function App() {
    // タスクリストを localStorage に保存
    const [taskStore, setTaskStore] = useLocalStorage<TaskStore>(
        'todo-tasks',
        createEmptyTaskStore(),
        { deserialize: migrateTaskStore }
    );
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const tasks = taskStore.tasks;

    const updateTasks = (updater: Task[] | ((prev: Task[]) => Task[])) => {
        setTaskStore((prev) => {
            const nextTasks = typeof updater === 'function' ? updater(prev.tasks) : updater;
            return { ...prev, tasks: nextTasks };
        });
    };

    /** タスク追加 */
    const handleAddTask = (task: Task) => {
        updateTasks([...tasks, task]);
    };

    /** タスク削除 */
    const handleDeleteTask = (id: string) => {
        updateTasks(tasks.filter((task) => task.id !== id));
    };

    /** タスク完了状態の切り替え */
    const handleToggleTask = (id: string) => {
        updateTasks(
            tasks.map((task) => {
                if (task.id !== id) return task;
                const nextCompleted = !task.completed;
                return {
                    ...task,
                    completed: nextCompleted,
                    status: nextCompleted ? 'done' : 'todo',
                };
            })
        );
    };

    /** タスク編集 */
    const handleEditTask = (updatedTask: Task) => {
        const normalizedTask = {
            ...updatedTask,
            completed: updatedTask.status === 'done',
        };
        updateTasks(tasks.map((task) => (task.id === updatedTask.id ? normalizedTask : task)));
    };

    return (
        <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] antialiased">
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-4xl font-semibold tracking-tight">Todo</h1>
                        <div className="text-sm opacity-70">シンプルに、進める。</div>
                    </div>
                </header>

                {/* Responsive 3-column grid: input narrow, content wide */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Input area (span 1) */}
                    <section className="md:col-span-1 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                        <h2 className="text-lg font-medium mb-4">新規タスク</h2>
                        {/* Input */}
                        <TodoInput onAddTask={handleAddTask} tasks={tasks} />
                    </section>

                    {/* Right: Task views (span 2) */}
                    <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-lg font-medium">タスクビュー</h2>
                            <nav className="flex flex-wrap gap-2 text-sm">
                                <NavLink
                                    to="/"
                                    end
                                    className={({ isActive }) =>
                                        `px-3.5 py-1.5 rounded-lg border transition ${
                                            isActive
                                                ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                                : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                        }`
                                    }
                                >
                                    List
                                </NavLink>
                                <NavLink
                                    to="/board"
                                    className={({ isActive }) =>
                                        `px-3.5 py-1.5 rounded-lg border transition ${
                                            isActive
                                                ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                                : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                        }`
                                    }
                                >
                                    Board
                                </NavLink>
                                <NavLink
                                    to="/calendar"
                                    className={({ isActive }) =>
                                        `px-3.5 py-1.5 rounded-lg border transition ${
                                            isActive
                                                ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                                : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                        }`
                                    }
                                >
                                    Calendar
                                </NavLink>
                            </nav>
                        </div>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-medium">タスク一覧</h3>
                                            <FilterTabs currentFilter={filter} onChange={setFilter} />
                                        </div>
                                        <TodoList
                                            tasks={tasks}
                                            onToggle={handleToggleTask}
                                            onDelete={handleDeleteTask}
                                            onEditRequest={setEditingTask}
                                            filter={filter}
                                        />
                                    </div>
                                }
                            />
                            <Route
                                path="/board"
                                element={
                                    <KanbanBoard
                                        tasks={tasks}
                                        onTasksChange={updateTasks}
                                        onEditRequest={setEditingTask}
                                    />
                                }
                            />
                            <Route
                                path="/calendar"
                                element={<CalendarView tasks={tasks} onEditRequest={setEditingTask} />}
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </section>
                </div>
            </div>
            <TaskEditModal
                task={editingTask}
                tasks={tasks}
                onSave={handleEditTask}
                onClose={() => setEditingTask(null)}
            />
        </div>
    );
}

export default App;
