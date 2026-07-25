import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';

function renderLayout(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<div>Dashboard content</div>} />
          <Route path="tasks" element={<div>Tasks content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('AppLayout', () => {
  it('renders banner, navigation, main, and contentinfo landmarks', () => {
    renderLayout();
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders all four nav links', () => {
    renderLayout();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /calendar/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });

  it('marks the active route with aria-current="page"', () => {
    renderLayout('/tasks');
    expect(screen.getByRole('link', { name: /tasks/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /dashboard/i })).not.toHaveAttribute('aria-current');
  });

  it('renders routed content inside main', () => {
    renderLayout('/tasks');
    expect(screen.getByText('Tasks content')).toBeInTheDocument();
  });

  it('nav toggle has aria-expanded=false initially', () => {
    renderLayout();
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveAttribute('aria-expanded', 'false');
  });

  it('clicking the toggle opens the menu and updates ARIA state', async () => {
    const user = userEvent.setup();
    renderLayout();
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(toggle);
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toHaveClass('open');
  });

  it('selecting a nav link closes the mobile menu', async () => {
    const user = userEvent.setup();
    renderLayout();
    await user.click(screen.getByRole('button', { name: /open navigation menu/i }));
    await user.click(screen.getByRole('link', { name: /tasks/i }));
    expect(screen.getByRole('navigation', { name: /main navigation/i })).not.toHaveClass('open');
  });

  it('brand link points home and has an accessible name', () => {
    renderLayout();
    const brand = screen.getByRole('link', { name: /careconnect home/i });
    expect(brand).toHaveAttribute('href', '/');
  });
});
