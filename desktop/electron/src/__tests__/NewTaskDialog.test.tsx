import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NewTaskDialog from '../renderer/components/NewTaskDialog';
import { useAppStore } from '../renderer/store/store';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

beforeEach(() => {
  useAppStore.setState({
    showNewTaskDialog: true,
    fontSize: 16,
    darkMode: false,
    highContrast: false,
    tasks: [],
  });
});

describe('NewTaskDialog', () => {
  it('renders the dialog when showNewTaskDialog is true', () => {
    render(<NewTaskDialog />);
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  it('renders nothing when showNewTaskDialog is false', () => {
    useAppStore.setState({ showNewTaskDialog: false });
    render(<NewTaskDialog />);
    expect(screen.queryByText('New Task')).not.toBeInTheDocument();
  });

  it('renders title, time, location, and notes fields', () => {
    render(<NewTaskDialog />);
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
    expect(screen.getByLabelText('Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Notes (optional)')).toBeInTheDocument();
  });

  it('shows error when title is empty on submit', () => {
    render(<NewTaskDialog />);
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
  });

  it('shows error when location is empty on submit', () => {
    render(<NewTaskDialog />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Task' } });
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Location is required');
  });

  it('adds task to store when form is filled correctly', () => {
    render(<NewTaskDialog />);
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'My Task' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Room 99' } });
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    const added = useAppStore.getState().tasks.find((t) => t.title === 'My Task');
    expect(added).toBeDefined();
    expect(added?.room).toBe('Room 99');
  });

  it('Cancel button closes the dialog', () => {
    render(<NewTaskDialog />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(useAppStore.getState().showNewTaskDialog).toBe(false);
  });

  it('close (×) button in header closes the dialog', () => {
    render(<NewTaskDialog />);
    fireEvent.click(screen.getByRole('button', { name: /close new task dialog/i }));
    expect(useAppStore.getState().showNewTaskDialog).toBe(false);
  });

  it('pressing Escape closes the dialog', () => {
    render(<NewTaskDialog />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useAppStore.getState().showNewTaskDialog).toBe(false);
  });

  it('renders priority radio group with low, medium, high', () => {
    render(<NewTaskDialog />);
    expect(screen.getByRole('radiogroup', { name: /priority/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /low/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /medium/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /high/i })).toBeInTheDocument();
  });

  it('clicking a priority radio selects it (aria-checked)', () => {
    render(<NewTaskDialog />);
    const highBtn = screen.getByRole('radio', { name: /high/i });
    fireEvent.click(highBtn);
    expect(highBtn).toHaveAttribute('aria-checked', 'true');
  });

  it('renders Category select with all 7 options', () => {
    render(<NewTaskDialog />);
    const select = screen.getByLabelText('Category') as HTMLSelectElement;
    expect(select.options.length).toBe(7);
  });
});
