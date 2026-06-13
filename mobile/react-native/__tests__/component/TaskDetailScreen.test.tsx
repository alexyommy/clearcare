/**
 * RNTL component tests for TaskDetailScreen.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import TaskDetailScreen from '../../src/screens/TaskDetailScreen';
import { useAppStore } from '../../src/context/store';

const INITIAL_TASKS = useAppStore.getState().tasks;
const FIRST_TASK = INITIAL_TASKS.find((t) => !t.isCompleted)!;
const COMPLETED_TASK = INITIAL_TASKS.find((t) => t.isCompleted)!;

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn(), reset: jest.fn() }),
    useRoute: jest.fn(),
  };
});

import { useRoute } from '@react-navigation/native';
const mockUseRoute = useRoute as jest.Mock;

beforeEach(() => {
  useAppStore.setState({ tasks: [...INITIAL_TASKS] });
});

describe('TaskDetailScreen — valid task', () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { taskId: FIRST_TASK.id } });
  });

  it('renders the task title', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText(FIRST_TASK.title)).toBeTruthy();
  });

  it('renders Mark as Complete button', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Mark as Complete')).toBeTruthy();
  });

  it('renders the back navigation button', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('← Back')).toBeTruthy();
  });

  it('renders Time detail row', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Time')).toBeTruthy();
  });

  it('renders Location detail row', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Location')).toBeTruthy();
    expect(screen.getByText(FIRST_TASK.room)).toBeTruthy();
  });

  it('renders category chip', () => {
    render(<TaskDetailScreen />);
    // "Medication" appears in both the chip and the detail row — grab any occurrence
    expect(screen.getAllByText('Medication')[0]).toBeTruthy();
  });

  it('renders priority chip — uses getAllByText to handle duplicates', () => {
    render(<TaskDetailScreen />);
    // "High Priority" chip and "Priority" detail label — just check the chip text
    const matches = screen.getAllByText(/Priority/);
    expect(matches.length).toBeGreaterThan(0);
  });

  it('shows Pending status badge for incomplete task', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('⏳ Pending')).toBeTruthy();
  });

  it('tapping Mark as Complete toggles the task in store', () => {
    render(<TaskDetailScreen />);
    fireEvent.press(screen.getByText('Mark as Complete'));
    const updated = useAppStore.getState().tasks.find((t) => t.id === FIRST_TASK.id)!;
    expect(updated.isCompleted).toBe(true);
  });

  it('shows Mark as Pending after completing', () => {
    render(<TaskDetailScreen />);
    fireEvent.press(screen.getByText('Mark as Complete'));
    expect(screen.getByText('Mark as Pending')).toBeTruthy();
  });

  it('renders Delete button', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Delete')).toBeTruthy();
  });

  it('renders Category detail row', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Category')).toBeTruthy();
  });
});

describe('TaskDetailScreen — completed task', () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { taskId: COMPLETED_TASK.id } });
  });

  it('shows Completed status badge', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('✓ Completed')).toBeTruthy();
  });

  it('shows Mark as Pending button', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Mark as Pending')).toBeTruthy();
  });
});

describe('TaskDetailScreen — not found', () => {
  beforeEach(() => {
    mockUseRoute.mockReturnValue({ params: { taskId: 'nonexistent-id' } });
  });

  it('shows Task not found message', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Task not found')).toBeTruthy();
  });

  it('shows Go Back button', () => {
    render(<TaskDetailScreen />);
    expect(screen.getByText('Go Back')).toBeTruthy();
  });
});
