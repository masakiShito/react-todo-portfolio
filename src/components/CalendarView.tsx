import { Calendar, dateFnsLocalizer, type Event } from 'react-big-calendar';
import { addHours, format, getDay, parse, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { Task } from '../utils/types';

type CalendarViewProps = {
  tasks: Task[];
  onEditRequest: (task: Task) => void;
};

type TaskEvent = Event & { resource: Task };

const locales = { ja };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeek(date, { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarView = ({ tasks, onEditRequest }: CalendarViewProps) => {
  const events: TaskEvent[] = tasks
    .filter((task) => task.dueDate)
    .map((task) => {
      const start = new Date(task.dueDate as string);
      if (Number.isNaN(start.getTime())) return null;
      return {
        id: task.id,
        title: task.title,
        start,
        end: addHours(start, 1),
        resource: task,
      };
    })
    .filter((event): event is TaskEvent => Boolean(event));

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-[#F8FAFC]/70">
        期限未設定のタスクはカレンダーに表示されません。
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          defaultView="month"
          popup
          style={{ height: 520 }}
          onSelectEvent={(event) => onEditRequest((event as TaskEvent).resource)}
          messages={{
            today: '今日',
            previous: '前へ',
            next: '次へ',
            month: '月',
            week: '週',
            day: '日',
            agenda: '予定',
            date: '日付',
            time: '時間',
            event: 'タスク',
            noEventsInRange: 'この期間にタスクはありません',
            showMore: (count) => `+${count}件`,
          }}
        />
      </div>
    </div>
  );
};

export default CalendarView;
