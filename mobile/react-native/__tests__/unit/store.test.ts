/**
 * Unit tests for the Zustand store (useAppStore).
 *
 * We reset store state between tests to avoid cross-contamination.
 */

import { useAppStore } from '../../src/context/store';

// Helper: reset store to initial values before each test
const INITIAL = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({
    auth: { user: null, isLoading: false, error: null },
    tasks: [...INITIAL.tasks],
    patients: [...INITIAL.patients],
    fontSize: 18,
    highContrast: false,
    darkMode: false,
    pushNotifications: true,
  });
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

describe('store — auth', () => {
  it('signIn with correct credentials sets user', async () => {
    await useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    const { user, error } = useAppStore.getState().auth;
    expect(user).not.toBeNull();
    expect(user?.email).toBe('demo@careconnect.com');
    expect(error).toBeNull();
  });

  it('signIn with wrong password sets error and no user', async () => {
    await useAppStore.getState().signIn('demo@careconnect.com', 'wrongpassword');
    const { user, error } = useAppStore.getState().auth;
    expect(user).toBeNull();
    expect(error).toBe('Invalid email or password.');
  });

  it('signIn with unknown email sets error', async () => {
    await useAppStore.getState().signIn('nobody@example.com', 'password123');
    expect(useAppStore.getState().auth.user).toBeNull();
    expect(useAppStore.getState().auth.error).toBeTruthy();
  });

  it('signOut clears user and resets auth state', async () => {
    await useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    useAppStore.getState().signOut();
    const { user, error, isLoading } = useAppStore.getState().auth;
    expect(user).toBeNull();
    expect(error).toBeNull();
    expect(isLoading).toBe(false);
  });

  it('clearAuthError removes error without affecting user', async () => {
    await useAppStore.getState().signIn('demo@careconnect.com', 'wrongpassword');
    expect(useAppStore.getState().auth.error).not.toBeNull();
    useAppStore.getState().clearAuthError();
    expect(useAppStore.getState().auth.error).toBeNull();
  });

  it('signUp with new email registers user successfully', async () => {
    await useAppStore.getState().signUp('New User', 'newuser@example.com', 'password123');
    const { user, error } = useAppStore.getState().auth;
    expect(user).not.toBeNull();
    expect(user?.name).toBe('New User');
    expect(error).toBeNull();
  });

  it('signUp with existing email sets error', async () => {
    await useAppStore.getState().signUp('Demo', 'demo@careconnect.com', 'password123');
    const { user, error } = useAppStore.getState().auth;
    expect(user).toBeNull();
    expect(error).toBe('Email already registered.');
  });

  it('setRole updates the user role', async () => {
    await useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    useAppStore.getState().setRole('patient');
    expect(useAppStore.getState().auth.user?.role).toBe('patient');
  });
});

// ─── Tasks ────────────────────────────────────────────────────────────────────

describe('store — tasks', () => {
  it('starts with 6 sample tasks', () => {
    expect(useAppStore.getState().tasks).toHaveLength(6);
  });

  it('addTask appends a new task with generated id', () => {
    useAppStore.getState().addTask({
      title: 'New Task',
      time: '09:00',
      room: 'Room X',
      category: 'other',
      priority: 'low',
      isCompleted: false,
    });
    const tasks = useAppStore.getState().tasks;
    expect(tasks).toHaveLength(7);
    expect(tasks[tasks.length - 1].title).toBe('New Task');
    expect(tasks[tasks.length - 1].id).toBeTruthy();
  });

  it('updateTask modifies only the specified task', () => {
    const firstId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().updateTask(firstId, { title: 'Updated Title' });
    const updated = useAppStore.getState().tasks.find((t) => t.id === firstId);
    expect(updated?.title).toBe('Updated Title');
    // Other tasks unchanged
    expect(useAppStore.getState().tasks.filter((t) => t.id !== firstId).every((t) => t.title !== 'Updated Title')).toBe(true);
  });

  it('deleteTask removes the task from the list', () => {
    const firstId = useAppStore.getState().tasks[0].id;
    useAppStore.getState().deleteTask(firstId);
    const tasks = useAppStore.getState().tasks;
    expect(tasks).toHaveLength(5);
    expect(tasks.find((t) => t.id === firstId)).toBeUndefined();
  });

  it('toggleTask flips isCompleted from false to true', () => {
    const pendingTask = useAppStore.getState().tasks.find((t) => !t.isCompleted)!;
    expect(pendingTask.isCompleted).toBe(false);
    useAppStore.getState().toggleTask(pendingTask.id);
    const updated = useAppStore.getState().tasks.find((t) => t.id === pendingTask.id)!;
    expect(updated.isCompleted).toBe(true);
  });

  it('toggleTask flips isCompleted from true to false', () => {
    const completedTask = useAppStore.getState().tasks.find((t) => t.isCompleted)!;
    expect(completedTask.isCompleted).toBe(true);
    useAppStore.getState().toggleTask(completedTask.id);
    const updated = useAppStore.getState().tasks.find((t) => t.id === completedTask.id)!;
    expect(updated.isCompleted).toBe(false);
  });

  it('addTask preserves existing tasks', () => {
    const before = useAppStore.getState().tasks.length;
    useAppStore.getState().addTask({ title: 'X', time: '10:00', room: 'R', category: 'other', priority: 'low', isCompleted: false });
    expect(useAppStore.getState().tasks).toHaveLength(before + 1);
  });
});

// ─── Settings ─────────────────────────────────────────────────────────────────

describe('store — settings', () => {
  it('starts with fontSize 18', () => {
    expect(useAppStore.getState().fontSize).toBe(18);
  });

  it('setFontSize updates font size', () => {
    useAppStore.getState().setFontSize(24);
    expect(useAppStore.getState().fontSize).toBe(24);
  });

  it('setFontSize clamps to minimum 16', () => {
    useAppStore.getState().setFontSize(10);
    expect(useAppStore.getState().fontSize).toBe(16);
  });

  it('setFontSize clamps to maximum 32', () => {
    useAppStore.getState().setFontSize(50);
    expect(useAppStore.getState().fontSize).toBe(32);
  });

  it('toggleHighContrast flips from false to true', () => {
    expect(useAppStore.getState().highContrast).toBe(false);
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(true);
  });

  it('toggleHighContrast flips from true to false', () => {
    useAppStore.getState().toggleHighContrast();
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(false);
  });

  it('toggleDarkMode flips state', () => {
    expect(useAppStore.getState().darkMode).toBe(false);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(true);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(false);
  });

  it('togglePushNotifications flips from true to false', () => {
    expect(useAppStore.getState().pushNotifications).toBe(true);
    useAppStore.getState().togglePushNotifications();
    expect(useAppStore.getState().pushNotifications).toBe(false);
  });
});
