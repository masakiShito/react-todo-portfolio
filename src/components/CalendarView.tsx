import { useMemo, useState } from 'react';
import type { Task } from '../utils/types';
import { isToday, getDateRangeKeys } from '../utils/dateTime';

type CalendarViewProps = {
  tasks: Task[];
  onEditRequest: (task: Task) => void;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getCalendarStart = (date: Date) => {
  const first = startOfMonth(date);
  const day = first.getDay() === 0 ? 7 : first.getDay();
  return addDays(first, -(day - 1));
};

const getCalendarEnd = (date: Date) => {
  const last = endOfMonth(date);
  const day = last.getDay() === 0 ? 7 : last.getDay();
  return addDays(last, 7 - day);
};

const CalendarView = ({ tasks, onEditRequest }: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      // 新しい形式（startDate/endDate）の処理
      if (task.startDate && task.endDate) {
        const keys = getDateRangeKeys(task.startDate, task.endDate);
        keys.forEach((key) => {
          const list = map.get(key) ?? [];
          list.push(task);
          map.set(key, list);
        });
      }
      // 後方互換：dueDateのみの場合
      else if (task.dueDate) {
        const due = new Date(task.dueDate);
        if (!Number.isNaN(due.getTime())) {
          const key = toDateKey(due);
          const list = map.get(key) ?? [];
          list.push(task);
          map.set(key, list);
        }
      }
    });
    return map;
  }, [tasks]);

  const calendarDays = useMemo(() => {
    const start = getCalendarStart(currentMonth);
    const end = getCalendarEnd(currentMonth);
    const days: Date[] = [];
    let cursor = start;
    while (cursor <= end) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
    }
    return days;
  }, [currentMonth]);

  const monthLabel = currentMonth.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-[#F8FAFC]/70">
        期限未設定のタスクはカレンダーに表示されません。
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-semibold">{monthLabel}</h3>
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15"
            >
              前へ
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(startOfMonth(new Date()))}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15"
            >
              今日
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-[#F8FAFC] hover:bg-white/15"
            >
              次へ
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden bg-white/10 text-xs">
          {weekDays.map((day) => (
            <div key={day} className="bg-[#0F172A] p-2 font-medium text-[#F8FAFC]/80">
              {day}
            </div>
          ))}
          {calendarDays.map((day) => {
            const key = toDateKey(day);
            const dayTasks = tasksByDate.get(key) ?? [];
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isTodayCell = isToday(day);
            return (
              <div
                key={key}
                className={`min-h-[96px] bg-[#0F172A] p-2 text-[#F8FAFC]/80 relative transition-all ${
                  isCurrentMonth ? '' : 'opacity-50'
                } ${
                  isTodayCell
                    ? 'ring-2 ring-[#38BDF8]/60 bg-[#38BDF8]/5 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                    : ''
                } hover:bg-white/5`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="text-[11px] font-semibold">{day.getDate()}</div>
                  {isTodayCell && (
                    <div className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/20 px-1.5 py-0.5 rounded-md">
                      今日
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  {dayTasks.map((task) => {
                    // タスクの優先度によって色分け
                    const priorityColor =
                      task.priority === '高'
                        ? 'bg-red-400/90 text-white'
                        : task.priority === '中'
                        ? 'bg-[#38BDF8]/90 text-[#0F172A]'
                        : 'bg-gray-400/90 text-[#0F172A]';

                    return (
                      <button
                        key={task.id}
                        type="button"
                        onClick={() => onEditRequest(task)}
                        className={`block w-full rounded-md ${priorityColor} px-2 py-1 text-left text-[11px] hover:opacity-90 transition-opacity`}
                      >
                        <div className="truncate">{task.title}</div>
                        {task.tag && (
                          <div className="text-[9px] opacity-80 mt-0.5">{task.tag}</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
