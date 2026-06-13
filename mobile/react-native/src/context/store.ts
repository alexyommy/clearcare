import { create } from 'zustand';
import { CareTask, Patient, User } from '../types';

// ─── Sample data ──────────────────────────────────────────────────────────────

const SAMPLE_TASKS: CareTask[] = [
  {
    id: 't1',
    title: 'Morning medication round',
    description: 'Administer blood pressure and vitamin D medications.',
    time: '08:00',
    room: 'Room 12A',
    category: 'medication',
    priority: 'high',
    isCompleted: false,
    patientId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Physical therapy session',
    description: 'Assist with upper-body mobility exercises.',
    time: '10:30',
    room: 'Therapy Room',
    category: 'therapy',
    priority: 'medium',
    isCompleted: false,
    patientId: 'p2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Lunch nutrition check',
    description: 'Ensure dietary restrictions are followed.',
    time: '12:00',
    room: 'Dining Hall',
    category: 'nutrition',
    priority: 'medium',
    isCompleted: false,
    patientId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Blood pressure monitoring',
    description: 'Record and log BP readings.',
    time: '14:00',
    room: 'Room 12A',
    category: 'monitoring',
    priority: 'high',
    isCompleted: true,
    patientId: 'p1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Afternoon hygiene assistance',
    description: 'Help patient with daily hygiene routine.',
    time: '15:30',
    room: 'Room 8B',
    category: 'hygiene',
    priority: 'low',
    isCompleted: false,
    patientId: 'p2',
    createdAt: new Date().toISOString(),
  },
  {
    id: 't6',
    title: 'Doctor appointment prep',
    description: 'Prepare documentation and escort patient.',
    time: '16:00',
    room: 'Main Lobby',
    category: 'appointment',
    priority: 'high',
    isCompleted: false,
    patientId: 'p3',
    createdAt: new Date().toISOString(),
  },
];

const SAMPLE_PATIENTS: Patient[] = [
  { id: 'p1', name: 'Margaret Thompson', room: 'Room 12A', condition: 'Hypertension', caregiverId: 'u1' },
  { id: 'p2', name: 'Robert Chen', room: 'Room 8B', condition: 'Post-op recovery', caregiverId: 'u1' },
  { id: 'p3', name: 'Eleanor Davis', room: 'Room 15C', condition: 'Diabetes', caregiverId: 'u1' },
];

// ─── Store shape ──────────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AppState {
  // Auth
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  setRole: (role: 'caregiver' | 'patient') => void;
  clearAuthError: () => void;

  // Tasks
  tasks: CareTask[];
  addTask: (task: Omit<CareTask, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<CareTask>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;

  // Patients
  patients: Patient[];

  // Settings
  fontSize: number;
  highContrast: boolean;
  darkMode: boolean;
  pushNotifications: boolean;
  setFontSize: (size: number) => void;
  toggleHighContrast: () => void;
  toggleDarkMode: () => void;
  togglePushNotifications: () => void;
}

// Seed users for demo
const DEMO_USERS: { email: string; password: string; user: User }[] = [
  {
    email: 'demo@careconnect.com',
    password: 'demo123',
    user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // ── Auth ──────────────────────────────────────────────────────────────────
  auth: { user: null, isLoading: false, error: null },

  signIn: async (email, password) => {
    set((s) => ({ auth: { ...s.auth, isLoading: true, error: null } }));
    await new Promise((r) => setTimeout(r, 400)); // simulate network
    const match = DEMO_USERS.find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    );
    if (!match) {
      set((s) => ({
        auth: { ...s.auth, isLoading: false, error: 'Invalid email or password.' },
      }));
      return;
    }
    set({ auth: { user: match.user, isLoading: false, error: null } });
  },

  signUp: async (name, email, password) => {
    set((s) => ({ auth: { ...s.auth, isLoading: true, error: null } }));
    await new Promise((r) => setTimeout(r, 400));
    const exists = DEMO_USERS.some((u) => u.email === email.trim().toLowerCase());
    if (exists) {
      set((s) => ({
        auth: { ...s.auth, isLoading: false, error: 'Email already registered.' },
      }));
      return;
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: 'caregiver',
    };
    DEMO_USERS.push({ email: newUser.email, password, user: newUser });
    set({ auth: { user: newUser, isLoading: false, error: null } });
  },

  signOut: () => set({ auth: { user: null, isLoading: false, error: null } }),

  setRole: (role) =>
    set((s) =>
      s.auth.user ? { auth: { ...s.auth, user: { ...s.auth.user, role } } } : s,
    ),

  clearAuthError: () =>
    set((s) => ({ auth: { ...s.auth, error: null } })),

  // ── Tasks ─────────────────────────────────────────────────────────────────
  tasks: SAMPLE_TASKS,

  addTask: (task) =>
    set((s) => ({
      tasks: [
        ...s.tasks,
        { ...task, id: `t_${Date.now()}`, createdAt: new Date().toISOString() },
      ],
    })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),

  deleteTask: (id) =>
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  toggleTask: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    })),

  // ── Patients ──────────────────────────────────────────────────────────────
  patients: SAMPLE_PATIENTS,

  // ── Settings ──────────────────────────────────────────────────────────────
  fontSize: 18,
  highContrast: false,
  darkMode: false,
  pushNotifications: true,

  setFontSize: (size) => set({ fontSize: Math.min(32, Math.max(16, size)) }),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  togglePushNotifications: () => set((s) => ({ pushNotifications: !s.pushNotifications })),
}));
