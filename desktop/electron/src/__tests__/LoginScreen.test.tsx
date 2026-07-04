import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginScreen from '../renderer/screens/LoginScreen';
import { useAppStore } from '../renderer/store/store';

beforeEach(() => {
  useAppStore.setState({ user: null });
});

describe('LoginScreen', () => {
  it('renders the CareConnect heading', () => {
    render(<LoginScreen />);
    expect(screen.getByText('CareConnect')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<LoginScreen />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows demo hint text', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/demo@careconnect\.com/)).toBeInTheDocument();
  });

  it('shows error when email is empty on submit', () => {
    render(<LoginScreen />);
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
  });

  it('shows error when password is too short', () => {
    render(<LoginScreen />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 6 characters');
  });

  it('shows error on invalid credentials', () => {
    render(<LoginScreen />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid');
  });

  it('signs in with demo credentials and sets user in store', () => {
    render(<LoginScreen />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'demo@careconnect.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'demo123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(useAppStore.getState().user).not.toBeNull();
  });

  it('clears error message before each submit attempt', () => {
    render(<LoginScreen />);
    // First submit with empty email → error shown
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    // Fill valid email, short password → different error (proves clearing worked)
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('at least 6 characters');
  });
});
