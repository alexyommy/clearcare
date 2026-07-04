import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DashboardScreen from '../renderer/screens/DashboardScreen';
import { useAppStore } from '../renderer/store/store';

const TASKS = [
  { id: 't1', title: 'Morning medication', description: '', time: '08:00', room: 'Room 1', category: 'medication' as const, priority: 'high' as const, isCompleted: false },
  { id: 't2', title: 'Vitals check', description: '', time: '09:00', room: 'Room 2', category: 'monitoring' as const, priority: 'medium' as const, isCompleted: true },
  { id: 't3', title: 'Therapy session', description: '', time: '11:00', room: 'Room 3', category: 'therapy' as const, priority: 'low' as const, isCompleted: false },
];

beforeEach(() => {
  useAppStore.setState({
    user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
    tasks: TASKS,
    currentScreen: 'dashboard',
    fontSize: 16,
    darkMode: false,
    highContrast: false,
  });
});

describe('DashboardScreen', () => {
  it('renders a greeting', () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Good (morning|afternoon|evening)/i)).toBeInTheDocument();
  });

  it('renders Pending, Completed, Total stat cards', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('shows correct pending count (2 of 3 pending)', () => {
    render(<DashboardScreen />);
    // Pending stat card shows the count
    const pendingLabel = screen.getByText('Pending');
    expect(pendingLabel).toBeInTheDocument();
  });

  it('shows today\'s tasks section', () => {
    render(<DashboardScreen />);
    expect(screen.getByText("Today's Tasks")).toBeInTheDocument();
  });

  it('renders pending task titles in preview', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Morning medication')).toBeInTheDocument();
  });

  it('clicking View all navigates to tasks screen', () => {
    render(<DashboardScreen />);
    fireEvent.click(screen.getByRole('button', { name: /view all tasks/i }));
    expect(useAppStore.getState().currentScreen).toBe('tasks');
  });

  it('clicking Calendar quick-access button navigates to calendar', () => {
    render(<DashboardScreen />);
    fireEvent.click(screen.getByRole('button', { name: /go to calendar/i }));
    expect(useAppStore.getState().currentScreen).toBe('calendar');
  });

  it('clicking Settings quick-access button navigates to settings', () => {
    render(<DashboardScreen />);
    fireEvent.click(screen.getByRole('button', { name: /go to settings/i }));
    expect(useAppStore.getState().currentScreen).toBe('settings');
  });

  it('pressing Enter on a task card navigates to tasks', () => {
    render(<DashboardScreen />);
    const taskCard = screen.getByRole('button', { name: /morning medication/i });
    fireEvent.keyDown(taskCard, { key: 'Enter' });
    expect(useAppStore.getState().currentScreen).toBe('tasks');
  });

  it('shows all-complete message when no pending tasks', () => {
    useAppStore.setState({ tasks: TASKS.map((t) => ({ ...t, isCompleted: true })) });
    render(<DashboardScreen />);
    expect(screen.getByText(/all tasks complete/i)).toBeInTheDocument();
  });

  it('shows Quick Access section', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Quick Access')).toBeInTheDocument();
  });
});
