import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TasksScreen from '../renderer/screens/TasksScreen';
import { useAppStore } from '../renderer/store/store';

const TASKS = [
  { id: 't1', title: 'Medication round', description: 'Give meds', time: '08:00', room: 'Room 1', category: 'medication' as const, priority: 'high' as const, isCompleted: false },
  { id: 't2', title: 'Vitals check', description: '', time: '09:00', room: 'Room 2', category: 'monitoring' as const, priority: 'medium' as const, isCompleted: true },
];

beforeEach(() => {
  useAppStore.setState({
    tasks: TASKS,
    searchQuery: '',
    fontSize: 16,
    darkMode: false,
    highContrast: false,
    user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
  });
});

describe('TasksScreen', () => {
  it('renders PENDING section header', () => {
    render(<TasksScreen />);
    expect(screen.getByText(/PENDING \(1\)/)).toBeInTheDocument();
  });

  it('renders COMPLETED section header', () => {
    render(<TasksScreen />);
    expect(screen.getByText(/COMPLETED \(1\)/)).toBeInTheDocument();
  });

  it('renders pending task title', () => {
    render(<TasksScreen />);
    expect(screen.getByText('Medication round')).toBeInTheDocument();
  });

  it('renders completed task title', () => {
    render(<TasksScreen />);
    expect(screen.getByText('Vitals check')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    useAppStore.setState({ tasks: [] });
    render(<TasksScreen />);
    expect(screen.getByText('No tasks yet')).toBeInTheDocument();
  });

  it('shows search empty state when query matches nothing', () => {
    useAppStore.setState({ searchQuery: 'xyz-no-match' });
    render(<TasksScreen />);
    expect(screen.getByText('No tasks match your search')).toBeInTheDocument();
  });

  it('clicking a task card shows detail panel', () => {
    render(<TasksScreen />);
    fireEvent.click(screen.getByRole('button', { name: /medication round/i }));
    // Detail panel action button (larger "Mark as Complete" in aside, not checkbox mini-button)
    expect(screen.getByRole('button', { name: /delete task/i })).toBeInTheDocument();
  });

  it('Mark as Complete button in detail panel toggles task', () => {
    render(<TasksScreen />);
    fireEvent.click(screen.getByRole('button', { name: /medication round/i }));
    // Get all buttons named mark as complete and click the last one (detail panel)
    const completeBtns = screen.getAllByRole('button', { name: /mark as complete/i });
    fireEvent.click(completeBtns[completeBtns.length - 1]);
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')?.isCompleted).toBe(true);
  });

  it('Delete button removes the task', () => {
    render(<TasksScreen />);
    fireEvent.click(screen.getByRole('button', { name: /medication round/i }));
    fireEvent.click(screen.getByRole('button', { name: /delete task/i }));
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')).toBeUndefined();
  });

  it('filters tasks by search query', () => {
    useAppStore.setState({ searchQuery: 'Vitals' });
    render(<TasksScreen />);
    expect(screen.getByText('Vitals check')).toBeInTheDocument();
    expect(screen.queryByText('Medication round')).not.toBeInTheDocument();
  });

  it('task row has checkbox button for toggling', () => {
    render(<TasksScreen />);
    const toggleBtn = screen.getByRole('button', { name: /mark as complete/i, hidden: false });
    expect(toggleBtn).toBeInTheDocument();
  });

  it('Enter key on task row selects it', () => {
    render(<TasksScreen />);
    const taskBtn = screen.getByRole('button', { name: /medication round/i });
    fireEvent.keyDown(taskBtn, { key: 'Enter' });
    expect(screen.getByRole('button', { name: /delete task/i })).toBeInTheDocument();
  });

  it('shows placeholder when no task is selected', () => {
    render(<TasksScreen />);
    expect(screen.getByText('Select a task to view details')).toBeInTheDocument();
  });
});
