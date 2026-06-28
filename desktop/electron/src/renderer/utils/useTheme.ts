import { useAppStore } from '../store/store';

export function useTheme() {
  const fontSize = useAppStore((s) => s.fontSize);
  const darkMode = useAppStore((s) => s.darkMode);
  const highContrast = useAppStore((s) => s.highContrast);

  const scale = fontSize / 16;

  const fs = {
    xs: Math.round(12 * scale),
    sm: Math.round(14 * scale),
    md: Math.round(16 * scale),
    lg: Math.round(18 * scale),
    xl: Math.round(20 * scale),
    xxl: Math.round(24 * scale),
    xxxl: Math.round(28 * scale),
    display: Math.round(32 * scale),
  };

  const colors = {
    primary: highContrast ? '#FFFFFF' : '#1A5276',
    primaryLight: '#2E86C1',
    secondary: '#1E8449',
    error: '#C0392B',
    warning: '#D68910',
    bg: highContrast ? '#000000' : darkMode ? '#121212' : '#F8FAFB',
    surface: highContrast ? '#000000' : darkMode ? '#1E1E1E' : '#FFFFFF',
    cardBg: highContrast ? '#000000' : darkMode ? '#2C2C2E' : '#FFFFFF',
    text: highContrast ? '#FFFFFF' : darkMode ? '#FFFFFF' : '#212121',
    textMuted: highContrast ? '#FFFFFF' : darkMode ? '#BDBDBD' : '#757575',
    border: highContrast ? '#FFFFFF' : darkMode ? '#424242' : '#E0E0E0',
    inputBg: highContrast ? '#000000' : darkMode ? '#1E1E1E' : '#F5F5F5',
  };

  return { fs, colors, darkMode, highContrast, scale, fontSize };
}
