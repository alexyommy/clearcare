import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../store/store';
import { useTheme } from '../utils/useTheme';
import { TaskCategory, TaskPriority } from '../store/types';

const CATEGORIES: TaskCategory[] = ['medication', 'appointment', 'hygiene', 'nutrition', 'therapy', 'monitoring', 'other'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

export default function NewTaskDialog() {
  const show = useAppStore((s) => s.showNewTaskDialog);
  const setShow = useAppStore((s) => s.setShowNewTask);
  const addTask = useAppStore((s) => s.addTask);
  const { fs, colors: c } = useTheme();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState<TaskCategory>('medication');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      dialogRef.current?.showModal();
      setTimeout(() => titleInputRef.current?.focus(), 50);
    } else {
      dialogRef.current?.close();
      setTitle(''); setTime('09:00'); setRoom(''); setCategory('medication');
      setPriority('medium'); setDescription(''); setError('');
    }
  }, [show]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) { e.preventDefault(); setShow(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, setShow]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); titleInputRef.current?.focus(); return; }
    if (!room.trim()) { setError('Location is required.'); return; }
    addTask({ title: title.trim(), time, room: room.trim(), category, priority, description: description.trim() || undefined, isCompleted: false });
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: `1.5px solid ${c.border}`, backgroundColor: c.inputBg,
    color: c.text, fontSize: fs.md, outline: 'none',
  };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: fs.sm, fontWeight: 600, color: c.text, marginBottom: 6 };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Create new task"
      style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        backgroundColor: c.surface, color: c.text, border: `1px solid ${c.border}`,
        borderRadius: 12, padding: 32, maxWidth: 480, width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: fs.xl, fontWeight: 700, margin: 0 }}>New Task</h2>
        <button
          onClick={() => setShow(false)}
          aria-label="Close new task dialog"
          style={{ border: 'none', background: 'none', fontSize: 24, cursor: 'pointer', color: c.text, padding: 4 }}
        >×</button>
      </div>

      {error && (
        <div role="alert" style={{
          backgroundColor: '#FDEDED', borderLeft: '4px solid #C0392B', borderRadius: 6,
          padding: 10, marginBottom: 16, color: '#C0392B', fontSize: fs.sm, fontWeight: 600,
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label htmlFor="task-title" style={labelStyle}>Title</label>
          <input
            id="task-title" ref={titleInputRef} type="text" value={title}
            onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Administer medication"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="task-time" style={labelStyle}>Time</label>
            <input id="task-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="task-room" style={labelStyle}>Location</label>
            <input
              id="task-room" type="text" value={room} onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 204" style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="task-category" style={labelStyle}>Category</label>
            <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} style={inputStyle}>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Priority</label>
            <div role="radiogroup" aria-label="Priority" style={{ display: 'flex', gap: 6 }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p} type="button" role="radio" aria-checked={priority === p}
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 6,
                    border: priority === p ? '2px solid #1A5276' : `1.5px solid ${c.border}`,
                    backgroundColor: priority === p ? '#1A527620' : c.inputBg,
                    color: priority === p ? '#1A5276' : c.textMuted,
                    fontSize: fs.xs, fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >{p}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="task-desc" style={labelStyle}>Notes (optional)</label>
          <textarea
            id="task-desc" value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details…" rows={3}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            type="button" onClick={() => setShow(false)}
            style={{ flex: 1, padding: '12px 0', borderRadius: 8, border: `1.5px solid ${c.border}`, backgroundColor: 'transparent', color: c.text, fontSize: fs.md, fontWeight: 600, cursor: 'pointer' }}
          >Cancel</button>
          <button
            type="submit"
            style={{ flex: 2, padding: '12px 0', borderRadius: 8, border: 'none', backgroundColor: '#1A5276', color: '#fff', fontSize: fs.md, fontWeight: 700, cursor: 'pointer' }}
          >Create Task (Ctrl+S)</button>
        </div>
      </form>
    </dialog>
  );
}
