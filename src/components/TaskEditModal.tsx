import { useEffect, useMemo, useState } from 'react';
import type { Task, TaskStatus } from '../utils/types';
import { validateTask, type TaskInput } from '../utils/validation';
import { fromDateTimeLocal, toDateTimeLocal } from '../utils/dateTime';

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'Todo' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

type TaskEditModalProps = {
  task: Task | null;
  tasks: Task[];
  onSave: (task: Task) => void;
  onClose: () => void;
};

const TaskEditModal = ({ task, tasks, onSave, onClose }: TaskEditModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('中');
  const [tag, setTag] = useState<Task['tag']>('開発');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isOpen = Boolean(task);

  useEffect(() => {
    if (!task) return;
    setTitle(task.title);
    setDescription(task.description ?? '');
    setPriority(task.priority ?? '中');
    setTag(task.tag ?? '開発');
    setDueDate(toDateTimeLocal(task.dueDate));
    setStatus(task.status);
    setErrors({});
  }, [task]);

  const existingTasks = useMemo(() => tasks, [tasks]);

  if (!isOpen || !task) return null;

  const handleSave = () => {
    const input: TaskInput = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tag,
      dueDate,
    };

    const { valid, errors: vErrors } = validateTask(input, existingTasks, {
      excludeId: task.id,
    });
    setErrors(vErrors);
    if (!valid) return;

    const updatedTask: Task = {
      ...task,
      title: input.title,
      description: input.description || '',
      priority: input.priority,
      tag: input.tag,
      dueDate: input.dueDate ? fromDateTimeLocal(input.dueDate) : undefined,
      status,
      completed: status === 'done',
    };

    onSave(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0F172A] p-6 text-[#F8FAFC] shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">タスクを編集</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-[#F8FAFC]/70 hover:bg-white/10"
          >
            閉じる
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'edit-error-title' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] placeholder:text-[#F8FAFC]/60 border ${errors.title ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
            />
            {errors.title && (
              <p id="edit-error-title" className="mt-1 text-xs text-red-300">{errors.title}</p>
            )}
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'edit-error-description' : undefined}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] placeholder:text-[#F8FAFC]/60 border ${errors.description ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
            />
            {errors.description && (
              <p id="edit-error-description" className="mt-1 text-xs text-red-300">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">優先度</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                aria-invalid={!!errors.priority}
                aria-describedby={errors.priority ? 'edit-error-priority' : undefined}
                className={`px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.priority ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2 appearance-none`}
              >
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
              {errors.priority && (
                <p id="edit-error-priority" className="mt-1 text-xs text-red-300">{errors.priority}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">タグ</label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as Task['tag'])}
                aria-invalid={!!errors.tag}
                aria-describedby={errors.tag ? 'edit-error-tag' : undefined}
                className={`px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.tag ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2 appearance-none`}
              >
                <option value="開発">開発</option>
                <option value="レビュー">レビュー</option>
                <option value="MTG">MTG</option>
                <option value="その他">その他</option>
              </select>
              {errors.tag && (
                <p id="edit-error-tag" className="mt-1 text-xs text-red-300">{errors.tag}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">期限</label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                aria-invalid={!!errors.dueDate}
                aria-describedby={errors.dueDate ? 'edit-error-dueDate' : undefined}
                className={`px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.dueDate ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
              />
              {errors.dueDate && (
                <p id="edit-error-dueDate" className="mt-1 text-xs text-red-300">{errors.dueDate}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">状態</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="px-3 py-2 rounded-lg bg-white text-[#0F172A] border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15"
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#38BDF8] text-[#0F172A] hover:opacity-95"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
