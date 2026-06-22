import { useSettings } from './useStore';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows } from '../utils/theme';

export function useAppTheme() {
  const { darkMode, highContrast, fontSize: baseFontSize } = useSettings();

  // Dynamic Colors
  const themeColors = {
    ...Colors,
    background: highContrast
      ? Colors.hcBackground
      : (darkMode ? '#121212' : Colors.background),
    surface: highContrast
      ? Colors.hcSurface
      : (darkMode ? '#1E1E1E' : Colors.surface),
    cardBg: highContrast
      ? Colors.hcSurface
      : (darkMode ? '#2C2C2E' : Colors.white),
    text: highContrast
      ? Colors.hcText
      : (darkMode ? Colors.white : Colors.grey900),
    textMuted: highContrast
      ? Colors.hcText
      : (darkMode ? Colors.grey400 : Colors.grey600),
    border: highContrast
      ? Colors.hcBorder
      : (darkMode ? Colors.grey800 : Colors.grey200),
    primary: highContrast ? '#FFFFFF' : Colors.primary,
  };

  // Dynamic Font Sizes (scaled by baseFontSize from store)
  // Store baseFontSize defaults to 18. We use it as the 'md' size.
  const scale = baseFontSize / 18;

  const themeFontSizes = {
    xs: Math.round(FontSizes.xs * scale),
    sm: Math.round(FontSizes.sm * scale),
    md: Math.round(FontSizes.md * scale),
    lg: Math.round(FontSizes.lg * scale),
    xl: Math.round(FontSizes.xl * scale),
    xxl: Math.round(FontSizes.xxl * scale),
    xxxl: Math.round(FontSizes.xxxl * scale),
    display: Math.round(FontSizes.display * scale),
  };

  return {
    colors: themeColors,
    fontSizes: themeFontSizes,
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    isDark: darkMode,
    isHighContrast: highContrast,
  };
}
