export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'medication' | 'appointment' | 'hygiene' | 'nutrition' | 'therapy' | 'monitoring' | 'other';

export interface CareTask {
  id: string;
  title: string;
  description?: string;
  time: string;
  room: string;
  category: TaskCategory;
  priority: TaskPriority;
  isCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'caregiver' | 'patient';
}
