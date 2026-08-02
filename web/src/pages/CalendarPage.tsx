import { useAppStore } from '../store/store';
import { formatTime, getCategoryColor, getCategoryTextColor, getCategoryLabel } from '../utils/helpers';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const tasks = useAppStore((s) => s.tasks);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const upcoming = tasks.filter((t) => !t.isCompleted).slice(0, 6);

  return (
    <div className="calendar-layout">
      <section aria-labelledby="calendar-heading">
        <h1 id="calendar-heading" className="page-title">{MONTHS[month]} {year}</h1>
        <div role="grid" aria-label={`${MONTHS[month]} ${year} calendar`} className="calendar-grid">
          <div role="row" className="calendar-row calendar-head">
            {DAYS_SHORT.map((d, i) => (
              <div key={d} role="columnheader" aria-label={DAYS[i]} className="calendar-colhead">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="calendar-row">
              {week.map((day, ci) => {
                const isToday = day === today.getDate();
                return (
                  <div
                    key={ci}
                    role="gridcell"
                    tabIndex={day ? 0 : -1}
                    aria-label={day ? `${DAYS[ci]}, ${MONTHS[month]} ${day}${isToday ? ', today' : ''}` : undefined}
                    aria-current={isToday ? 'date' : undefined}
                    className={`calendar-cell${isToday ? ' today' : ''}`}
                  >
                    {day && <span aria-hidden="true">{day}</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="upcoming-heading" className="upcoming-panel">
        <h2 id="upcoming-heading" className="section-title">Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="empty-note">No upcoming events</p>
        ) : (
          <ul className="task-list">
            {upcoming.map((task) => (
              <li
                key={task.id}
                className="task-card"
                tabIndex={0}
                aria-label={`${task.title}, ${formatTime(task.time)}, ${task.room}, ${getCategoryLabel(task.category)}`}
              >
                <span className="task-dot" style={{ backgroundColor: getCategoryColor(task.category) }} aria-hidden="true" />
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">{formatTime(task.time)} · {task.room}</div>
                </div>
                <span className="badge" style={{ backgroundColor: getCategoryColor(task.category) + '20', color: getCategoryTextColor(task.category) }}>
                  {getCategoryLabel(task.category)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
