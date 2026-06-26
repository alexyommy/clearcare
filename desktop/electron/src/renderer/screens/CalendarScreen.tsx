import React from 'react';
import { useAppStore } from '../store/store';
import { formatTime, getCategoryColor, getCategoryLabel } from '../utils/helpers';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function CalendarScreen() {
  const tasks = useAppStore((s) => s.tasks);
  const darkMode = useAppStore((s) => s.darkMode);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDayOfMonth).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const upcomingTasks = tasks.filter((t) => !t.isCompleted).slice(0, 6);

  const cardBg = darkMode ? '#2C2C2E' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#212121';
  const textMuted = darkMode ? '#BDBDBD' : '#757575';
  const border = darkMode ? '#424242' : '#E0E0E0';

  return (
    <div style={{ padding: 32, maxWidth: 1200, overflow: 'auto', height: '100%' }}>
      <div style={{ display: 'flex', gap: 32 }}>
        {/* Calendar grid */}
        <section style={{ flex: 1 }} aria-label="Calendar">
          <h2 style={{ fontSize: 22, fontWeight: 700, color: text, margin: '0 0 4px' }}>
            {MONTHS[month]} {year}
          </h2>
          <div style={{ backgroundColor: cardBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden', marginTop: 16 }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#1A5276' }}>
              {DAYS.map((d) => (
                <div key={d} style={{ padding: '10px 0', textAlign: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>{d}</div>
              ))}
            </div>
            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {cells.map((day, i) => {
                const isToday = day === today.getDate();
                return (
                  <div
                    key={i}
                    style={{
                      padding: 8, minHeight: 64, borderBottom: `1px solid ${border}`, borderRight: `1px solid ${border}`,
                      backgroundColor: isToday ? (darkMode ? '#1A5276' : '#EBF5FB') : 'transparent',
                    }}
                    aria-label={day ? `${MONTHS[month]} ${day}${isToday ? ', today' : ''}` : undefined}
                  >
                    {day && (
                      <span style={{ fontSize: 14, fontWeight: isToday ? 800 : 400, color: isToday ? '#1A5276' : text }}>
                        {day}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Upcoming events */}
        <section style={{ width: 360, flexShrink: 0 }} aria-label="Upcoming events">
          <h3 style={{ fontSize: 18, fontWeight: 700, color: text, margin: '0 0 16px' }}>Upcoming Events</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                style={{
                  backgroundColor: cardBg, borderRadius: 8, display: 'flex', overflow: 'hidden',
                  border: `1px solid ${border}`,
                }}
                aria-label={`${task.title}, ${formatTime(task.time)}, ${task.room}`}
              >
                <div style={{ width: 5, backgroundColor: getCategoryColor(task.category), flexShrink: 0 }} aria-hidden="true" />
                <div style={{ padding: '12px 14px', flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: text }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
                    {formatTime(task.time)} · {task.room} · {getCategoryLabel(task.category)}
                  </div>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div style={{ textAlign: 'center', padding: 32, color: textMuted }}>No upcoming events</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
