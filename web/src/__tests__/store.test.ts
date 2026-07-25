import { useAppStore } from '../store/store';

const initial = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({
    ...initial,
    tasks: [
      { id: 't1', title: 'Task one', time: '08:00', room: 'Room 1', category: 'medication', priority: 'high', isCompleted: false },
      { id: 't2', title: 'Task two', time: '09:00', room: 'Room 2', category: 'therapy', priority: 'low', isCompleted: true },
    ],
    searchQuery: '',
    fontScale: 1,
    highContrast: false,
    showNewTaskModal: false,
  });
});

describe('toggleTask', () => {
  it('flips completion state', () => {
    useAppStore.getState().toggleTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')?.isCompleted).toBe(true);
  });
  it('does not affect other tasks', () => {
    useAppStore.getState().toggleTask('t1');
    expect(useAppStore.getState().tasks.find((t) => t.id === 't2')?.isCompleted).toBe(true);
  });
});

describe('addTask', () => {
  it('appends a task with generated id and closes the modal', () => {
    useAppStore.setState({ showNewTaskModal: true });
    useAppStore.getState().addTask({
      title: 'New', time: '10:00', room: 'Room 3', category: 'other', priority: 'medium', isCompleted: false,
    });
    const s = useAppStore.getState();
    expect(s.tasks).toHaveLength(3);
    expect(s.tasks[2].id).toMatch(/^t_/);
    expect(s.showNewTaskModal).toBe(false);
  });
});

describe('deleteTask', () => {
  it('removes the task', () => {
    useAppStore.getState().deleteTask('t1');
    expect(useAppStore.getState().tasks).toHaveLength(1);
    expect(useAppStore.getState().tasks[0].id).toBe('t2');
  });
});

describe('setFontScale', () => {
  it('clamps to [0.75, 2]', () => {
    useAppStore.getState().setFontScale(5);
    expect(useAppStore.getState().fontScale).toBe(2);
    useAppStore.getState().setFontScale(0.1);
    expect(useAppStore.getState().fontScale).toBe(0.75);
    useAppStore.getState().setFontScale(1.25);
    expect(useAppStore.getState().fontScale).toBe(1.25);
  });
});

describe('toggleHighContrast', () => {
  it('flips the flag', () => {
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(true);
    useAppStore.getState().toggleHighContrast();
    expect(useAppStore.getState().highContrast).toBe(false);
  });
});

describe('setSearchQuery / setShowNewTaskModal', () => {
  it('updates search query', () => {
    useAppStore.getState().setSearchQuery('meds');
    expect(useAppStore.getState().searchQuery).toBe('meds');
  });
  it('updates modal visibility', () => {
    useAppStore.getState().setShowNewTaskModal(true);
    expect(useAppStore.getState().showNewTaskModal).toBe(true);
  });
});
