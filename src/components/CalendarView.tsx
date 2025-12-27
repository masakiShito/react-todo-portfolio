import { useMemo, useState } from 'react';
import type { Task } from '../utils/types';
import { normalizeDateRange, parseDateInput, toDateInput, toDateKey } from '../utils/dateTime';

type CalendarViewProps = {
  tasks: Task[];
  onEditRequest: (task: Task) => void;
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

  const today = new Date();
  const todayKey = toDateKey(today);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const normalized = normalizeDateRange(task.startDate, task.endDate);
      const fallback = task.dueDate ? toDateInput(task.dueDate) : undefined;
      const start = normalized.startDate ?? fallback;
      const end = normalized.endDate ?? fallback;

      if (!start || !end) return;

      const startDate = parseDateInput(start);
      const endDate = parseDateInput(end);
      if (!startDate || !endDate) return;

      let cursor = startDate;
      while (cursor <= endDate) {
        const key = toDateKey(cursor);
        const list = map.get(key) ?? [];
        list.push(task);
        map.set(key, list);
        cursor = addDays(cursor, 1);
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
            const isToday = key === todayKey;
            return (
              <div
                key={key}
                className={`min-h-[96px] bg-[#0F172A] p-2 text-[#F8FAFC]/80 transition ${
                  isCurrentMonth ? '' : 'opacity-50'
                } ${isToday ? 'ring-2 ring-[#38BDF8] shadow-[0_0_12px_rgba(56,189,248,0.35)] bg-[#38BDF8]/10' : ''} hover:bg-white/5`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
                  <span>{day.getDate()}</span>
                  {isToday && (
                    <span className="rounded-full bg-[#38BDF8] px-2 py-0.5 text-[10px] font-semibold text-[#0F172A]">
                      今日
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onEditRequest(task)}
                      className="block w-full rounded-md bg-[#38BDF8]/90 px-2 py-1 text-left text-[11px] text-[#0F172A] hover:opacity-90"
                    >
                      <div className="flex flex-wrap items-center gap-1">
                        <span>{task.title}</span>
                        {task.priority && (
                          <span className="rounded bg-white/40 px-1 text-[10px] text-[#0F172A]">
                            {task.priority}
                          </span>
                        )}
                        {task.tag && (
                          <span className="rounded bg-white/40 px-1 text-[10px] text-[#0F172A]">
                            {task.tag}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
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
