import type { CareTask, TaskCategory, TaskPriority } from '../store/store';

export function getGreeting(name: string, date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return `Good morning, ${name}!`;
  if (hour < 17) return `Good afternoon, ${name}!`;
  return `Good evening, ${name}!`;
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${period}`;
}

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  medication: '#C0392B',
  appointment: '#D68910',
  hygiene: '#16A085',
  nutrition: '#1E8449',
  therapy: '#2E86C1',
  monitoring: '#8E44AD',
  other: '#757575',
};

export function getCategoryColor(c: TaskCategory): string {
  return CATEGORY_COLORS[c] ?? CATEGORY_COLORS.other;
}

// Darker variants for badge TEXT — each meets WCAG AA (>=4.5:1) on the
// light category tint used as the badge background (WCAG 1.4.3).
const CATEGORY_TEXT_COLORS: Record<TaskCategory, string> = {
  medication: '#B0271B',
  appointment: '#8A5A06',
  hygiene: '#0C6E59',
  nutrition: '#1A7A41',
  therapy: '#1C6699',
  monitoring: '#7D3C98',
  other: '#5F5F5F',
};

export function getCategoryTextColor(c: TaskCategory): string {
  return CATEGORY_TEXT_COLORS[c] ?? CATEGORY_TEXT_COLORS.other;
}

export function getCategoryLabel(c: TaskCategory): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: '#C0392B',
  medium: '#D68910',
  low: '#1E8449',
};

export function getPriorityColor(p: TaskPriority): string {
  return PRIORITY_COLORS[p] ?? PRIORITY_COLORS.low;
}

export function getPriorityLabel(p: TaskPriority): string {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

export function filterTasks(tasks: CareTask[], query: string): CareTask[] {
  const q = query.trim().toLowerCase();
  if (!q) return tasks;
  return tasks.filter(
    (t) => t.title.toLowerCase().includes(q) || t.room.toLowerCase().includes(q)
  );
}
