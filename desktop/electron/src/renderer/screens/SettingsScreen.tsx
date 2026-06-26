import React from 'react';
import { useAppStore } from '../store/store';

export default function SettingsScreen() {
  const fontSize = useAppStore((s) => s.fontSize);
  const highContrast = useAppStore((s) => s.highContrast);
  const darkMode = useAppStore((s) => s.darkMode);
  const increaseFontSize = useAppStore((s) => s.increaseFontSize);
  const decreaseFontSize = useAppStore((s) => s.decreaseFontSize);
  const toggleHighContrast = useAppStore((s) => s.toggleHighContrast);
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode);
  const signOut = useAppStore((s) => s.signOut);

  const cardBg = darkMode ? '#2C2C2E' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#212121';
  const textMuted = darkMode ? '#BDBDBD' : '#757575';
  const border = darkMode ? '#424242' : '#E0E0E0';
  const inputBg = darkMode ? '#1E1E1E' : '#F5F5F5';

  return (
    <div style={{ padding: 32, maxWidth: 700, overflow: 'auto', height: '100%' }}>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: text, margin: '0 0 24px' }}>Settings</h2>

      {/* Accessibility */}
      <SectionHeader label="ACCESSIBILITY" color={textMuted} />
      <div style={{ backgroundColor: cardBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
        {/* Font size */}
        <div style={{ display: 'flex', alignItems: 'center', padding: 16, borderBottom: `1px solid ${border}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>Font Size</div>
            <div style={{ fontSize: 13, color: textMuted }}>{fontSize}px</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={decreaseFontSize}
              aria-label="Decrease font size (Ctrl+-)"
              style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${border}`, backgroundColor: inputBg, cursor: 'pointer', fontSize: 16, fontWeight: 700, color: '#1A5276' }}
            >A−</button>
            <input
              type="range"
              min={12} max={32} step={2}
              value={fontSize}
              onChange={(e) => useAppStore.getState().setFontSize(parseInt(e.target.value))}
              aria-label={`Font size slider, current value ${fontSize}`}
              style={{ width: 120 }}
            />
            <button
              onClick={increaseFontSize}
              aria-label="Increase font size (Ctrl+=)"
              style={{ width: 40, height: 40, borderRadius: 8, border: `1px solid ${border}`, backgroundColor: inputBg, cursor: 'pointer', fontSize: 18, fontWeight: 700, color: '#1A5276' }}
            >A+</button>
          </div>
        </div>

        <ToggleRow label="High Contrast" subtitle="Bold text, thick borders, pure black/white (Ctrl+Shift+H)" checked={highContrast} onToggle={toggleHighContrast} text={text} textMuted={textMuted} border={border} />
        <ToggleRow label="Dark Mode" subtitle="Switch to dark colour scheme (Ctrl+Shift+D)" checked={darkMode} onToggle={toggleDarkMode} text={text} textMuted={textMuted} border={border} last />
      </div>

      {/* About */}
      <SectionHeader label="ABOUT" color={textMuted} />
      <div style={{ backgroundColor: cardBg, borderRadius: 12, border: `1px solid ${border}`, overflow: 'hidden' }}>
        <InfoRow label="App Version" value="1.0.0" text={text} textMuted={textMuted} border={border} />
        <InfoRow label="Platform" value="Electron (Desktop)" text={text} textMuted={textMuted} border={border} />
        <InfoRow label="Course" value="SWEN 661 · Team 2" text={text} textMuted={textMuted} border={border} last />
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        style={{
          marginTop: 32, width: '100%', padding: '14px 0', borderRadius: 8, border: 'none',
          backgroundColor: '#C0392B', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer',
        }}
        aria-label="Sign out of CareConnect"
      >
        Sign Out
      </button>
    </div>
  );
}

function SectionHeader({ label, color }: { label: string; color: string }) {
  return <h3 style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: 1, margin: '28px 0 8px' }}>{label}</h3>;
}

function ToggleRow({ label, subtitle, checked, onToggle, text, textMuted, border, last }: {
  label: string; subtitle: string; checked: boolean; onToggle: () => void;
  text: string; textMuted: string; border: string; last?: boolean;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 16, borderBottom: last ? 'none' : `1px solid ${border}` }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{label}</div>
        <div style={{ fontSize: 13, color: textMuted }}>{subtitle}</div>
      </div>
      <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-label={label}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: checked ? '#1A5276' : '#BDBDBD',
          borderRadius: 13, transition: 'background 0.2s',
        }} />
        <span style={{
          position: 'absolute', top: 2, left: checked ? 24 : 2,
          width: 22, height: 22, borderRadius: 11,
          backgroundColor: '#fff', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </label>
    </div>
  );
}

function InfoRow({ label, value, text, textMuted, border, last }: {
  label: string; value: string; text: string; textMuted: string; border: string; last?: boolean;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: last ? 'none' : `1px solid ${border}` }}
      aria-label={`${label}: ${value}`}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: text }}>{label}</span>
      <span style={{ fontSize: 14, color: textMuted }}>{value}</span>
    </div>
  );
}
