import { useAppStore } from '../store/store';
import { filterTasks, formatTime, getCategoryColor, getCategoryLabel, getPriorityColor, getPriorityLabel } from '../utils/helpers';
import NewTaskModal from '../components/NewTaskModal';
import type { CareTask } from '../store/store';

export default function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setShowNewTaskModal = useAppStore((s) => s.setShowNewTaskModal);

  const filtered = filterTasks(tasks, searchQuery);
  const pending = filtered.filter((t) => !t.isCompleted);
  const completed = filtered.filter((t) => t.isCompleted);

  return (
    <>
      <section aria-labelledby="tasks-page-heading">
        <div className="page-header-row">
          <div>
            <h1 id="tasks-page-heading" className="page-title">Tasks</h1>
            <p className="page-subtitle">{pending.length} pending · {completed.length} completed</p>
          </div>
          <button className="btn-primary" onClick={() => setShowNewTaskModal(true)}>
            + New Task
          </button>
        </div>

        <div className="search-row">
          <label htmlFor="task-search" className="visually-hidden">Search tasks</label>
          <input
            id="task-search"
            type="search"
            className="search-input"
            placeholder="Search tasks by title or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </section>

      <section aria-labelledby="pending-heading">
        <h2 id="pending-heading" className="section-title">Pending ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="empty-note">{searchQuery ? 'No pending tasks match your search.' : 'No pending tasks — great work!'}</p>
        ) : (
          <ul className="task-list">
            {pending.map((task) => <TaskRow key={task.id} task={task} />)}
          </ul>
        )}
      </section>

      {completed.length > 0 && (
        <section aria-labelledby="completed-heading">
          <h2 id="completed-heading" className="section-title">Completed ({completed.length})</h2>
          <ul className="task-list">
            {completed.map((task) => <TaskRow key={task.id} task={task} />)}
          </ul>
        </section>
      )}

      <NewTaskModal />
    </>
  );
}

function TaskRow({ task }: { task: CareTask }) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);

  return (
    <li className={`task-card${task.isCompleted ? ' completed' : ''}`}>
      <button
        className={`task-check${task.isCompleted ? ' checked' : ''}`}
        onClick={() => toggleTask(task.id)}
        aria-label={task.isCompleted ? `Mark ${task.title} as pending` : `Mark ${task.title} as complete`}
      >
        {task.isCompleted ? '✓' : ''}
      </button>
      <span
        className="priority-stripe"
        style={{ backgroundColor: getPriorityColor(task.priority) }}
        aria-hidden="true"
      />
      <div className="task-info">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {formatTime(task.time)} · {task.room} · {getPriorityLabel(task.priority)} priority
        </div>
        {task.description && <div className="task-desc">{task.description}</div>}
      </div>
      <span
        className="badge"
        style={{ backgroundColor: getCategoryColor(task.category) + '20', color: getCategoryColor(task.category) }}
      >
        {getCategoryLabel(task.category)}
      </span>
      <button
        className="task-delete"
        onClick={() => deleteTask(task.id)}
        aria-label={`Delete ${task.title}`}
      >
        🗑
      </button>
    </li>
  );
}
