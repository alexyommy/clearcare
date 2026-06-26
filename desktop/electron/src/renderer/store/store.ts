import { create } from 'zustand';
import { CareTask, User } from './types';

const SAMPLE_TASKS: CareTask[] = [
  { id: 't1', title: 'Morning medication round', description: 'Administer blood pressure and vitamin D medications.', time: '08:00', room: 'Room 204', category: 'medication', priority: 'high', isCompleted: false },
  { id: 't2', title: 'Vitals check', description: 'Record and log vital signs.', time: '09:30', room: 'Mary Johnson', category: 'monitoring', priority: 'high', isCompleted: false },
  { id: 't3', title: 'Physical therapy session', description: 'Assist with upper-body mobility exercises.', time: '11:00', room: 'Room 112', category: 'therapy', priority: 'medium', isCompleted: false },
  { id: 't4', title: 'Wound dressing change', description: 'Change bandages and check healing progress.', time: '13:00', room: 'Room 306', category: 'hygiene', priority: 'medium', isCompleted: false },
  { id: 't5', title: 'Blood glucose monitoring', description: 'Test and record blood sugar levels.', time: '14:30', room: 'Robert Chen', category: 'monitoring', priority: 'high', isCompleted: true },
  { id: 't6', title: 'Evening medication round', description: 'Distribute evening prescriptions.', time: '18:00', room: 'All patients', category: 'medication', priority: 'high', isCompleted: false },
];

interface AppState {
  user: User | null;
  tasks: CareTask[];
  currentScreen: string;
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  searchQuery: string;
  showShortcutsDialog: boolean;
  showNewTaskDialog: boolean;

  setScreen: (screen: string) => void;
  toggleTask: (id: string) => void;
  addTask: (task: Omit<CareTask, 'id'>) => void;
  deleteTask: (id: string) => void;
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleHighContrast: () => void;
  toggleDarkMode: () => void;
  setSearchQuery: (query: string) => void;
  setShowShortcuts: (show: boolean) => void;
  setShowNewTask: (show: boolean) => void;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  tasks: SAMPLE_TASKS,
  currentScreen: 'dashboard',
  fontSize: 16,
  highContrast: false,
  darkMode: false,
  searchQuery: '',
  showShortcutsDialog: false,
  showNewTaskDialog: false,

  setScreen: (screen) => set({ currentScreen: screen }),
  toggleTask: (id) => set((s) => ({
    tasks: s.tasks.map((t) => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t),
  })),
  addTask: (task) => set((s) => ({
    tasks: [...s.tasks, { ...task, id: `t_${Date.now()}` }],
    showNewTaskDialog: false,
  })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setFontSize: (size) => set({ fontSize: Math.min(32, Math.max(12, size)) }),
  increaseFontSize: () => set((s) => ({ fontSize: Math.min(32, s.fontSize + 2) })),
  decreaseFontSize: () => set((s) => ({ fontSize: Math.max(12, s.fontSize - 2) })),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setShowShortcuts: (show) => set({ showShortcutsDialog: show }),
  setShowNewTask: (show) => set({ showNewTaskDialog: show }),
  signIn: (email, password) => {
    if (email === 'demo@careconnect.com' && password === 'demo123') {
      set({ user: { id: 'u1', name: 'Demo Caregiver', email, role: 'caregiver' } });
      return true;
    }
    return false;
  },
  signOut: () => set({ user: null, currentScreen: 'dashboard' }),
}));
