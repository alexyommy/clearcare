import React from 'react';
import { useAppStore } from '../store/store';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', shortcut: '⌘1' },
  { id: 'tasks', label: 'Tasks', icon: '✅', shortcut: '⌘2' },
  { id: 'calendar', label: 'Calendar', icon: '📅', shortcut: '⌘3' },
  { id: 'settings', label: 'Settings', icon: '⚙️', shortcut: '⌘4' },
];

export default function Sidebar() {
  const currentScreen = useAppStore((s) => s.currentScreen);
  const setScreen = useAppStore((s) => s.setScreen);
  const user = useAppStore((s) => s.user);
  const darkMode = useAppStore((s) => s.darkMode);

  const bg = darkMode ? '#1E1E1E' : '#1A5276';

  return (
    <nav
      style={{
        width: 240,
        backgroundColor: bg,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        color: '#fff',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px' }}>CareConnect</div>
        <div style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Desktop</div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {NAV_ITEMS.map((item) => {
          const active = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setScreen(item.id)}
              aria-current={active ? 'page' : undefined}
              aria-label={`${item.label} (${item.shortcut})`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 15,
                fontWeight: active ? 700 : 400,
                color: '#fff',
                backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                textAlign: 'left',
                width: '100%',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: 11, opacity: 0.5 }}>{item.shortcut}</span>
            </button>
          );
        })}
      </div>

      {/* User footer */}
      {user && (
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
            }}
            aria-hidden="true"
          >
            {user.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Caregiver</div>
          </div>
        </div>
      )}
    </nav>
  );
}
