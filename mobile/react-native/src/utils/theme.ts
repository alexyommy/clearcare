// ─── CareConnect Design Tokens ────────────────────────────────────────────────
// Single source of truth for colors, spacing, typography, and touch targets.
// All screens MUST import from here — no hardcoded values elsewhere.

export const Colors = {
  // Brand
  primary: '#1A5276',
  primaryLight: '#2E86C1',
  primaryDark: '#154360',
  secondary: '#1E8449',
  secondaryLight: '#27AE60',
  // Semantic
  error: '#C0392B',
  warning: '#D68910',
  success: '#1E8449',
  info: '#2E86C1',
  // Neutral
  white: '#FFFFFF',
  black: '#000000',
  grey100: '#F5F5F5',
  grey200: '#EEEEEE',
  grey300: '#E0E0E0',
  grey400: '#BDBDBD',
  grey600: '#757575',
  grey800: '#424242',
  grey900: '#212121',
  // Surface
  background: '#F8FAFB',
  surface: '#FFFFFF',
  cardBg: '#FFFFFF',
  // High contrast
  hcBackground: '#000000',
  hcSurface: '#000000',
  hcText: '#FFFFFF',
  hcBorder: '#FFFFFF',
  // Priority
  priorityLow: '#27AE60',
  priorityMedium: '#D68910',
  priorityHigh: '#C0392B',
  // Category dot colors
  catMedication: '#8E44AD',
  catAppointment: '#2E86C1',
  catHygiene: '#17A589',
  catNutrition: '#D4AC0D',
  catTherapy: '#E74C3C',
  catMonitoring: '#1A5276',
  catOther: '#7F8C8D',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 32,
};

/** WCAG 2.1 AA minimum: 48×48dp. We use 60×60 for low-vision users. */
export const TouchTarget = {
  minSize: 60,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
};
