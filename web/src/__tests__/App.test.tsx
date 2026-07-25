import { render, screen } from '@testing-library/react';
import App from '../App';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn();
  HTMLDialogElement.prototype.close = jest.fn();
});

describe('App', () => {
  it('renders the dashboard at the root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/good (morning|afternoon|evening)/i);
  });

  it('renders the tasks page at /tasks', () => {
    window.history.pushState({}, '', '/tasks');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Tasks' })).toBeInTheDocument();
  });

  it('renders the settings page at /settings', () => {
    window.history.pushState({}, '', '/settings');
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });
});
