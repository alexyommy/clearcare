import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Toolbar from '../renderer/components/Toolbar';
import { useAppStore } from '../renderer/store/store';

beforeEach(() => {
  useAppStore.setState({
    currentScreen: 'dashboard',
    searchQuery: '',
    darkMode: false,
    showNewTaskDialog: false,
  });
});

describe('Toolbar', () => {
  it('renders the toolbar landmark', () => {
    render(<Toolbar />);
    expect(screen.getByRole('toolbar')).toBeInTheDocument();
  });

  it('shows current screen title "Dashboard"', () => {
    render(<Toolbar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('shows "Tasks" when on tasks screen', () => {
    useAppStore.setState({ currentScreen: 'tasks' });
    render(<Toolbar />);
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('renders the search input', () => {
    render(<Toolbar />);
    expect(screen.getByRole('searchbox', { name: /search tasks/i })).toBeInTheDocument();
  });

  it('typing in search updates store searchQuery', () => {
    render(<Toolbar />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'medication' } });
    expect(useAppStore.getState().searchQuery).toBe('medication');
  });

  it('New Task button is absent on dashboard screen', () => {
    render(<Toolbar />);
    expect(screen.queryByRole('button', { name: /new task/i })).not.toBeInTheDocument();
  });

  it('New Task button is present on tasks screen', () => {
    useAppStore.setState({ currentScreen: 'tasks' });
    render(<Toolbar />);
    expect(screen.getByRole('button', { name: /create new task/i })).toBeInTheDocument();
  });

  it('clicking New Task button opens new task dialog', () => {
    useAppStore.setState({ currentScreen: 'tasks' });
    render(<Toolbar />);
    fireEvent.click(screen.getByRole('button', { name: /create new task/i }));
    expect(useAppStore.getState().showNewTaskDialog).toBe(true);
  });
});
