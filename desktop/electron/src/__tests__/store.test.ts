import { useAppStore } from '../renderer/store/store';

// Reset store state between tests
beforeEach(() => {
  useAppStore.setState({
    user: null,
    currentScreen: 'dashboard',
    fontSize: 16,
    highContrast: false,
    darkMode: false,
    searchQuery: '',
    showShortcutsDialog: false,
    showNewTaskDialog: false,
    tasks: [
      { id: 't1', title: 'Morning medication', description: '', time: '08:00', room: 'Room 1', category: 'medication', priority: 'high', isCompleted: false },
      { id: 't2', title: 'Vitals check', description: '', time: '09:00', room: 'Room 2', category: 'monitoring', priority: 'medium', isCompleted: true },
    ],
  });
});

// ── Auth ───────────────────────────────────────────────────────────────────────

describe('signIn', () => {
  it('returns true and sets user for valid demo credentials', () => {
    const ok = useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    expect(ok).toBe(true);
    expect(useAppStore.getState().user).not.toBeNull();
    expect(useAppStore.getState().user?.email).toBe('demo@careconnect.com');
    expect(useAppStore.getState().user?.role).toBe('caregiver');
  });

  it('returns false for wrong credentials', () => {
    const ok = useAppStore.getState().signIn('bad@example.com', 'wrongpass');
    expect(ok).toBe(false);
    expect(useAppStore.getState().user).toBeNull();
  });
});

describe('signOut', () => {
  it('clears user and resets screen to dashboard', () => {
    useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    useAppStore.getState().setScreen('tasks');
    useAppStore.getState().signOut();
    expect(useAppStore.getState().user).toBeNull();
    expect(useAppStore.getState().currentScreen).toBe('dashboard');
  });
});

// ── Navigation ─────────────────────────────────────────────────────────────────

describe('setScreen', () => {
  it('updates currentScreen', () => {
    useAppStore.getState().setScreen('tasks');
    expect(useAppStore.getState().currentScreen).toBe('tasks');
  });
});

// ── Task operations ────────────────────────────────────────────────────────────

describe('toggleTask', () => {
  it('flips isCompleted on the task', () => {
    useAppStore.getState().toggleTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')?.isCompleted).toBe(true);
  });

  it('toggles back to false on second call', () => {
    useAppStore.getState().toggleTask('t1');
    useAppStore.getState().toggleTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')?.isCompleted).toBe(false);
  });

  it('does not affect other tasks', () => {
    useAppStore.getState().toggleTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't2')?.isCompleted).toBe(true);
  });
});

describe('addTask', () => {
  it('appends a new task with a generated id', () => {
    const before = useAppStore.getState().tasks.length;
    useAppStore.getState().addTask({
      title: 'New task',
      description: '',
      time: '10:00',
      room: 'Room 5',
      category: 'other',
      priority: 'low',
      isCompleted: false,
    });
    expect(useAppStore.getState().tasks.length).toBe(before + 1);
    const added = useAppStore.getState().tasks.find((t) => t.title === 'New task');
    expect(added).toBeDefined();
    expect(added?.id).toMatch(/^t_/);
  });

  it('closes the new task dialog after adding', () => {
    useAppStore.setState({ showNewTaskDialog: true });
    useAppStore.getState().addTask({
      title: 'Another task', description: '', time: '11:00', room: 'Room 6',
      category: 'other', priority: 'low', isCompleted: false,
    });
    expect(useAppStore.getState().showNewTaskDialog).toBe(false);
  });
});

describe('deleteTask', () => {
  it('removes the task by id', () => {
    useAppStore.getState().deleteTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')).toBeUndefined();
    expect(useAppStore.getState().tasks.length).toBe(1);
  });
});

// ── Font size ──────────────────────────────────────────────────────────────────

describe('fontSize', () => {
  it('setFontSize clamps to [12, 32]', () => {
    useAppStore.getState().setFontSize(50);
    expect(useAppStore.getState().fontSize).toBe(32);
    useAppStore.getState().setFontSize(1);
    expect(useAppStore.getState().fontSize).toBe(12);
    useAppStore.getState().setFontSize(20);
    expect(useAppStore.getState().fontSize).toBe(20);
  });

  it('increaseFontSize increments by 2, capped at 32', () => {
    useAppStore.setState({ fontSize: 30 });
    useAppStore.getState().increaseFontSize();
    expect(useAppStore.getState().fontSize).toBe(32);
    useAppStore.getState().increaseFontSize();
    expect(useAppStore.getState().fontSize).toBe(32);
  });

  it('decreaseFontSize decrements by 2, floored at 12', () => {
    useAppStore.setState({ fontSize: 14 });
    useAppStore.getState().decreaseFontSize();
    expect(useAppStore.getState().fontSize).toBe(12);
    useAppStore.getState().decreaseFontSize();
    expect(useAppStore.getState().fontSize).toBe(12);
  });
});

// ── Toggles ────────────────────────────────────────────────────────────────────

describe('toggleHighContrast', () => {
  it('flips highContrast', () => {
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(true);
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(false);
  });
});

describe('toggleDarkMode', () => {
  it('flips darkMode', () => {
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(true);
    useAppStore.getState().toggleDarkMode();
    expect(useAppStore.getState().darkMode).toBe(false);
  });
});

// ── Search & dialogs ──────────────────────────────────────────────────────────

describe('setSearchQuery', () => {
  it('updates searchQuery', () => {
    useAppStore.getState().setSearchQuery('medication');
    expect(useAppStore.getState().searchQuery).toBe('medication');
  });
});

describe('dialog state', () => {
  it('setShowShortcuts sets showShortcutsDialog', () => {
    useAppStore.getState().setShowShortcuts(true);
    expect(useAppStore.getState().showShortcutsDialog).toBe(true);
    useAppStore.getState().setShowShortcuts(false);
    expect(useAppStore.getState().showShortcutsDialog).toBe(false);
  });

  it('setShowNewTask sets showNewTaskDialog', () => {
    useAppStore.getState().setShowNewTask(true);
    expect(useAppStore.getState().showNewTaskDialog).toBe(true);
  });
});
