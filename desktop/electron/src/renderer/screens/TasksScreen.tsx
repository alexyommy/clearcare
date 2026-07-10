import React, { useState } from 'react';
import { useAppStore } from '../store/store';
import { useTheme } from '../utils/useTheme';
import { formatTime, getCategoryColor, getCategoryLabel, getPriorityColor, getPriorityLabel } from '../utils/helpers';
import { CareTask } from '../store/types';

export default function TasksScreen() {
  const tasks = useAppStore((s) => s.tasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const { fs, colors: c } = useTheme();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cardBg = c.cardBg;
  const text = c.text;
  const textMuted = c.textMuted;
  const border = c.border;
  const panelBg = c.surface;

  const filtered = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.room.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const pending = filtered.filter((t) => !t.isCompleted);
  const completed = filtered.filter((t) => t.isCompleted);
  const selectedTask = tasks.find((t) => t.id === selectedId);

  return (
    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Task list panel */}
      <div style={{ flex: 1, overflow: 'auto', padding: 24 }} role="region" aria-label="Task list">
        {/* Pending */}
        <h3 style={{ fontSize: fs.sm, fontWeight: 700, color: textMuted, letterSpacing: 1, margin: '0 0 12px' }}>
          PENDING ({pending.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {pending.map((task) => (
            <TaskRow
              key={task.id}
              task={task}
              selected={selectedId === task.id}
              onSelect={() => setSelectedId(task.id)}
              onToggle={() => toggleTask(task.id)}
              cardBg={cardBg}
              text={text}
              textMuted={textMuted}
              border={border}
              fs={fs}
            />
          ))}
        </div>

        {/* Completed */}
        {completed.length > 0 && (
          <>
            <h3 style={{ fontSize: fs.sm, fontWeight: 700, color: textMuted, letterSpacing: 1, margin: '24px 0 12px' }}>
              COMPLETED ({completed.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {completed.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  selected={selectedId === task.id}
                  onSelect={() => setSelectedId(task.id)}
                  onToggle={() => toggleTask(task.id)}
                  cardBg={cardBg}
                  text={text}
                  textMuted={textMuted}
                  border={border}
                  fs={fs}
                />
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: textMuted }}>
            {searchQuery ? 'No tasks match your search' : 'No tasks yet'}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <aside
        style={{
          width: 380,
          backgroundColor: panelBg,
          borderLeft: `1px solid ${border}`,
          overflow: 'auto',
          padding: 24,
          flexShrink: 0,
        }}
        role="region"
        aria-label="Task details"
      >
        {selectedTask ? (
          <TaskDetail
            task={selectedTask}
            onToggle={() => toggleTask(selectedTask.id)}
            onDelete={() => { deleteTask(selectedTask.id); setSelectedId(null); }}
            text={text}
            textMuted={textMuted}
            cardBg={cardBg}
            border={border}
            darkMode={c.bg === '#121212'}
            fs={fs}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: textMuted, gap: 8 }}>
            <span style={{ fontSize: 40 }}>📋</span>
            <p style={{ fontSize: 15 }}>Select a task to view details</p>
          </div>
        )}
      </aside>
    </div>
  );
}

function TaskRow({ task, selected, onSelect, onToggle, cardBg, text, textMuted, border, fs }: {
  task: CareTask; selected: boolean; onSelect: () => void; onToggle: () => void;
  cardBg: string; text: string; textMuted: string; border: string; fs: any;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Checkbox — sibling of the row card, not nested inside it (WCAG 4.1.2 / axe nested-interactive) */}
      <button
        onClick={onToggle}
        aria-label={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
        style={{
          width: 24, height: 24, borderRadius: 12, flexShrink: 0,
          border: task.isCompleted ? 'none' : `2px solid ${border}`,
          backgroundColor: task.isCompleted ? '#1E8449' : 'transparent',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: fs.sm, fontWeight: 700, padding: 0,
        }}
      >
        {task.isCompleted ? '✓' : ''}
      </button>

      {/* Row card */}
      <div
        onClick={onSelect}
        onKeyDown={(e) => { if (e.key === 'Enter') onSelect(); }}
        tabIndex={0}
        role="button"
        aria-label={`${task.title}, ${formatTime(task.time)}, ${task.room}${task.isCompleted ? ', completed' : ', pending'}`}
        aria-pressed={selected}
        style={{
          flex: 1,
          backgroundColor: cardBg,
          borderRadius: 8,
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: selected ? '2px solid #1A5276' : `1px solid ${border}`,
          cursor: 'pointer',
          transition: 'border 0.1s',
        }}
      >
        {/* Priority stripe */}
        <div style={{ width: 4, height: 32, borderRadius: 2, backgroundColor: getPriorityColor(task.priority), flexShrink: 0 }} aria-hidden="true" />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: fs.sm, fontWeight: 600, color: text,
            textDecoration: task.isCompleted ? 'line-through' : 'none',
            opacity: task.isCompleted ? 0.6 : 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{task.title}</div>
          <div style={{ fontSize: fs.xs, color: textMuted, marginTop: 2 }}>
            {formatTime(task.time)} · {task.room}
          </div>
        </div>

        {/* Category badge */}
        <span style={{
          fontSize: fs.xs, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
          backgroundColor: getCategoryColor(task.category) + '20',
          color: getCategoryColor(task.category),
        }}>
          {getCategoryLabel(task.category)}
        </span>
      </div>
    </div>
  );
}

function TaskDetail({ task, onToggle, onDelete, text, textMuted, cardBg, border, darkMode, fs }: {
  task: CareTask; onToggle: () => void; onDelete: () => void;
  text: string; textMuted: string; cardBg: string; border: string; darkMode: boolean; fs: any;
}) {
  const rows = [
    { label: 'Time', value: formatTime(task.time), icon: '🕐' },
    { label: 'Location', value: task.room, icon: '📍' },
    { label: 'Category', value: getCategoryLabel(task.category), icon: '🏷️' },
    { label: 'Priority', value: getPriorityLabel(task.priority), icon: '⚡' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Status */}
      <span style={{
        alignSelf: 'flex-start', padding: '4px 12px', borderRadius: 99, fontSize: fs.xs, fontWeight: 700,
        backgroundColor: task.isCompleted ? '#D5F5E3' : '#FEF9E7',
        color: task.isCompleted ? '#1E8449' : '#D68910',
      }}>
        {task.isCompleted ? '✓ Completed' : '⏳ Pending'}
      </span>

      <h2 style={{ fontSize: fs.xxl, fontWeight: 800, color: text, margin: 0, lineHeight: 1.3 }}>{task.title}</h2>

      {/* Detail rows */}
      <div style={{ backgroundColor: cardBg, borderRadius: 8, border: `1px solid ${border}`, overflow: 'hidden' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            borderBottom: i < rows.length - 1 ? `1px solid ${border}` : 'none',
          }}>
            <span style={{ fontSize: fs.lg, width: 28, textAlign: 'center' }} aria-hidden="true">{r.icon}</span>
            <div>
              <div style={{ fontSize: fs.xs, color: textMuted }}>{r.label}</div>
              <div style={{ fontSize: fs.sm, fontWeight: 600, color: text }}>{r.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notes */}
      {task.description && (
        <div style={{ backgroundColor: cardBg, borderRadius: 8, padding: 14, border: `1px solid ${border}` }}>
          <div style={{ fontSize: fs.xs, color: textMuted, fontWeight: 600, marginBottom: 4 }}>Notes</div>
          <div style={{ fontSize: fs.sm, color: text, lineHeight: 1.6 }}>{task.description}</div>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={onToggle}
          style={{
            flex: 1, padding: '12px 0', borderRadius: 8, border: 'none',
            backgroundColor: task.isCompleted ? '#BDBDBD' : '#1E8449',
            color: '#fff', fontSize: fs.md, fontWeight: 700, cursor: 'pointer',
          }}
          aria-label={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
        >
          {task.isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: '12px 20px', borderRadius: 8, border: 'none',
            backgroundColor: '#C0392B', color: '#fff', fontSize: fs.md, fontWeight: 700, cursor: 'pointer',
          }}
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
