import { useState } from 'react';
import type { Task } from '../utils/types';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import FilterTabs from './FilterTabs';
import CalendarView from './CalendarView';
import KanbanBoard from './KanbanBoard';

type UnifiedDashboardProps = {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEditRequest: (task: Task) => void;
  updateTasks: (updater: Task[] | ((prev: Task[]) => Task[])) => void;
};

/**
 * 統合ダッシュボード
 * タスク入力・一覧・カレンダー・Kanbanボードを一画面に統合
 */
const UnifiedDashboard = ({
  tasks,
  onAddTask,
  onToggle,
  onDelete,
  onEditRequest,
  updateTasks,
}: UnifiedDashboardProps) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] antialiased">
      <div className="max-w-[1920px] mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-semibold tracking-tight">Todo</h1>
            <div className="text-sm opacity-70">シンプルに、進める。</div>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* Top Row: TodoInput+List (Left) + Calendar (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: TodoInput + TodoList */}
            <section className="lg:col-span-1 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6">
              <h2 className="text-lg font-medium mb-4">新規タスク</h2>
              <TodoInput onAddTask={onAddTask} tasks={tasks} />

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium">タスク一覧</h3>
                  <FilterTabs currentFilter={filter} onChange={setFilter} />
                </div>
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <TodoList
                    tasks={tasks}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEditRequest={onEditRequest}
                    filter={filter}
                  />
                </div>
              </div>
            </section>

            {/* Right: Calendar */}
            <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6">
              <h2 className="text-lg font-medium mb-4">カレンダー</h2>
              <div className="overflow-auto custom-scrollbar">
                <CalendarView tasks={tasks} onEditRequest={onEditRequest} />
              </div>
            </section>
          </div>

          {/* Bottom Row: Kanban Board (Full Width) */}
          <section className="rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm p-6">
            <h2 className="text-lg font-medium mb-4">進捗ボード</h2>
            <div className="overflow-auto custom-scrollbar">
              <KanbanBoard
                tasks={tasks}
                onTasksChange={updateTasks}
                onEditRequest={onEditRequest}
              />
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(56, 189, 248, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(56, 189, 248, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UnifiedDashboard;
