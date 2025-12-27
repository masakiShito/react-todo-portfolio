import { useState } from 'react';
import type { Task, Priority, Tag } from '../utils/types';
import { validateTask, type TaskInput } from '../utils/validation';
import { fromDateString, normalizeDateRange } from '../utils/dateTime';
import { createTaskWithHistory } from '../utils/taskHelpers';

const TodoInput = ({ onAddTask, tasks }: { onAddTask: (task: Task) => void; tasks: Task[] }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('中');
  const [tag, setTag] = useState<Tag>('開発');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dateSwapWarning, setDateSwapWarning] = useState(false);

  const handleSubmit = () => {
    // 日付範囲を正規化
    const { start, end, swapped } = normalizeDateRange(startDate, endDate);

    const input: TaskInput = {
      title: title.trim(),
      description: description.trim(),
      priority,
      tag,
      startDate: start,
      endDate: end,
    };

    const { valid, errors: vErrors } = validateTask(input, tasks);
    setErrors(vErrors);
    if (!valid) return;

    // 日付が入れ替わった場合は警告を表示
    if (swapped) {
      setDateSwapWarning(true);
      setTimeout(() => setDateSwapWarning(false), 3000);
    }

    const newTask = createTaskWithHistory({
      title: input.title,
      description: input.description || '',
      completed: false,
      priority: input.priority,
      tag: input.tag,
      status: 'todo',
      startDate: input.startDate ? fromDateString(input.startDate) : undefined,
      endDate: input.endDate ? fromDateString(input.endDate) : undefined,
    });

    onAddTask(newTask);

    // 初期化
    setTitle('');
    setDescription('');
    setPriority('中');
    setTag('開発');
    setStartDate('');
    setEndDate('');
    setErrors({});
    setDateSwapWarning(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクのタイトル"
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? 'error-title' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] placeholder:text-[#F8FAFC]/60 border ${errors.title ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
        />
        {errors.title && (
          <p id="error-title" className="mt-1 text-xs text-red-300">{errors.title}</p>
        )}
      </div>

      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="詳細（任意）"
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? 'error-description' : undefined}
          className={`w-full px-3.5 py-2.5 rounded-lg bg-white/10 text-[#F8FAFC] placeholder:text-[#F8FAFC]/60 border ${errors.description ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
        />
        {errors.description && (
          <p id="error-description" className="mt-1 text-xs text-red-300">{errors.description}</p>
        )}
      </div>

      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">優先度</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            aria-invalid={!!errors.priority}
            aria-describedby={errors.priority ? 'error-priority' : undefined}
            className={`px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.priority ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2 appearance-none`}
          >
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>
          {errors.priority && (
            <p id="error-priority" className="mt-1 text-xs text-red-300">{errors.priority}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">タグ</label>
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value as Tag)}
            aria-invalid={!!errors.tag}
            aria-describedby={errors.tag ? 'error-tag' : undefined}
            className={`px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.tag ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2 appearance-none`}
          >
            <option value="開発">開発</option>
            <option value="レビュー">レビュー</option>
            <option value="MTG">MTG</option>
            <option value="その他">その他</option>
          </select>
          {errors.tag && (
            <p id="error-tag" className="mt-1 text-xs text-red-300">{errors.tag}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">開始日（任意）</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-invalid={!!errors.startDate}
            aria-describedby={errors.startDate ? 'error-startDate' : undefined}
            className={`w-full px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.startDate ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
          />
          {errors.startDate && (
            <p id="error-startDate" className="mt-1 text-xs text-red-300">{errors.startDate}</p>
          )}
        </div>
        <div>
          <label className="block text-xs font-medium text-[#F8FAFC]/80 mb-1">終了日（任意）</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? 'error-endDate' : undefined}
            className={`w-full px-3 py-2 rounded-lg bg-white text-[#0F172A] border ${errors.endDate ? 'border-red-400 focus:ring-red-400' : 'border-white/10 focus:ring-[#38BDF8]'} focus:outline-none focus:ring-2`}
          />
          {errors.endDate && (
            <p id="error-endDate" className="mt-1 text-xs text-red-300">{errors.endDate}</p>
          )}
        </div>
      </div>

      {dateSwapWarning && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
          開始日と終了日が入れ替わっていたため、自動で修正しました。
        </div>
      )}
      <button
        onClick={handleSubmit}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#38BDF8] text-[#0F172A] px-4 py-2.5 font-medium shadow-sm hover:opacity-95 transition"
      >
        タスクを追加
      </button>
    </div>
  );
};

export default TodoInput;
