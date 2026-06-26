import React, { useEffect, useRef } from 'react';
import { useAppStore } from '../store/store';

const SHORTCUTS = [
  { keys: 'Ctrl + N', action: 'New task' },
  { keys: 'Ctrl + S', action: 'Save' },
  { keys: 'Ctrl + F', action: 'Search' },
  { keys: 'Ctrl + ,', action: 'Open settings' },
  { keys: 'Ctrl + 1–4', action: 'Navigate between panels' },
  { keys: 'Tab / Shift+Tab', action: 'Move focus forward / backward' },
  { keys: 'Escape', action: 'Close dialog' },
  { keys: 'F1', action: 'Show keyboard shortcuts' },
  { keys: 'Ctrl + =', action: 'Increase font size' },
  { keys: 'Ctrl + -', action: 'Decrease font size' },
  { keys: 'Ctrl + Shift + H', action: 'Toggle high contrast' },
  { keys: 'Ctrl + Shift + D', action: 'Toggle dark mode' },
];

export default function ShortcutsDialog() {
  const show = useAppStore((s) => s.showShortcutsDialog);
  const setShow = useAppStore((s) => s.setShowShortcuts);
  const darkMode = useAppStore((s) => s.darkMode);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (show) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [show]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && show) {
        e.preventDefault();
        setShow(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [show, setShow]);

  if (!show) return null;

  const bg = darkMode ? '#2C2C2E' : '#FFFFFF';
  const text = darkMode ? '#FFFFFF' : '#212121';
  const border = darkMode ? '#424242' : '#E0E0E0';
  const kbdBg = darkMode ? '#424242' : '#F5F5F5';

  return (
    <dialog
      ref={dialogRef}
      aria-label="Keyboard shortcuts"
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: 32,
        maxWidth: 520,
        width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        zIndex: 1000,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Keyboard Shortcuts</h2>
        <button
          onClick={() => setShow(false)}
          aria-label="Close shortcuts dialog"
          style={{
            border: 'none',
            background: 'none',
            fontSize: 24,
            cursor: 'pointer',
            color: text,
            padding: 4,
          }}
        >
          ×
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: `2px solid ${border}`, fontSize: 13, color: darkMode ? '#BDBDBD' : '#757575' }}>Shortcut</th>
            <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: `2px solid ${border}`, fontSize: 13, color: darkMode ? '#BDBDBD' : '#757575' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {SHORTCUTS.map(({ keys, action }) => (
            <tr key={keys}>
              <td style={{ padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <kbd style={{
                  backgroundColor: kbdBg,
                  border: `1px solid ${border}`,
                  borderRadius: 4,
                  padding: '3px 8px',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  fontWeight: 600,
                }}>{keys}</kbd>
              </td>
              <td style={{ padding: '10px 0', borderBottom: `1px solid ${border}`, fontSize: 14 }}>{action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </dialog>
  );
}
