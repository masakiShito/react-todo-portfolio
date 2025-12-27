import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
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

const columnId = (status: TaskStatus) => `column-${status}`;

const KanbanBoard = ({ tasks, onTasksChange, onEditRequest }: KanbanBoardProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeTask = tasks.find((task) => task.id === activeId);
    if (!activeTask) return;

    const overStatus = columns.find((column) => columnId(column.id) === overId)?.id
      ?? tasks.find((task) => task.id === overId)?.status;
    if (!overStatus) return;

    if (activeTask.status === overStatus) {
      if (activeId === overId) return;
      const columnTasks = tasksByStatus[overStatus];
      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
      const newIndex = columnTasks.findIndex((task) => task.id === overId);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(columnTasks, oldIndex, newIndex);
      const nextTasks: Task[] = [];
      let reorderIndex = 0;
      tasks.forEach((task) => {
        if (task.status === overStatus) {
          nextTasks.push(reordered[reorderIndex]);
          reorderIndex += 1;
        } else {
          nextTasks.push(task);
        }
      });
      onTasksChange(nextTasks);
      return;
    }

    const updatedTask: Task = {
      ...activeTask,
      status: overStatus,
      completed: overStatus === 'done',
    };

    const remaining = tasks.filter((task) => task.id !== activeId);
    const overIndex = remaining.findIndex((task) => task.id === overId);

    if (overId.startsWith('column-') || overIndex === -1) {
      const lastIndex = remaining.reduce((acc, task, index) => {
        if (task.status === overStatus) return index;
        return acc;
      }, -1);
      const insertIndex = lastIndex + 1;
      const nextTasks = [...remaining];
      nextTasks.splice(insertIndex, 0, updatedTask);
      onTasksChange(nextTasks);
      return;
    }

    const nextTasks = [...remaining];
    nextTasks.splice(overIndex, 0, updatedTask);
    onTasksChange(nextTasks);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onEditRequest={onEditRequest}
          />
        ))}
      </div>
    </DndContext>
  );
};

const KanbanColumn = ({
  column,
  tasks,
  onEditRequest,
}: {
  column: { id: TaskStatus; title: string; description: string };
  tasks: Task[];
  onEditRequest: (task: Task) => void;
}) => {
  const { setNodeRef } = useDroppable({ id: columnId(column.id) });

  return (
    <div
      ref={setNodeRef}
      className="flex-1 min-w-[260px] rounded-2xl border border-white/10 bg-white/5 p-4"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold">{column.title}</h3>
        <p className="text-xs text-[#F8FAFC]/70">{column.description}</p>
      </div>
      <SortableContext items={tasks.map((task) => task.id)}>
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
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanCard = ({ task, onEditRequest }: { task: Task; onEditRequest: (task: Task) => void }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-xl border border-white/10 bg-[#0F172A]/80 p-3 text-sm shadow-sm ${
        isDragging ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-[#F8FAFC]">{task.title}</p>
          {task.description && (
            <p className="text-xs text-[#F8FAFC]/70 whitespace-pre-wrap">{task.description}</p>
          )}
        </div>
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
      <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#F8FAFC]/70">
        {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
        {task.priority && <span>🔥 {task.priority}</span>}
        {task.tag && <span>🏷️ {task.tag}</span>}
      </div>
    </div>
  );
};

export default KanbanBoard;
