import { useEffect } from 'react';
import { useAppStore } from '../store/store';

export default function SettingsPage() {
  const fontScale = useAppStore((s) => s.fontScale);
  const setFontScale = useAppStore((s) => s.setFontScale);
  const highContrast = useAppStore((s) => s.highContrast);
  const toggleHighContrast = useAppStore((s) => s.toggleHighContrast);

  // Apply settings globally
  useEffect(() => {
    document.documentElement.style.setProperty('--font-base', `${16 * fontScale}px`);
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  return (
    <section aria-labelledby="settings-heading">
      <h1 id="settings-heading" className="page-title">Settings</h1>

      <h2 className="section-title">Accessibility</h2>
      <div className="settings-card">
        <div className="settings-row">
          <div>
            <div className="settings-label">Font Size</div>
            <div className="settings-sub">{Math.round(fontScale * 100)}%</div>
          </div>
          <div className="settings-controls">
            <button
              className="btn-secondary"
              onClick={() => setFontScale(fontScale - 0.25)}
              aria-label="Decrease font size"
            >
              A−
            </button>
            <label htmlFor="font-slider" className="visually-hidden">Font size scale</label>
            <input
              id="font-slider"
              type="range"
              min={0.75}
              max={2}
              step={0.25}
              value={fontScale}
              onChange={(e) => setFontScale(parseFloat(e.target.value))}
              aria-valuetext={`${Math.round(fontScale * 100)} percent`}
            />
            <button
              className="btn-secondary"
              onClick={() => setFontScale(fontScale + 0.25)}
              aria-label="Increase font size"
            >
              A+
            </button>
          </div>
        </div>

        <div className="settings-row">
          <div>
            <div className="settings-label">High Contrast</div>
            <div className="settings-sub">Pure black/white with bold borders</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              role="switch"
              checked={highContrast}
              onChange={toggleHighContrast}
              aria-label="High contrast mode"
            />
            <span className="switch-track" aria-hidden="true" />
          </label>
        </div>
      </div>

      <h2 className="section-title">About</h2>
      <div className="settings-card">
        <div className="settings-row">
          <span className="settings-label">App Version</span>
          <span className="settings-sub">1.0.0</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Platform</span>
          <span className="settings-sub">Web (React + Vite PWA)</span>
        </div>
        <div className="settings-row">
          <span className="settings-label">Course</span>
          <span className="settings-sub">SWEN 661 · Team 2</span>
        </div>
      </div>
    </section>
  );
}
