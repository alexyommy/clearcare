/**
 * Automated accessibility tests using axe-core (via jest-axe).
 * Maps to WCAG 2.1 Level AA — covers all major screens and dialogs.
 *
 * Run: npm test -- --testPathPattern=accessibility
 */

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import LoginScreen from '../renderer/screens/LoginScreen';
import DashboardScreen from '../renderer/screens/DashboardScreen';
import TasksScreen from '../renderer/screens/TasksScreen';
import CalendarScreen from '../renderer/screens/CalendarScreen';
import SettingsScreen from '../renderer/screens/SettingsScreen';
import Sidebar from '../renderer/components/Sidebar';
import Toolbar from '../renderer/components/Toolbar';
import NewTaskDialog from '../renderer/components/NewTaskDialog';
import ShortcutsDialog from '../renderer/components/ShortcutsDialog';
import { useAppStore } from '../renderer/store/store';

expect.extend(toHaveNoViolations);

// jsdom stubs for HTMLDialogElement
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

const TASKS = [
  { id: 't1', title: 'Morning medication', description: 'Administer meds', time: '08:00', room: 'Room 204', category: 'medication' as const, priority: 'high' as const, isCompleted: false },
  { id: 't2', title: 'Vitals check', description: '', time: '09:30', room: 'Room 112', category: 'monitoring' as const, priority: 'medium' as const, isCompleted: true },
  { id: 't3', title: 'Therapy session', description: '', time: '11:00', room: 'Room 306', category: 'therapy' as const, priority: 'low' as const, isCompleted: false },
];

const SIGNED_IN_USER = { id: 'u1', name: 'Demo Caregiver', email: 'demo@careconnect.com', role: 'caregiver' as const };

function resetStore(overrides: Partial<Parameters<typeof useAppStore.setState>[0]> = {}) {
  useAppStore.setState({
    user: SIGNED_IN_USER,
    tasks: TASKS,
    currentScreen: 'dashboard',
    fontSize: 16,
    darkMode: false,
    highContrast: false,
    searchQuery: '',
    showShortcutsDialog: false,
    showNewTaskDialog: false,
    ...overrides,
  });
}

// ── Login ──────────────────────────────────────────────────────────────────────

describe('Accessibility — LoginScreen', () => {
  beforeEach(() => useAppStore.setState({ user: null }));

  it('has no axe violations', async () => {
    const { container } = render(<LoginScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Dashboard ──────────────────────────────────────────────────────────────────

describe('Accessibility — DashboardScreen', () => {
  beforeEach(() => resetStore());

  it('has no axe violations', async () => {
    const { container } = render(<DashboardScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Tasks ──────────────────────────────────────────────────────────────────────

describe('Accessibility — TasksScreen', () => {
  beforeEach(() => resetStore());

  it('has no axe violations (empty selection)', async () => {
    const { container } = render(<TasksScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (all tasks complete)', async () => {
    resetStore({ tasks: TASKS.map((t) => ({ ...t, isCompleted: true })) });
    const { container } = render(<TasksScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (empty task list)', async () => {
    resetStore({ tasks: [] });
    const { container } = render(<TasksScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Calendar ───────────────────────────────────────────────────────────────────

describe('Accessibility — CalendarScreen', () => {
  beforeEach(() => resetStore());

  it('has no axe violations', async () => {
    const { container } = render(<CalendarScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Settings ───────────────────────────────────────────────────────────────────

describe('Accessibility — SettingsScreen', () => {
  beforeEach(() => resetStore());

  it('has no axe violations (default)', async () => {
    const { container } = render(<SettingsScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (dark mode)', async () => {
    resetStore({ darkMode: true });
    const { container } = render(<SettingsScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (high contrast)', async () => {
    resetStore({ highContrast: true });
    const { container } = render(<SettingsScreen />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Sidebar ────────────────────────────────────────────────────────────────────

describe('Accessibility — Sidebar', () => {
  beforeEach(() => resetStore());

  it('has no axe violations', async () => {
    const { container } = render(<Sidebar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (no user)', async () => {
    resetStore({ user: null as any });
    const { container } = render(<Sidebar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── Toolbar ────────────────────────────────────────────────────────────────────

describe('Accessibility — Toolbar', () => {
  beforeEach(() => resetStore());

  it('has no axe violations (dashboard)', async () => {
    const { container } = render(<Toolbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations (tasks screen — New Task button visible)', async () => {
    resetStore({ currentScreen: 'tasks' });
    const { container } = render(<Toolbar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── NewTaskDialog ──────────────────────────────────────────────────────────────

describe('Accessibility — NewTaskDialog', () => {
  beforeEach(() => resetStore({ showNewTaskDialog: true }));

  it('has no axe violations (open)', async () => {
    const { container } = render(<NewTaskDialog />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ── ShortcutsDialog ────────────────────────────────────────────────────────────

describe('Accessibility — ShortcutsDialog', () => {
  beforeEach(() => resetStore({ showShortcutsDialog: true }));

  it('has no axe violations (open)', async () => {
    const { container } = render(<ShortcutsDialog />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
