import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterTabs from './components/FilterTabs';
import KanbanBoard from './components/KanbanBoard';
import CalendarView from './components/CalendarView';
import TaskEditModal from './components/TaskEditModal';
import TaskDetailPage from './pages/TaskDetailPage';
import type { Task } from './utils/types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { createEmptyTaskStore, migrateTaskStore, type TaskStore } from './utils/taskStorage';
import { toggleTaskCompletion, updateTaskWithHistory } from './utils/taskHelpers';

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
    const [view, setView] = useState<'list' | 'board' | 'calendar'>('list');

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
                return toggleTaskCompletion(task);
            })
        );
    };

    /** タスク編集 */
    const handleEditTask = (updatedTask: Task) => {
        updateTasks(
            tasks.map((task) => {
                if (task.id !== updatedTask.id) return task;
                // 既存タスクとの差分を検出して履歴を追加
                const taskWithHistory = updateTaskWithHistory(task, {
                    ...updatedTask,
                    completed: updatedTask.status === 'done',
                });
                return taskWithHistory;
            })
        );
    };

    const handleUpdateTask = (updatedTask: Task) => {
        updateTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    };

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            tasks={tasks}
                            filter={filter}
                            view={view}
                            onAddTask={handleAddTask}
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                            onEditRequest={setEditingTask}
                            updateTasks={updateTasks}
                            setFilter={setFilter}
                            setView={setView}
                        />
                    }
                />
                <Route
                    path="/tasks/:taskId"
                    element={
                        <TaskDetailPage
                            tasks={tasks}
                            onUpdateTask={handleUpdateTask}
                            onEditRequest={setEditingTask}
                        />
                    }
                />
            </Routes>
            <TaskEditModal
                task={editingTask}
                tasks={tasks}
                onSave={handleEditTask}
                onClose={() => setEditingTask(null)}
            />
        </>
    );
}

/**
 * ホームページ（メインビュー）
 */
type HomePageProps = {
    tasks: Task[];
    filter: 'all' | 'completed' | 'incomplete';
    view: 'list' | 'board' | 'calendar';
    onAddTask: (task: Task) => void;
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEditRequest: (task: Task) => void;
    updateTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
    setFilter: (filter: 'all' | 'completed' | 'incomplete') => void;
    setView: (view: 'list' | 'board' | 'calendar') => void;
};

function HomePage({
    tasks,
    filter,
    view,
    onAddTask,
    onToggle,
    onDelete,
    onEditRequest,
    updateTasks,
    setFilter,
    setView,
}: HomePageProps) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getViewFromPath = (path: string) => {
            if (path.includes('/board')) return 'board';
            if (path.includes('/calendar')) return 'calendar';
            return 'list';
        };

        const nextView = getViewFromPath(location.pathname);
        setView(nextView);
    }, [location.pathname, setView]);

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
                        <TodoInput onAddTask={onAddTask} tasks={tasks} />
                    </section>

                    {/* Right: Task views (span 2) */}
                    <section className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                            <h2 className="text-lg font-medium">タスクビュー</h2>
                            <nav className="flex flex-wrap gap-2 text-sm">
                                <button
                                    onClick={() => navigate('/')}
                                    className={`px-3.5 py-1.5 rounded-lg border transition ${
                                        view === 'list'
                                            ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                            : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                    }`}
                                >
                                    List
                                </button>
                                <button
                                    onClick={() => navigate('/board')}
                                    className={`px-3.5 py-1.5 rounded-lg border transition ${
                                        view === 'board'
                                            ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                            : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                    }`}
                                >
                                    Board
                                </button>
                                <button
                                    onClick={() => navigate('/calendar')}
                                    className={`px-3.5 py-1.5 rounded-lg border transition ${
                                        view === 'calendar'
                                            ? 'bg-[#38BDF8] text-[#0F172A] border-transparent'
                                            : 'bg-white/10 text-[#F8FAFC] border-white/10 hover:bg-white/15'
                                    }`}
                                >
                                    Calendar
                                </button>
                            </nav>
                        </div>
                        {view === 'list' && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-base font-medium">タスク一覧</h3>
                                    <FilterTabs currentFilter={filter} onChange={setFilter} />
                                </div>
                                <TodoList
                                    tasks={tasks}
                                    onToggle={onToggle}
                                    onDelete={onDelete}
                                    onEditRequest={onEditRequest}
                                    filter={filter}
                                />
                            </div>
                        )}
                        {view === 'board' && (
                            <KanbanBoard tasks={tasks} onTasksChange={updateTasks} onEditRequest={onEditRequest} />
                        )}
                        {view === 'calendar' && <CalendarView tasks={tasks} onEditRequest={onEditRequest} />}
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;
