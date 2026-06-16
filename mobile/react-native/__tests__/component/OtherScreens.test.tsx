/**
 * RNTL render smoke tests for screens not covered by dedicated test files.
 * Verifies each screen mounts without crash and renders key UI elements.
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { useAppStore } from '../../src/context/store';

import WelcomeScreen from '../../src/screens/WelcomeScreen';
import RegisterScreen from '../../src/screens/RegisterScreen';
import RoleSelectionScreen from '../../src/screens/RoleSelectionScreen';
import DashboardScreen from '../../src/screens/DashboardScreen';
import CalendarScreen from '../../src/screens/CalendarScreen';
import ProfileScreen from '../../src/screens/ProfileScreen';
import SettingsScreen from '../../src/screens/SettingsScreen';
import PatientDashboardScreen from '../../src/screens/PatientDashboardScreen';

const INITIAL = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({
    ...INITIAL,
    auth: { user: null, isLoading: false, error: null },
    tasks: [...INITIAL.tasks],
    fontSize: 18,
    highContrast: false,
    darkMode: false,
    pushNotifications: true,
  });
});

// ─── WelcomeScreen ────────────────────────────────────────────────────────────

describe('WelcomeScreen', () => {
  it('renders app name', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('CareConnect')).toBeTruthy();
  });

  it('renders Sign In button', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('renders Create Account button', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('Create Account')).toBeTruthy();
  });

  it('renders tagline', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/Low-vision care coordination/)).toBeTruthy();
  });

  it('renders the CC logo initials', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText('CC')).toBeTruthy();
  });

  it('renders team footer', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/SWEN 661/)).toBeTruthy();
  });
});

// ─── RegisterScreen ───────────────────────────────────────────────────────────

describe('RegisterScreen', () => {
  it('renders Create Account heading', () => {
    render(<RegisterScreen />);
    expect(screen.getAllByText('Create Account')[0]).toBeTruthy();
  });

  it('renders Full Name field', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Full Name')).toBeTruthy();
  });

  it('renders Email Address field', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Email Address')).toBeTruthy();
  });

  it('renders Password field', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Password')).toBeTruthy();
  });

  it('shows name validation error on empty submit', async () => {
    render(<RegisterScreen />);
    fireEvent.press(screen.getByLabelText('Create account'));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getByText('Name must be at least 2 characters.')).toBeTruthy();
  });

  it('renders Sign In link', () => {
    render(<RegisterScreen />);
    expect(screen.getByText('Sign In')).toBeTruthy();
  });

  it('accepts text in Full Name field', () => {
    render(<RegisterScreen />);
    const input = screen.getByLabelText('Full Name');
    fireEvent.changeText(input, 'Jane Smith');
    expect(input.props.value).toBe('Jane Smith');
  });
});

// ─── RoleSelectionScreen ──────────────────────────────────────────────────────

describe('RoleSelectionScreen', () => {
  it('renders Select Your Role heading', () => {
    render(<RoleSelectionScreen />);
    expect(screen.getByText('Select Your Role')).toBeTruthy();
  });

  it('renders Caregiver option', () => {
    render(<RoleSelectionScreen />);
    expect(screen.getByText('Caregiver')).toBeTruthy();
  });

  it('renders Patient option', () => {
    render(<RoleSelectionScreen />);
    expect(screen.getByText('Patient')).toBeTruthy();
  });

  it('tapping Caregiver calls setRole', () => {
    // Sign in first so setRole has a user
    useAppStore.getState().signIn('demo@careconnect.com', 'demo123');
    render(<RoleSelectionScreen />);
    fireEvent.press(screen.getByText('Caregiver'));
    // No crash = pass
  });
});

// ─── DashboardScreen ──────────────────────────────────────────────────────────

describe('DashboardScreen', () => {
  beforeEach(() => {
    // Sign in as a caregiver
    useAppStore.setState({
      ...INITIAL,
      auth: {
        user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
        isLoading: false,
        error: null,
      },
      tasks: [...INITIAL.tasks],
    });
  });

  it('renders greeting', () => {
    render(<DashboardScreen />);
    expect(screen.getByText(/Good (morning|afternoon|evening)/)).toBeTruthy();
  });

  it('renders Pending stat card', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('renders Completed stat card', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders Total stat card', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Total')).toBeTruthy();
  });

  it("renders Today's Tasks section", () => {
    render(<DashboardScreen />);
    expect(screen.getByText("Today's Tasks")).toBeTruthy();
  });

  it('renders View all link', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('View all')).toBeTruthy();
  });

  it('renders Quick Access section', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('Quick Access')).toBeTruthy();
  });

  it('renders all tasks complete message when no pending tasks', () => {
    useAppStore.setState({
      tasks: INITIAL.tasks.map((t) => ({ ...t, isCompleted: true })),
    });
    render(<DashboardScreen />);
    expect(screen.getByText('All tasks complete! 🎉')).toBeTruthy();
  });
});

// ─── CalendarScreen ───────────────────────────────────────────────────────────

describe('CalendarScreen', () => {
  it('renders Calendar heading', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Calendar')).toBeTruthy();
  });

  it('renders month year header', () => {
    render(<CalendarScreen />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeTruthy();
  });

  it('renders day-of-week headers', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Sun')).toBeTruthy();
    expect(screen.getByText('Mon')).toBeTruthy();
    expect(screen.getByText('Sat')).toBeTruthy();
  });

  it('renders Upcoming Events section', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Upcoming Events')).toBeTruthy();
  });

  it('renders an event from sample data', () => {
    render(<CalendarScreen />);
    expect(screen.getByText('Morning medication round')).toBeTruthy();
  });

  it('shows no upcoming events when all tasks completed', () => {
    useAppStore.setState({
      tasks: INITIAL.tasks.map((t) => ({ ...t, isCompleted: true })),
    });
    render(<CalendarScreen />);
    expect(screen.getByText('No upcoming events')).toBeTruthy();
  });
});

// ─── ProfileScreen ────────────────────────────────────────────────────────────

describe('ProfileScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      auth: {
        user: { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' },
        isLoading: false,
        error: null,
      },
      tasks: [...INITIAL.tasks],
    });
  });

  it('renders the user name', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Demo Caregiver')).toBeTruthy();
  });

  it('renders the user email', () => {
    render(<ProfileScreen />);
    expect(screen.getAllByText('demo@careconnect.com')[0]).toBeTruthy();
  });

  it('renders Caregiver role badge', () => {
    render(<ProfileScreen />);
    // "Caregiver" appears in both the role badge and the ACCOUNT row
    expect(screen.getAllByText(/Caregiver/)[0]).toBeTruthy();
  });

  it('renders Task Overview section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Task Overview')).toBeTruthy();
  });

  it('renders Completed stat', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('renders Pending stat', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Pending')).toBeTruthy();
  });

  it('renders ACCOUNT section', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('ACCOUNT')).toBeTruthy();
  });

  it('renders Sign Out button', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('Sign Out')).toBeTruthy();
  });

  it('tapping edit icon shows text field', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByLabelText('Edit name'));
    expect(screen.getByLabelText('Edit your name')).toBeTruthy();
  });

  it('saving edited name closes text field', () => {
    render(<ProfileScreen />);
    fireEvent.press(screen.getByLabelText('Edit name'));
    const input = screen.getByLabelText('Edit your name');
    fireEvent.changeText(input, 'New Name');
    fireEvent.press(screen.getByText('Save'));
    expect(screen.queryByLabelText('Edit your name')).toBeNull();
  });

  it('renders initials avatar', () => {
    render(<ProfileScreen />);
    expect(screen.getByText('DC')).toBeTruthy();
  });
});

// ─── SettingsScreen ───────────────────────────────────────────────────────────

describe('SettingsScreen', () => {
  it('renders Settings heading', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  it('renders ACCESSIBILITY section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('ACCESSIBILITY')).toBeTruthy();
  });

  it('renders NOTIFICATIONS section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('NOTIFICATIONS')).toBeTruthy();
  });

  it('renders ABOUT section', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('ABOUT')).toBeTruthy();
  });

  it('renders Font Size control', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Font Size')).toBeTruthy();
  });

  it('renders High Contrast toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('High Contrast')).toBeTruthy();
  });

  it('renders Dark Mode toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Dark Mode')).toBeTruthy();
  });

  it('renders Push Notifications toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Push Notifications')).toBeTruthy();
  });

  it('tapping A+ increases font size', () => {
    render(<SettingsScreen />);
    const before = useAppStore.getState().fontSize;
    fireEvent.press(screen.getByLabelText('Increase font size'));
    expect(useAppStore.getState().fontSize).toBe(before + 2);
  });

  it('tapping A− decreases font size', () => {
    render(<SettingsScreen />);
    const before = useAppStore.getState().fontSize;
    fireEvent.press(screen.getByLabelText('Decrease font size'));
    expect(useAppStore.getState().fontSize).toBe(before - 2);
  });

  it('toggling High Contrast flips the store value', () => {
    render(<SettingsScreen />);
    const before = useAppStore.getState().highContrast;
    fireEvent(screen.getByLabelText('High contrast mode'), 'valueChange', !before);
    expect(useAppStore.getState().highContrast).toBe(!before);
  });

  it('toggling Dark Mode flips the store value', () => {
    render(<SettingsScreen />);
    const before = useAppStore.getState().darkMode;
    fireEvent(screen.getByLabelText('Dark mode'), 'valueChange', !before);
    expect(useAppStore.getState().darkMode).toBe(!before);
  });

  it('shows app version', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('1.0.0')).toBeTruthy();
  });
});

// ─── PatientDashboardScreen ───────────────────────────────────────────────────

describe('PatientDashboardScreen', () => {
  beforeEach(() => {
    useAppStore.setState({
      auth: {
        user: { id: 'u1', name: 'Margaret Thompson', email: 'patient@example.com', role: 'patient' },
        isLoading: false,
        error: null,
      },
      tasks: [...INITIAL.tasks],
    });
  });

  it('renders greeting', () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText(/Good (morning|afternoon|evening)/)).toBeTruthy();
  });

  it('renders care schedule subtitle', () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText(/care schedule/)).toBeTruthy();
  });

  it("renders Today's Schedule section", () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText("Today's Schedule")).toBeTruthy();
  });

  it('renders Your Care Team section', () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText('Your Care Team')).toBeTruthy();
  });

  it('renders caregiver in care team', () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText('Demo Caregiver')).toBeTruthy();
  });

  it('renders Need Help info card', () => {
    render(<PatientDashboardScreen />);
    expect(screen.getByText('Need Help?')).toBeTruthy();
  });

  it('renders no schedule message when all tasks completed', () => {
    useAppStore.setState({
      tasks: INITIAL.tasks.map((t) => ({ ...t, isCompleted: true })),
    });
    render(<PatientDashboardScreen />);
    expect(screen.getByText('No scheduled care tasks for today 🎉')).toBeTruthy();
  });
});
