import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SettingsScreen from '../renderer/screens/SettingsScreen';
import { useAppStore } from '../renderer/store/store';

beforeEach(() => {
  useAppStore.setState({ fontSize: 16, darkMode: false, highContrast: false });
});

describe('SettingsScreen', () => {
  it('renders the Settings heading', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders Font Size control', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Font Size')).toBeInTheDocument();
  });

  it('renders the font size slider', () => {
    render(<SettingsScreen />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('A+ button increases font size in store', () => {
    render(<SettingsScreen />);
    fireEvent.click(screen.getByRole('button', { name: /increase font size/i }));
    expect(useAppStore.getState().fontSize).toBe(18);
  });

  it('A− button decreases font size in store', () => {
    render(<SettingsScreen />);
    fireEvent.click(screen.getByRole('button', { name: /decrease font size/i }));
    expect(useAppStore.getState().fontSize).toBe(14);
  });

  it('slider change updates font size in store', () => {
    render(<SettingsScreen />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '24' } });
    expect(useAppStore.getState().fontSize).toBe(24);
  });

  it('renders High Contrast toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
  });

  it('renders Dark Mode toggle', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('toggling High Contrast updates store', () => {
    render(<SettingsScreen />);
    const checkbox = screen.getByRole('checkbox', { name: /high contrast/i });
    fireEvent.click(checkbox);
    expect(useAppStore.getState().highContrast).toBe(true);
  });

  it('toggling Dark Mode updates store', () => {
    render(<SettingsScreen />);
    const checkbox = screen.getByRole('checkbox', { name: /dark mode/i });
    fireEvent.click(checkbox);
    expect(useAppStore.getState().darkMode).toBe(true);
  });

  it('renders ABOUT section with version info', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('App Version')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
  });

  it('renders course info', () => {
    render(<SettingsScreen />);
    expect(screen.getByText('SWEN 661 · Team 2')).toBeInTheDocument();
  });

  it('Sign Out button calls signOut in store', () => {
    useAppStore.setState({ user: { id: 'u1', name: 'Demo', email: 'demo@careconnect.com', role: 'caregiver' } });
    render(<SettingsScreen />);
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));
    expect(useAppStore.getState().user).toBeNull();
  });
});
