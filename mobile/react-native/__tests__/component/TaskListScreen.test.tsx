/**
 * RNTL component tests for TaskListScreen.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import TaskListScreen from '../../src/screens/TaskListScreen';
import { useAppStore } from '../../src/context/store';

const INITIAL_TASKS = useAppStore.getState().tasks;

beforeEach(() => {
  useAppStore.setState({ tasks: [...INITIAL_TASKS] });
});

describe('TaskListScreen', () => {
  it('renders Tasks header', () => {
    render(<TaskListScreen />);
    expect(screen.getByText('Tasks')).toBeTruthy();
  });

  it('renders Add Task button', () => {
    render(<TaskListScreen />);
    expect(screen.getByText('+ Add Task')).toBeTruthy();
  });

  it('shows Pending tab as default', () => {
    render(<TaskListScreen />);
    const pendingCount = INITIAL_TASKS.filter((t) => !t.isCompleted).length;
    expect(screen.getByText(`Pending (${pendingCount})`)).toBeTruthy();
  });

  it('shows Completed tab', () => {
    render(<TaskListScreen />);
    const completedCount = INITIAL_TASKS.filter((t) => t.isCompleted).length;
    expect(screen.getByText(`Completed (${completedCount})`)).toBeTruthy();
  });

  it('renders pending task titles', () => {
    render(<TaskListScreen />);
    const pendingTask = INITIAL_TASKS.find((t) => !t.isCompleted)!;
    expect(screen.getByText(pendingTask.title)).toBeTruthy();
  });

  it('switching to Completed tab shows completed tasks', () => {
    render(<TaskListScreen />);
    const completedCount = INITIAL_TASKS.filter((t) => t.isCompleted).length;
    fireEvent.press(screen.getByText(`Completed (${completedCount})`));
    const completedTask = INITIAL_TASKS.find((t) => t.isCompleted)!;
    expect(screen.getByText(completedTask.title)).toBeTruthy();
  });

  it('tapping a task checkbox toggles completion in store', () => {
    render(<TaskListScreen />);
    const pendingTask = INITIAL_TASKS.find((t) => !t.isCompleted)!;
    // Multiple checkboxes share the label — grab the first one
    const checkboxes = screen.getAllByLabelText('Mark as complete');
    fireEvent.press(checkboxes[0]);
    const updated = useAppStore.getState().tasks.find((t) => t.id === pendingTask.id)!;
    expect(updated.isCompleted).toBe(true);
  });

  it('shows empty message when all tasks are pending and tab is Completed', () => {
    useAppStore.setState({
      tasks: INITIAL_TASKS.map((t) => ({ ...t, isCompleted: false })),
    });
    render(<TaskListScreen />);
    fireEvent.press(screen.getByText('Completed (0)'));
    expect(screen.getByText('No completed tasks yet')).toBeTruthy();
  });

  it('shows empty message when all tasks are completed', () => {
    useAppStore.setState({
      tasks: INITIAL_TASKS.map((t) => ({ ...t, isCompleted: true })),
    });
    render(<TaskListScreen />);
    expect(screen.getByText('No pending tasks 🎉')).toBeTruthy();
  });

  it('displays task time', () => {
    render(<TaskListScreen />);
    expect(screen.getByText(/8:00 AM/)).toBeTruthy();
  });

  it('displays category badge on task cards', () => {
    render(<TaskListScreen />);
    expect(screen.getByText('Medication')).toBeTruthy();
  });
});
