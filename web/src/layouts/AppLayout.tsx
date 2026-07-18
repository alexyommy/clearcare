import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/tasks', label: 'Tasks', icon: '✅' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

/**
 * App shell — semantic HTML5 structure:
 *   <header> banner with <nav> primary navigation
 *   <main> routed page content
 *   <footer> contentinfo
 * Mobile (≤640px): nav collapses behind a hamburger toggle.
 */
export default function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="app-header">
        <a href="/" className="brand" aria-label="CareConnect home">
          <span aria-hidden="true">♥</span> CareConnect
        </a>
        <button
          className="nav-toggle"
          aria-expanded={navOpen}
          aria-controls="primary-nav"
          aria-label={navOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setNavOpen((o) => !o)}
        >
          {navOpen ? '✕' : '☰'}
        </button>
        <nav
          id="primary-nav"
          className={`primary-nav${navOpen ? ' open' : ''}`}
          aria-label="Main navigation"
        >
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} onClick={() => setNavOpen(false)}>
                  <span aria-hidden="true">{item.icon}</span> {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        CareConnect · SWEN 661 UMGC Team 2 · Summer 2026
      </footer>
    </div>
  );
}
