import React from 'react';
import { render, screen } from '@testing-library/react';
import CalendarScreen from '../renderer/screens/CalendarScreen';
import { useAppStore } from '../renderer/store/store';

const TASKS = [
  { id: 't1', title: 'Morning medication', description: '', time: '08:00', room: 'Room 1', category: 'medication' as const, priority: 'high' as const, isCompleted: false },
  { id: 't2', title: 'Vitals check', description: '', time: '09:00', room: 'Room 2', category: 'monitoring' as const, priority: 'medium' as const, isCompleted: true },
];

beforeEach(() => {
  useAppStore.setState({ tasks: TASKS, fontSize: 16, darkMode: false, highContrast: false });
});

describe('CalendarScreen', () => {
  it('renders the Calendar section', () => {
    render(<CalendarScreen />);
    expect(screen.getByRole('region', { name: /calendar/i })).toBeInTheDocument();
  });

  it('renders the current month and year', () => {
    render(<CalendarScreen />);
    const now = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    expect(screen.getByText(new RegExp(`${months[now.getMonth()]} ${now.getFullYear()}`))).toBeInTheDocument();
  });

  it('renders day headers (Sun through Sat)', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Sat')).toBeInTheDocument();
  });

  it('renders Upcoming Events section', () => {
    render(<CalendarScreen />);
    expect(screen.getByRole('region', { name: /upcoming events/i })).toBeInTheDocument();
    expect(screen.getByText('Upcoming Events')).toBeInTheDocument();
  });

  it('renders pending task in upcoming events', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Morning medication')).toBeInTheDocument();
  });

  it('does not render completed task in upcoming events', () => {
    render(<CalendarScreen />);
    expect(screen.queryByText('Vitals check')).not.toBeInTheDocument();
  });

  it('shows no upcoming events message when all tasks are complete', () => {
    useAppStore.setState({ tasks: TASKS.map((t) => ({ ...t, isCompleted: true })) });
    render(<CalendarScreen />);
    expect(screen.getByText('No upcoming events')).toBeInTheDocument();
  });

  it('renders today\'s date cell highlighted', () => {
    render(<CalendarScreen />);
    const today = new Date().getDate();
    // The today date appears as text in the grid
    const todayCell = screen.getByLabelText(new RegExp(`, today`));
    expect(todayCell).toBeInTheDocument();
  });
});
