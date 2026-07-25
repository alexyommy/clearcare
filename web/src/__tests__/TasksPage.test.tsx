import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TasksPage from '../pages/TasksPage';
import { useAppStore } from '../store/store';

// jsdom lacks HTMLDialogElement.showModal/close
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });
});

const initial = useAppStore.getState();

beforeEach(() => {
  useAppStore.setState({
    ...initial,
    tasks: [
      { id: 't1', title: 'Medication round', description: 'Give meds', time: '08:00', room: 'Room 1', category: 'medication', priority: 'high', isCompleted: false },
      { id: 't2', title: 'Vitals check', time: '09:00', room: 'Room 2', category: 'monitoring', priority: 'medium', isCompleted: true },
    ],
    searchQuery: '',
    showNewTaskModal: false,
  });
});

describe('TasksPage', () => {
  it('renders pending and completed sections with counts', () => {
    render(<TasksPage />);
    expect(screen.getByRole('heading', { name: /pending \(1\)/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /completed \(1\)/i })).toBeInTheDocument();
  });

  it('renders task titles', () => {
    render(<TasksPage />);
    expect(screen.getByText('Medication round')).toBeInTheDocument();
    expect(screen.getByText('Vitals check')).toBeInTheDocument();
  });

  it('toggle button marks a task complete', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.click(screen.getByRole('button', { name: /mark medication round as complete/i }));
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')?.isCompleted).toBe(true);
  });

  it('delete button removes a task', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.click(screen.getByRole('button', { name: /delete medication round/i }));
    expect(useAppStore.getState().tasks.find((t) => t.id === 't1')).toBeUndefined();
  });

  it('search filters the visible tasks', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'vitals');
    expect(screen.queryByText('Medication round')).not.toBeInTheDocument();
    expect(screen.getByText('Vitals check')).toBeInTheDocument();
  });

  it('shows empty note when no pending tasks match search', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.type(screen.getByRole('searchbox', { name: /search tasks/i }), 'zzz');
    expect(screen.getByText(/no pending tasks match/i)).toBeInTheDocument();
  });

  it('New Task button opens the modal', async () => {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.click(screen.getByRole('button', { name: /\+ new task/i }));
    expect(useAppStore.getState().showNewTaskModal).toBe(true);
    expect(screen.getByRole('heading', { name: /new task/i })).toBeInTheDocument();
  });
});

describe('NewTaskModal (within TasksPage)', () => {
  async function openModal() {
    const user = userEvent.setup();
    render(<TasksPage />);
    await user.click(screen.getByRole('button', { name: /\+ new task/i }));
    // Let the modal's 50ms focus timer fire before interacting with the form,
    // so typing can't race against the focus() call
    await act(() => new Promise((r) => setTimeout(r, 60)));
    return user;
  }

  it('shows validation error when title is empty', async () => {
    const user = await openModal();
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Title is required');
  });

  it('shows validation error when location is empty', async () => {
    const user = await openModal();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test task' } });
    await user.click(screen.getByRole('button', { name: /create task/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Location is required');
  });

  it('adds a task when the form is valid', async () => {
    const user = await openModal();
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Wound care' } });
    fireEvent.change(screen.getByLabelText('Location'), { target: { value: 'Room 12' } });
    await user.click(screen.getByRole('button', { name: /create task/i }));
    const added = useAppStore.getState().tasks.find((t) => t.title === 'Wound care');
    expect(added).toBeDefined();
    expect(added?.room).toBe('Room 12');
    expect(useAppStore.getState().showNewTaskModal).toBe(false);
  });

  it('Cancel button closes the modal', async () => {
    const user = await openModal();
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(useAppStore.getState().showNewTaskModal).toBe(false);
  });

  it('close (✕) button closes the modal', async () => {
    const user = await openModal();
    await user.click(screen.getByRole('button', { name: /close new task dialog/i }));
    expect(useAppStore.getState().showNewTaskModal).toBe(false);
  });
});
