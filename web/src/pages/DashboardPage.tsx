import { Link } from 'react-router-dom';
import { useAppStore } from '../store/store';
import { formatTime, getCategoryColor, getCategoryLabel, getGreeting } from '../utils/helpers';

export default function DashboardPage() {
  const tasks = useAppStore((s) => s.tasks);
  const pending = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);
  const preview = pending.slice(0, 5);

  return (
    <>
      <section aria-labelledby="greeting-heading">
        <h1 id="greeting-heading" className="page-title">{getGreeting('Caregiver')}</h1>
        <p className="page-subtitle">Here's your care overview for today</p>
      </section>

      <section aria-label="Task statistics">
        <div className="stats-grid">
          <div className="stat-card warning" aria-label={`Pending: ${pending.length} tasks`}>
            <div className="stat-value">{pending.length}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card success" aria-label={`Completed: ${completed.length} tasks`}>
            <div className="stat-value">{completed.length}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card" aria-label={`Total: ${tasks.length} tasks`}>
            <div className="stat-value">{tasks.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </section>

      <section aria-labelledby="tasks-heading">
        <div className="section-header-row">
          <h2 id="tasks-heading" className="section-title">Today's Tasks</h2>
          <Link to="/tasks" className="view-all-link" aria-label="View all tasks">
            View all →
          </Link>
        </div>
        {preview.length === 0 ? (
          <p className="empty-note">All tasks complete! 🎉</p>
        ) : (
          <ul className="task-list">
            {preview.map((task) => (
              <li key={task.id}>
                <Link
                  to="/tasks"
                  className="task-card task-card-link"
                  aria-label={`${task.title}, ${formatTime(task.time)}, ${task.room} — open in Tasks`}
                >
                  <span className="task-dot" style={{ backgroundColor: getCategoryColor(task.category) }} aria-hidden="true" />
                  <span className="task-info">
                    <span className="task-title">{task.title}</span>
                    <span className="task-meta">{formatTime(task.time)} · {task.room}</span>
                  </span>
                  <span
                    className="badge"
                    style={{ backgroundColor: getCategoryColor(task.category) + '20', color: getCategoryColor(task.category) }}
                  >
                    {getCategoryLabel(task.category)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
