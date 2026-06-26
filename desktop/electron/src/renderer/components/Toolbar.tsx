import React from 'react';
import { useAppStore } from '../store/store';

export default function Toolbar() {
  const currentScreen = useAppStore((s) => s.currentScreen);
  const searchQuery = useAppStore((s) => s.searchQuery);
  const setSearchQuery = useAppStore((s) => s.setSearchQuery);
  const setShowNewTask = useAppStore((s) => s.setShowNewTask);
  const darkMode = useAppStore((s) => s.darkMode);

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    calendar: 'Calendar',
    settings: 'Settings',
  };

  const bg = darkMode ? '#2C2C2E' : '#FFFFFF';
  const border = darkMode ? '#424242' : '#E0E0E0';
  const text = darkMode ? '#FFFFFF' : '#212121';
  const inputBg = darkMode ? '#1E1E1E' : '#F5F5F5';

  return (
    <header
      style={{
        height: 48,
        backgroundColor: bg,
        borderBottom: `1px solid ${border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        flexShrink: 0,
      }}
      role="toolbar"
      aria-label="Contextual toolbar"
    >
      <h1 style={{ fontSize: 18, fontWeight: 700, color: text, margin: 0, minWidth: 120 }}>
        {titles[currentScreen] ?? 'CareConnect'}
      </h1>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 400 }}>
        <input
          type="search"
          placeholder="Search tasks… (Ctrl+F)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search tasks"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: 6,
            border: `1px solid ${border}`,
            backgroundColor: inputBg,
            fontSize: 14,
            color: text,
            outline: 'none',
          }}
        />
      </div>

      {/* Contextual actions */}
      <div style={{ display: 'flex', gap: 8 }}>
        {currentScreen === 'tasks' && (
          <button
            onClick={() => setShowNewTask(true)}
            aria-label="Create new task (Ctrl+N)"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#1A5276',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span aria-hidden="true">+</span> New Task
          </button>
        )}
      </div>
    </header>
  );
}
