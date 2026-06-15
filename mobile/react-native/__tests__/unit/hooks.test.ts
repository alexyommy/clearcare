import { renderHook, act } from '@testing-library/react-native';
import { useTasks, useAuth, useSettings } from '../../src/hooks/useStore';
import { useAppStore } from '../../src/context/store';

/**
 * Unit tests for custom hooks.
 * These hooks wrap the Zustand store, so we verify that they correctly
 * expose and manipulate the state.
 */

describe('Custom Hooks', () => {
  // Snapshot of initial state for resetting
  const INITIAL_STATE = useAppStore.getState();

  beforeEach(() => {
    // Reset the store to initial values before each test
    useAppStore.setState({
      ...INITIAL_STATE,
      auth: { user: null, isLoading: false, error: null },
      tasks: [...INITIAL_STATE.tasks],
      fontSize: 18,
      darkMode: false,
    });
  });

  describe('useTasks', () => {
    it('provides all tasks and computed pending/completed lists', () => {
      const { result } = renderHook(() => useTasks());

      // SAMPLE_TASKS starts with 6 tasks (5 pending, 1 completed)
      expect(result.current.tasks).toHaveLength(6);
      expect(result.current.pendingTasks).toHaveLength(5);
      expect(result.current.completedTasks).toHaveLength(1);
    });

    it('toggles a task status correctly', () => {
      const { result } = renderHook(() => useTasks());
      const taskId = result.current.pendingTasks[0].id;

      act(() => {
        result.current.toggleTask(taskId);
      });

      // The task should now be in the completed list
      expect(result.current.completedTasks.some(t => t.id === taskId)).toBe(true);
      expect(result.current.pendingTasks.some(t => t.id === taskId)).toBe(false);
    });

    it('deletes a task', () => {
      const { result } = renderHook(() => useTasks());
      const taskId = result.current.tasks[0].id;

      act(() => {
        result.current.deleteTask(taskId);
      });

      expect(result.current.tasks).toHaveLength(5);
      expect(result.current.tasks.find(t => t.id === taskId)).toBeUndefined();
    });
  });

  describe('useAuth', () => {
    it('starts with no authenticated user', () => {
      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('successfully signs in with valid credentials', async () => {
      const { result } = renderHook(() => useAuth());

      // Use act with async for state updates triggered by promises
      await act(async () => {
        await result.current.signIn('demo@careconnect.com', 'demo123');
      });

      expect(result.current.user?.email).toBe('demo@careconnect.com');
      expect(result.current.error).toBeNull();
    });

    it('sets error on invalid sign in', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn('demo@careconnect.com', 'wrong_password');
      });

      expect(result.current.user).toBeNull();
      expect(result.current.error).toBe('Invalid email or password.');
    });

    it('signs out the user', async () => {
      const { result } = renderHook(() => useAuth());

      // Sign in first
      await act(async () => {
        await result.current.signIn('demo@careconnect.com', 'demo123');
      });
      expect(result.current.user).not.toBeNull();

      // Sign out
      act(() => {
        result.current.signOut();
      });
      expect(result.current.user).toBeNull();
    });
  });

  describe('useSettings', () => {
    it('updates font size within bounds', () => {
      const { result } = renderHook(() => useSettings());

      act(() => {
        result.current.setFontSize(24);
      });
      expect(result.current.fontSize).toBe(24);
    });

    it('toggles dark mode', () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current.darkMode).toBe(false);
      act(() => {
        result.current.toggleDarkMode();
      });
      expect(result.current.darkMode).toBe(true);
    });
  });
});
