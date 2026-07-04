import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../renderer/components/Sidebar';
import { useAppStore } from '../renderer/store/store';

beforeEach(() => {
  useAppStore.setState({
    currentScreen: 'dashboard',
    darkMode: false,
    user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
  });
});

describe('Sidebar', () => {
  it('renders main navigation landmark', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
  });

  it('renders CareConnect brand name', () => {
    render(<Sidebar />);
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders all four nav items', () => {
    render(<Sidebar />);
    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  });

  it('marks the active screen with aria-current="page"', () => {
    render(<Sidebar />);
    const activeBtn = screen.getByRole('button', { name: /dashboard/i });
    expect(activeBtn).toHaveAttribute('aria-current', 'page');
  });

  it('clicking Tasks navigates to tasks screen', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: /tasks/i }));
    expect(useAppStore.getState().currentScreen).toBe('tasks');
  });

  it('clicking Calendar navigates to calendar screen', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: /calendar/i }));
    expect(useAppStore.getState().currentScreen).toBe('calendar');
  });

  it('clicking Settings navigates to settings screen', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    expect(useAppStore.getState().currentScreen).toBe('settings');
  });

  it('shows user name when logged in', () => {
    render(<Sidebar />);
    expect(screen.getByText('Demo Caregiver')).toBeInTheDocument();
  });

  it('does not show user footer when no user', () => {
    useAppStore.setState({ user: null });
    render(<Sidebar />);
    expect(screen.queryByText('Demo Caregiver')).not.toBeInTheDocument();
  });
});
