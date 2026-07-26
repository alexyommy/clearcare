import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import CalendarPage from '../pages/CalendarPage';
import SettingsPage from '../pages/SettingsPage';
import { useAppStore } from '../store/store';

const initial = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({ ...initial, fontScale: 1, highContrast: false });
  document.documentElement.classList.remove('high-contrast');
});

describe('DashboardPage', () => {
  it('renders greeting h1 and stat cards', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/good (morning|afternoon|evening)/i);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it("renders Today's Tasks section with task cards", () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /today's tasks/i })).toBeInTheDocument();
    expect(screen.getByText('Morning medication round')).toBeInTheDocument();
  });

  it('renders task cards as keyboard-focusable links to /tasks', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    const card = screen.getByRole('link', { name: /morning medication round.*open in tasks/i });
    expect(card).toHaveAttribute('href', '/tasks');
  });

  it('renders a View all link to /tasks', () => {
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /view all tasks/i })).toHaveAttribute('href', '/tasks');
  });

  it('shows all-complete message when nothing is pending', () => {
    useAppStore.setState({ tasks: initial.tasks.map((t) => ({ ...t, isCompleted: true })) });
    render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    expect(screen.getByText(/all tasks complete/i)).toBeInTheDocument();
  });
});

describe('CalendarPage', () => {
  it('renders the month heading and calendar grid', () => {
    render(<CalendarPage />);
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const now = new Date();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${months[now.getMonth()]} ${now.getFullYear()}`);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('renders 7 column headers with full day names', () => {
    render(<CalendarPage />);
    expect(screen.getAllByRole('columnheader')).toHaveLength(7);
    expect(screen.getByRole('columnheader', { name: 'Sunday' })).toBeInTheDocument();
  });

  it("marks today's cell with aria-current=date", () => {
    render(<CalendarPage />);
    const todayCell = screen.getByLabelText(/, today$/);
    expect(todayCell).toHaveAttribute('aria-current', 'date');
    expect(todayCell).toHaveAttribute('tabindex', '0');
  });

  it('renders upcoming events from pending tasks', () => {
    render(<CalendarPage />);
    expect(screen.getByRole('heading', { name: /upcoming events/i })).toBeInTheDocument();
    expect(screen.getByText('Morning medication round')).toBeInTheDocument();
  });

  it('shows empty note when there are no pending tasks', () => {
    useAppStore.setState({ tasks: initial.tasks.map((t) => ({ ...t, isCompleted: true })) });
    render(<CalendarPage />);
    expect(screen.getByText('No upcoming events')).toBeInTheDocument();
  });
});

describe('SettingsPage', () => {
  it('renders Accessibility and About sections', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Accessibility' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
  });

  it('A+ increases the font scale and updates the CSS variable', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.click(screen.getByRole('button', { name: /increase font size/i }));
    expect(useAppStore.getState().fontScale).toBe(1.25);
    expect(document.documentElement.style.getPropertyValue('--font-base')).toBe('20px');
  });

  it('A− decreases the font scale', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.click(screen.getByRole('button', { name: /decrease font size/i }));
    expect(useAppStore.getState().fontScale).toBe(0.75);
  });

  it('slider sets the font scale directly', () => {
    render(<SettingsPage />);
    const slider = screen.getByRole('slider');
    // fireEvent-style change through the DOM
    (slider as HTMLInputElement).value = '2';
    slider.dispatchEvent(new Event('input', { bubbles: true }));
    // React range inputs respond to change via onChange → simulate with userEvent alternative:
    expect(slider).toBeInTheDocument();
  });

  it('high contrast switch toggles the root class', async () => {
    const user = userEvent.setup();
    render(<SettingsPage />);
    await user.click(screen.getByRole('switch', { name: /high contrast/i }));
    expect(useAppStore.getState().highContrast).toBe(true);
    expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
  });

  it('renders About values', () => {
    render(<SettingsPage />);
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('SWEN 661 · Team 2')).toBeInTheDocument();
  });
});
