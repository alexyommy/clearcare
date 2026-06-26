import React from 'react';
import { useAppStore } from '../store/store';
import { getGreeting, formatTime, getCategoryColor, getPriorityColor } from '../utils/helpers';

export default function DashboardScreen() {
  const user = useAppStore((s) => s.user);
  const tasks = useAppStore((s) => s.tasks);
  const setScreen = useAppStore((s) => s.setScreen);
  const darkMode = useAppStore((s) => s.darkMode);

  const pending = tasks.filter((t) => !t.isCompleted);
  const completed = tasks.filter((t) => t.isCompleted);
  const preview = pending.slice(0, 5);
  const greeting = getGreeting(user?.name?.split(' ')[0] ?? 'Caregiver');

  const cardBg = darkMode ? '#2C2C2E' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#212121';
  const textMuted = darkMode ? '#BDBDBD' : '#757575';
  const border = darkMode ? '#424242' : '#E0E0E0';

  const stats = [
    { label: 'Pending', value: pending.length, color: '#D68910' },
    { label: 'Completed', value: completed.length, color: '#1E8449' },
    { label: 'Total', value: tasks.length, color: '#1A5276' },
  ];

  return (
    <div style={{ padding: 32, maxWidth: 1200, overflow: 'auto', height: '100%' }}>
      {/* Greeting */}
      <section aria-label="Welcome">
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A5276', margin: 0 }}>{greeting}</h2>
        <p style={{ fontSize: 14, color: textMuted, marginTop: 4 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </section>

      {/* Stats */}
      <section aria-label="Task statistics" style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              backgroundColor: cardBg,
              borderRadius: 12,
              padding: 20,
              borderTop: `4px solid ${s.color}`,
              border: `1px solid ${border}`,
              borderTopColor: s.color,
              borderTopWidth: 4,
            }}
            aria-label={`${s.label}: ${s.value} tasks`}
          >
            <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 14, color: textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* Task preview */}
      <section aria-label="Today's tasks" style={{ marginTop: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: text, margin: 0 }}>Today's Tasks</h3>
          <button
            onClick={() => setScreen('tasks')}
            style={{
              border: 'none', background: 'none', color: '#1A5276',
              fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '8px 0',
            }}
            aria-label="View all tasks"
          >
            View all →
          </button>
        </div>

        {preview.length === 0 ? (
          <div style={{ backgroundColor: cardBg, borderRadius: 12, padding: 40, textAlign: 'center', marginTop: 12, border: `1px solid ${border}` }}>
            <div style={{ fontSize: 32 }}>🎉</div>
            <p style={{ fontSize: 16, color: '#1E8449', fontWeight: 600, marginTop: 8 }}>All tasks complete!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {preview.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: cardBg,
                  borderRadius: 8,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  border: `1px solid ${border}`,
                  cursor: 'pointer',
                }}
                tabIndex={0}
                role="button"
                aria-label={`${task.title}, ${formatTime(task.time)}, ${task.room}`}
                onKeyDown={(e) => { if (e.key === 'Enter') setScreen('tasks'); }}
                onClick={() => setScreen('tasks')}
              >
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: getCategoryColor(task.category), flexShrink: 0 }} aria-hidden="true" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.title}</div>
                  <div style={{ fontSize: 13, color: textMuted, marginTop: 2 }}>{formatTime(task.time)} · {task.room}</div>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: getPriorityColor(task.priority), flexShrink: 0 }} aria-hidden="true" />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick access */}
      <section aria-label="Quick access" style={{ marginTop: 32 }}>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: text, margin: 0 }}>Quick Access</h3>
        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {[
            { label: 'Calendar', icon: '📅', screen: 'calendar' },
            { label: 'Settings', icon: '⚙️', screen: 'settings' },
          ].map((item) => (
            <button
              key={item.screen}
              onClick={() => setScreen(item.screen)}
              style={{
                flex: 1, backgroundColor: cardBg, borderRadius: 12, padding: 20,
                border: `1px solid ${border}`, cursor: 'pointer', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              }}
              aria-label={`Go to ${item.label}`}
            >
              <span style={{ fontSize: 28 }} aria-hidden="true">{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A5276' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
