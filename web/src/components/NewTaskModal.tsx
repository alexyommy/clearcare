import { useEffect, useRef, useState } from 'react';
import { useAppStore, type TaskCategory, type TaskPriority } from '../store/store';

const CATEGORIES: TaskCategory[] = ['medication', 'appointment', 'hygiene', 'nutrition', 'therapy', 'monitoring', 'other'];
const PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

/**
 * New Task modal — uses native <dialog>.showModal() which provides:
 *  - focus trapping inside the dialog (WCAG 2.4.3)
 *  - Escape-to-close (WCAG 2.1.1 / keyboard support)
 * Focus is moved to the Title field on open and returns to the
 * trigger automatically when the dialog closes.
 */
export default function NewTaskModal() {
  const show = useAppStore((s) => s.showNewTaskModal);
  const setShow = useAppStore((s) => s.setShowNewTaskModal);
  const addTask = useAppStore((s) => s.addTask);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [room, setRoom] = useState('');
  const [category, setCategory] = useState<TaskCategory>('medication');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (show && !dialog.open) {
      dialog.showModal();
      setTimeout(() => titleRef.current?.focus(), 50);
    } else if (!show && dialog.open) {
      dialog.close();
    }
  }, [show]);

  // Native <dialog> fires 'close' on Escape — sync store state and reset form
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setShow(false);
      setTitle(''); setTime('09:00'); setRoom(''); setCategory('medication');
      setPriority('medium'); setDescription(''); setError('');
    };
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [setShow]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required.'); titleRef.current?.focus(); return; }
    if (!room.trim()) { setError('Location is required.'); return; }
    addTask({ title: title.trim(), time, room: room.trim(), category, priority, description: description.trim() || undefined, isCompleted: false });
  };

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="new-task-heading">
      <div className="modal-header">
        <h2 id="new-task-heading">New Task</h2>
        <button
          type="button"
          className="modal-close"
          onClick={() => setShow(false)}
          aria-label="Close new task dialog"
        >
          ✕
        </button>
      </div>

      {error && <div role="alert" className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-field">
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Administer medication"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-time">Time</label>
            <input id="task-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="task-room">Location</label>
            <input
              id="task-room"
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Room 204"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="task-category">Category</label>
            <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="task-desc">Notes (optional)</label>
          <textarea
            id="task-desc"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details…"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={() => setShow(false)}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">Create Task</button>
        </div>
      </form>
    </dialog>
  );
}
