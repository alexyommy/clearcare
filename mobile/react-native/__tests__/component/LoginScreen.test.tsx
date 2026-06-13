/**
 * RNTL component tests for LoginScreen.
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import LoginScreen from '../../src/screens/LoginScreen';
import { useAppStore } from '../../src/context/store';

beforeEach(() => {
  useAppStore.setState({
    auth: { user: null, isLoading: false, error: null },
  });
});

describe('LoginScreen', () => {
  it('renders the Sign In heading', () => {
    render(<LoginScreen />);
    // Title "Sign In" appears twice (heading + button) — grab the first
    expect(screen.getAllByText('Sign In')[0]).toBeTruthy();
  });

  it('renders email and password inputs', () => {
    render(<LoginScreen />);
    expect(screen.getByLabelText('Email address')).toBeTruthy();
    expect(screen.getByLabelText('Password')).toBeTruthy();
  });

  it('renders demo credential hint', () => {
    render(<LoginScreen />);
    expect(screen.getByText(/demo@careconnect.com/)).toBeTruthy();
  });

  it('shows validation error when email is empty', async () => {
    render(<LoginScreen />);
    // Press the button using its accessibilityLabel (lowercase 'in')
    fireEvent.press(screen.getByLabelText('Sign in'));
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeTruthy();
    });
  });

  it('shows validation error when password is too short', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email address'), 'test@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), '123');
    fireEvent.press(screen.getByLabelText('Sign in'));
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeTruthy();
    });
  });

  it('shows server error banner on invalid credentials', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email address'), 'wrong@example.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'wrongpassword');
    fireEvent.press(screen.getByLabelText('Sign in'));
    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeTruthy();
    });
  });

  it('accepts valid demo credentials without validation error', async () => {
    render(<LoginScreen />);
    fireEvent.changeText(screen.getByLabelText('Email address'), 'demo@careconnect.com');
    fireEvent.changeText(screen.getByLabelText('Password'), 'demo123');
    fireEvent.press(screen.getByLabelText('Sign in'));
    await waitFor(() => {
      expect(screen.queryByText('Please enter a valid email address.')).toBeNull();
      expect(screen.queryByText('Password must be at least 6 characters.')).toBeNull();
    });
  });

  it('renders Sign Up navigation link', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('renders welcome subtitle', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Welcome back to CareConnect')).toBeTruthy();
  });

  it('renders Email Address label', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Email Address')).toBeTruthy();
  });

  it('renders Password label', () => {
    render(<LoginScreen />);
    expect(screen.getByText('Password')).toBeTruthy();
  });
});
