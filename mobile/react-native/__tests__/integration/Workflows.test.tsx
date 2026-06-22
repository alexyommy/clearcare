import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react-native';
import AppNavigator from '../../src/navigation';
import { useAppStore } from '../../src/context/store';

// Restore real navigation for integration testing
jest.mock('@react-navigation/native', () => {
  return jest.requireActual('@react-navigation/native');
});

// Mock timer for sign-in simulation
jest.useFakeTimers();

describe('Multi-screen Workflows', () => {
  const INITIAL_STATE = useAppStore.getState();

  beforeEach(() => {
    useAppStore.setState({
      ...INITIAL_STATE,
      auth: { user: null, isLoading: false, error: null },
    });
  });

  it('Workflow: Welcome -> Login -> Dashboard', async () => {
    render(<AppNavigator />);

    // 1. Welcome Screen
    expect(screen.getByText('CareConnect')).toBeTruthy();
    fireEvent.press(screen.getByText('Sign In'));

    // 2. Login Screen
    await waitFor(() => {
      expect(screen.getByText('Welcome back to CareConnect')).toBeTruthy();
    });

    fireEvent.changeText(screen.getByLabelText('Email address'), 'demo@careconnect.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'demo123');

    // Press sign in
    fireEvent.press(screen.getByLabelText('Sign in'));

    // Fast-forward the simulated network delay (400ms in store.ts)
    // Wrap in act to handle state updates/animations triggered by timers
    await act(async () => {
      jest.advanceTimersByTime(500);
    });

    // 3. Dashboard
    await waitFor(() => {
      expect(screen.getByText(/Good .*, Demo!/)).toBeTruthy();
    });
    expect(screen.getByText("Today's Tasks")).toBeTruthy();
  });

  it('Workflow: Dashboard -> Task List -> Task Detail', async () => {
    // Start logged in as caregiver
    useAppStore.setState({
      ...INITIAL_STATE,
      auth: {
        user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
        isLoading: false,
        error: null,
      },
    });

    render(<AppNavigator />);

    // 1. On Dashboard - Wait for greeting
    await waitFor(() => {
      expect(screen.getByText(/Good/)).toBeTruthy();
    });

    // 2. Navigate to Tasks Tab
    fireEvent.press(screen.getByLabelText('Tasks tab'));

    await waitFor(() => {
      expect(screen.getByText('Pending (5)')).toBeTruthy();
    });

    // 3. Click first task (Morning medication round)
    fireEvent.press(screen.getByText('Morning medication round'));

    // 4. On Task Detail Screen
    await waitFor(() => {
      expect(screen.getByText('Morning medication round')).toBeTruthy();
      expect(screen.getByText('⏳ Pending')).toBeTruthy();
      expect(screen.getByText('Room 12A')).toBeTruthy();
    });
  });

  it('Workflow: Settings -> Toggle Dark Mode & Font Size', async () => {
    // Start logged in
    useAppStore.setState({
      ...INITIAL_STATE,
      auth: {
        user: { id: 'u1', name: 'Demo User', email: 'demo@careconnect.com', role: 'caregiver' },
        isLoading: false,
        error: null,
      },
    });

    render(<AppNavigator />);

    // 1. Navigate to Settings Tab
    fireEvent.press(screen.getByLabelText('Settings tab'));

    await waitFor(() => {
      expect(screen.getByRole('header', { name: 'Settings' })).toBeTruthy();
    });

    // 2. Change Font Size
    expect(screen.getByText('18sp')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Increase font size'));
    expect(screen.getByText('20sp')).toBeTruthy();

    // 3. Toggle Dark Mode
    const darkModeSwitch = screen.getByLabelText('Dark mode');
    await act(async () => {
      fireEvent(darkModeSwitch, 'onValueChange', true);
    });

    expect(useAppStore.getState().darkMode).toBe(true);
  });
});
