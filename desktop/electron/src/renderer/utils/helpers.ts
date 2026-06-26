import { CareTask, TaskPriority, TaskCategory } from '../store/types';
import { Colors } from './theme';

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
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

export function getPriorityColor(p: TaskPriority): string {
  return p === 'high' ? Colors.priorityHigh : p === 'medium' ? Colors.priorityMedium : Colors.priorityLow;
}

export function getCategoryColor(c: TaskCategory): string {
  const map: Record<TaskCategory, string> = {
    medication: Colors.catMedication,
    appointment: Colors.catAppointment,
    hygiene: Colors.catHygiene,
    nutrition: Colors.catNutrition,
    therapy: Colors.catTherapy,
    monitoring: Colors.catMonitoring,
    other: Colors.catOther,
  };
  return map[c] ?? Colors.catOther;
}

export function getCategoryLabel(c: TaskCategory): string {
  return c.charAt(0).toUpperCase() + c.slice(1);
}

export function getPriorityLabel(p: TaskPriority): string {
  return p.charAt(0).toUpperCase() + p.slice(1);
}
