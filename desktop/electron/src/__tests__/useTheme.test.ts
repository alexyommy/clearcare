import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useTheme } from '../renderer/utils/useTheme';
import { useAppStore } from '../renderer/store/store';

beforeEach(() => {
  useAppStore.setState({ fontSize: 16, darkMode: false, highContrast: false });
});

describe('useTheme', () => {
  it('returns fs object with scaled values at default 16px', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.fs.md).toBe(16);
    expect(result.current.fs.sm).toBe(14);
    expect(result.current.fs.xs).toBe(12);
    expect(result.current.fs.lg).toBe(18);
    expect(result.current.fs.xxl).toBe(24);
  });

  it('scales up proportionally at 24px', () => {
    useAppStore.setState({ fontSize: 24 });
    const { result } = renderHook(() => useTheme());
    const scale = 24 / 16;
    expect(result.current.fs.md).toBe(Math.round(16 * scale));
    expect(result.current.fs.xxl).toBe(Math.round(24 * scale));
  });

  it('returns scale = fontSize / 16', () => {
    useAppStore.setState({ fontSize: 32 });
    const { result } = renderHook(() => useTheme());
    expect(result.current.scale).toBe(2);
  });

  it('returns light colors by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.darkMode).toBe(false);
    expect(result.current.colors.bg).toBe('#F8FAFB');
  });

  it('returns dark background when darkMode is on', () => {
    useAppStore.setState({ darkMode: true });
    const { result } = renderHook(() => useTheme());
    expect(result.current.darkMode).toBe(true);
    expect(result.current.colors.bg).not.toBe('#F8FAFB');
  });

  it('highContrast flag is reflected in return value', () => {
    useAppStore.setState({ highContrast: true });
    const { result } = renderHook(() => useTheme());
    expect(result.current.highContrast).toBe(true);
  });

  it('updates reactively when fontSize changes in store', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.fs.md).toBe(16);
    act(() => { useAppStore.setState({ fontSize: 20 }); });
    expect(result.current.fs.md).toBe(20);
  });
});
