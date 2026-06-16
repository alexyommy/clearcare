// ─── Domain models ────────────────────────────────────────────────────────────

export type UserRole = 'caregiver' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskCategory =
  | 'medication'
  | 'appointment'
  | 'hygiene'
  | 'nutrition'
  | 'therapy'
  | 'monitoring'
  | 'other';

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  time: string;           // "HH:MM" 24-hr
  room: string;           // location / patient name
  category: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
  patientId?: string;
  createdAt: string;      // ISO date string
}

export interface Patient {
  id: string;
  name: string;
  room: string;
  condition: string;
  caregiverId: string;
}

// ─── Navigation param maps ─────────────────────────────────────────────────────

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RoleSelection: { userId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Calendar: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TaskDetail: { taskId: string };
  PatientDashboard: undefined;
};
