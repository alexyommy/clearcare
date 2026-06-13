import { CareTask, TaskCategory, TaskPriority } from '../types';
import { Colors } from './theme';

// ─── Date / time ──────────────────────────────────────────────────────────────

/** Returns "Good morning / afternoon / evening, <name>" */
export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let period = 'morning';
  if (hour >= 12 && hour < 17) period = 'afternoon';
  else if (hour >= 17) period = 'evening';
  return `Good ${period}, ${name}!`;
}

/** Formats an ISO date string to "Mon, Jun 9" */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Formats "HH:MM" 24-hr to "h:MM AM/PM" */
export function formatTime(time: string): string {
  const [hourStr, minute] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

/** Returns current month name + year, e.g. "June 2026" */
export function getCurrentMonthYear(): string {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

// ─── Task helpers ─────────────────────────────────────────────────────────────

export function getPendingTasks(tasks: CareTask[]): CareTask[] {
  return tasks.filter((t) => !t.isCompleted);
}

export function getCompletedTasks(tasks: CareTask[]): CareTask[] {
  return tasks.filter((t) => t.isCompleted);
}

export function getTasksByPatient(tasks: CareTask[], patientId: string): CareTask[] {
  return tasks.filter((t) => t.patientId === patientId);
}

export function sortTasksByTime(tasks: CareTask[]): CareTask[] {
  return [...tasks].sort((a, b) => a.time.localeCompare(b.time));
}

// ─── Priority ─────────────────────────────────────────────────────────────────

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return Colors.priorityHigh;
    case 'medium':
      return Colors.priorityMedium;
    case 'low':
    default:
      return Colors.priorityLow;
  }
}

export function getPriorityLabel(priority: TaskPriority): string {
  return priority.charAt(0).toUpperCase() + priority.slice(1);
}

// ─── Category ─────────────────────────────────────────────────────────────────

export function getCategoryColor(category: TaskCategory): string {
  const map: Record<TaskCategory, string> = {
    medication: Colors.catMedication,
    appointment: Colors.catAppointment,
    hygiene: Colors.catHygiene,
    nutrition: Colors.catNutrition,
    therapy: Colors.catTherapy,
    monitoring: Colors.catMonitoring,
    other: Colors.catOther,
  };
  return map[category] ?? Colors.catOther;
}

export function getCategoryLabel(category: TaskCategory): string {
  const labels: Record<TaskCategory, string> = {
    medication: 'Medication',
    appointment: 'Appointment',
    hygiene: 'Hygiene',
    nutrition: 'Nutrition',
    therapy: 'Therapy',
    monitoring: 'Monitoring',
    other: 'Other',
  };
  return labels[category] ?? 'Other';
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): boolean {
  return password.length >= 6;
}

export function validateTaskTitle(title: string): boolean {
  return title.trim().length >= 2;
}
