import { useAppStore } from '../context/store';
import { getPendingTasks, getCompletedTasks, sortTasksByTime } from '../utils/helpers';

// ─── Auth hook ────────────────────────────────────────────────────────────────
export function useAuth() {
  const user = useAppStore((s) => s.auth.user);
  const isLoading = useAppStore((s) => s.auth.isLoading);
  const error = useAppStore((s) => s.auth.error);
  const signIn = useAppStore((s) => s.signIn);
  const signUp = useAppStore((s) => s.signUp);
  const signOut = useAppStore((s) => s.signOut);
  const setRole = useAppStore((s) => s.setRole);
  const clearAuthError = useAppStore((s) => s.clearAuthError);

  return { user, isLoading, error, signIn, signUp, signOut, setRole, clearAuthError };
}

// ─── Tasks hook ───────────────────────────────────────────────────────────────
export function useTasks() {
  const tasks = useAppStore((s) => s.tasks);
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const toggleTask = useAppStore((s) => s.toggleTask);

  const pendingTasks = sortTasksByTime(getPendingTasks(tasks));
  const completedTasks = getCompletedTasks(tasks);

  return {
    tasks,
    pendingTasks,
    completedTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
  };
}

// ─── Patients hook ────────────────────────────────────────────────────────────
export function usePatients() {
  const patients = useAppStore((s) => s.patients);
  return { patients };
}

// ─── Settings hook ────────────────────────────────────────────────────────────
export function useSettings() {
  const fontSize = useAppStore((s) => s.fontSize);
  const highContrast = useAppStore((s) => s.highContrast);
  const darkMode = useAppStore((s) => s.darkMode);
  const pushNotifications = useAppStore((s) => s.pushNotifications);
  const setFontSize = useAppStore((s) => s.setFontSize);
  const toggleHighContrast = useAppStore((s) => s.toggleHighContrast);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const togglePushNotifications = useAppStore((s) => s.togglePushNotifications);

  return {
    fontSize,
    highContrast,
    darkMode,
    pushNotifications,
    setFontSize,
    toggleHighContrast,
    toggleDarkMode,
    togglePushNotifications,
  };
}
