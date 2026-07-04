import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutsDialog from '../renderer/components/ShortcutsDialog';
import { useAppStore } from '../renderer/store/store';

// jsdom doesn't implement HTMLDialogElement.showModal / close
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });
  HTMLDialogElement.prototype.close = jest.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

beforeEach(() => {
  useAppStore.setState({ showShortcutsDialog: true, darkMode: false });
});

describe('ShortcutsDialog', () => {
  it('renders the dialog when showShortcutsDialog is true', () => {
    render(<ShortcutsDialog />);
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('renders nothing when showShortcutsDialog is false', () => {
    useAppStore.setState({ showShortcutsDialog: false });
    render(<ShortcutsDialog />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });

  it('renders Ctrl + N shortcut', () => {
    render(<ShortcutsDialog />);
    expect(screen.getByText('Ctrl + N')).toBeInTheDocument();
    expect(screen.getByText('New task')).toBeInTheDocument();
  });

  it('renders Escape shortcut', () => {
    render(<ShortcutsDialog />);
    expect(screen.getByText('Close dialog')).toBeInTheDocument();
  });

  it('close button hides the dialog', () => {
    render(<ShortcutsDialog />);
    fireEvent.click(screen.getByRole('button', { name: /close shortcuts dialog/i }));
    expect(useAppStore.getState().showShortcutsDialog).toBe(false);
  });

  it('pressing Escape closes the dialog', () => {
    render(<ShortcutsDialog />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useAppStore.getState().showShortcutsDialog).toBe(false);
  });

  it('renders all 12 shortcut rows', () => {
    render(<ShortcutsDialog />);
    // Table has thead + tbody; each row in tbody has a kbd element
    expect(screen.getAllByRole('row').length).toBeGreaterThan(12);
  });
});
