import { create } from 'zustand';

export type TaskCategory = 'medication' | 'appointment' | 'hygiene' | 'nutrition' | 'therapy' | 'monitoring' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  time: string; // HH:mm
  room: string;
  category: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
}

const SAMPLE_TASKS: CareTask[] = [
  { id: 't1', title: 'Morning medication round', description: 'Administer blood pressure and vitamin D medications.', time: '08:00', room: 'Room 204', category: 'medication', priority: 'high', isCompleted: false },
  { id: 't2', title: 'Vitals check', description: 'Record and log vital signs.', time: '09:30', room: 'Mary Johnson', category: 'monitoring', priority: 'high', isCompleted: false },
  { id: 't3', title: 'Physical therapy session', description: 'Assist with upper-body mobility exercises.', time: '11:00', room: 'Room 112', category: 'therapy', priority: 'medium', isCompleted: false },
  { id: 't4', title: 'Wound dressing change', description: 'Change bandages and check healing progress.', time: '13:00', room: 'Room 306', category: 'hygiene', priority: 'medium', isCompleted: false },
  { id: 't5', title: 'Blood glucose monitoring', description: 'Test and record blood sugar levels.', time: '14:30', room: 'Robert Chen', category: 'monitoring', priority: 'high', isCompleted: true },
  { id: 't6', title: 'Evening medication round', description: 'Distribute evening prescriptions.', time: '18:00', room: 'All patients', category: 'medication', priority: 'high', isCompleted: false },
];

interface AppState {
  tasks: CareTask[];
  searchQuery: string;
  fontScale: number; // 1 = 100%
  highContrast: boolean;
  showNewTaskModal: boolean;

  toggleTask: (id: string) => void;
  addTask: (task: Omit<CareTask, 'id'>) => void;
  deleteTask: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setFontScale: (s: number) => void;
  toggleHighContrast: () => void;
  setShowNewTaskModal: (show: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  tasks: SAMPLE_TASKS,
  searchQuery: '',
  fontScale: 1,
  highContrast: false,
  showNewTaskModal: false,

  toggleTask: (id) => set((s) => ({
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t)),
  })),
  addTask: (task) => set((s) => ({
    tasks: [...s.tasks, { ...task, id: `t_${Date.now()}` }],
    showNewTaskModal: false,
  })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFontScale: (fontScale) => set({ fontScale: Math.min(2, Math.max(0.75, fontScale)) }),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  setShowNewTaskModal: (show) => set({ showNewTaskModal: show }),
}));
