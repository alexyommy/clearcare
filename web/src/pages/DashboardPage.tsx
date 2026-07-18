const SAMPLE_TASKS = [
  { id: 't1', title: 'Morning medication round', time: '8:00 AM', room: 'Room 204', color: '#C0392B', category: 'Medication' },
  { id: 't2', title: 'Vitals check', time: '9:30 AM', room: 'Mary Johnson', color: '#8E44AD', category: 'Monitoring' },
  { id: 't3', title: 'Physical therapy session', time: '11:00 AM', room: 'Room 112', color: '#2E86C1', category: 'Therapy' },
  { id: 't4', title: 'Wound dressing change', time: '1:00 PM', room: 'Room 306', color: '#16A085', category: 'Hygiene' },
  { id: 't5', title: 'Evening medication round', time: '6:00 PM', room: 'All patients', color: '#C0392B', category: 'Medication' },
];

export default function DashboardPage() {
  return (
    <>
      <section aria-labelledby="greeting-heading">
        <h1 id="greeting-heading" className="page-title">Good morning, Caregiver!</h1>
        <p className="page-subtitle">Here's your care overview for today</p>
      </section>

      <section aria-label="Task statistics">
        <div className="stats-grid">
          <div className="stat-card warning" aria-label="Pending: 5 tasks">
            <div className="stat-value">5</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card success" aria-label="Completed: 1 task">
            <div className="stat-value">1</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card" aria-label="Total: 6 tasks">
            <div className="stat-value">6</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </section>

      <section aria-labelledby="tasks-heading">
        <h2 id="tasks-heading" className="section-title">Today's Tasks</h2>
        <ul className="task-list">
          {SAMPLE_TASKS.map((task) => (
            <li key={task.id} className="task-card">
              <span className="task-dot" style={{ backgroundColor: task.color }} aria-hidden="true" />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                <div className="task-meta">{task.time} · {task.room}</div>
              </div>
              <span className="badge" style={{ backgroundColor: task.color + '20', color: task.color }}>
                {task.category}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
