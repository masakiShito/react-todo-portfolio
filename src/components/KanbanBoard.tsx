import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, TaskStatus } from '../utils/types';

type KanbanBoardProps = {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onEditRequest: (task: Task) => void;
};

const columns: { id: TaskStatus; title: string; description: string }[] = [
  { id: 'todo', title: 'Todo', description: '着手前' },
  { id: 'in_progress', title: 'In Progress', description: '進行中' },
  { id: 'done', title: 'Done', description: '完了' },
];

const KanbanBoard = ({ tasks, onTasksChange, onEditRequest }: KanbanBoardProps) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    tasks.forEach((task) => {
      const status = task.status ?? 'todo';
      grouped[status].push(task);
    });
    return grouped;
  }, [tasks]);

  const handleMove = (activeId: string, status: TaskStatus, beforeId?: string) => {
    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    const updatedTask: Task = {
      ...activeTask,
      status,
      completed: status === 'done',
    };

    const remaining = tasks.filter((task) => task.id !== activeId);
    const nextTasks = [...remaining];

    if (beforeId) {
      const beforeIndex = nextTasks.findIndex((task) => task.id === beforeId);
      const insertIndex = beforeIndex === -1 ? nextTasks.length : beforeIndex;
      nextTasks.splice(insertIndex, 0, updatedTask);
      onTasksChange(nextTasks);
      return;
    }

    const lastIndex = nextTasks.reduce((acc, task, index) => {
      if (task.status === status) return index;
      return acc;
    }, -1);
    nextTasks.splice(lastIndex + 1, 0, updatedTask);
    onTasksChange(nextTasks);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={tasksByStatus[column.id]}
          onEditRequest={onEditRequest}
          onDropTask={(taskId, beforeId) => handleMove(taskId, column.id, beforeId)}
          draggingId={draggingId}
          onDragStart={setDraggingId}
          onDragEnd={() => setDraggingId(null)}
        />
      ))}
    </div>
  );
};

const KanbanColumn = ({
  column,
  tasks,
  onEditRequest,
  onDropTask,
  draggingId,
  onDragStart,
  onDragEnd,
}: {
  column: { id: TaskStatus; title: string; description: string };
  tasks: Task[];
  onEditRequest: (task: Task) => void;
  onDropTask: (taskId: string, beforeId?: string) => void;
  draggingId: string | null;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}) => {
  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={() => {
        if (draggingId) onDropTask(draggingId);
      }}
      className="flex-1 min-w-[260px] rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold">{column.title}</h3>
        <p className="text-xs text-[#F8FAFC]/70">{column.description}</p>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-4 text-sm text-[#F8FAFC]/60">
            タスクがありません
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onEditRequest={onEditRequest}
              onDropTask={onDropTask}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              draggingId={draggingId}
            />
          ))
        )}
      </div>
    </div>
  );
};

const KanbanCard = ({
  task,
  onEditRequest,
  onDropTask,
  onDragStart,
  onDragEnd,
  draggingId,
}: {
  task: Task;
  onEditRequest: (task: Task) => void;
  onDropTask: (taskId: string, beforeId?: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  draggingId: string | null;
}) => {
  const navigate = useNavigate();

  return (
    <div
      draggable
      onDragStart={(event) => {
        event.dataTransfer.effectAllowed = 'move';
        onDragStart(task.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        if (draggingId) {
          onDropTask(draggingId, task.id);
        }
      }}
      className="rounded-xl border border-white/10 bg-[#0F172A]/80 p-3 text-sm shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-[#F8FAFC]">{task.title}</p>
          {task.description && (
            <p className="text-xs text-[#F8FAFC]/70 whitespace-pre-wrap">{task.description}</p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/tasks/${task.id}`);
            }}
            className="text-xs text-[#38BDF8] hover:underline"
          >
            詳細
          </button>
          <span className="text-[#F8FAFC]/50">|</span>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEditRequest(task);
            }}
            className="text-xs text-[#38BDF8] hover:underline"
          >
            編集
          </button>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#F8FAFC]/70">
        {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
        {task.priority && <span>🔥 {task.priority}</span>}
        {task.tag && <span>🏷️ {task.tag}</span>}
      </div>
    </div>
  );
};

export default KanbanBoard;
