import React, { useEffect } from 'react';
import { useAppStore } from './store/store';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ShortcutsDialog from './components/ShortcutsDialog';
import DashboardScreen from './screens/DashboardScreen';
import TasksScreen from './screens/TasksScreen';
import CalendarScreen from './screens/CalendarScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';

declare global {
  interface Window {
    electronAPI?: {
      onNavigate: (cb: (route: string) => void) => void;
      onMenuAction: (cb: (action: string) => void) => void;
    };
  }
}

export default function App() {
  const user = useAppStore((s) => s.user);
  const currentScreen = useAppStore((s) => s.currentScreen);
  const setScreen = useAppStore((s) => s.setScreen);
  const darkMode = useAppStore((s) => s.darkMode);
  const highContrast = useAppStore((s) => s.highContrast);
  const fontSize = useAppStore((s) => s.fontSize);

  // Listen for menu bar navigation and actions from main process
  useEffect(() => {
    window.electronAPI?.onNavigate((route) => {
      useAppStore.getState().setScreen(route);
    });
    window.electronAPI?.onMenuAction((action) => {
      const store = useAppStore.getState();
      switch (action) {
        case 'new-task': store.setShowNewTask(true); store.setScreen('tasks'); break;
        case 'save': break; // placeholder
        case 'search': document.querySelector<HTMLInputElement>('input[type="search"]')?.focus(); break;
        case 'font-increase': store.increaseFontSize(); break;
        case 'font-decrease': store.decreaseFontSize(); break;
        case 'toggle-contrast': store.toggleHighContrast(); break;
        case 'toggle-dark': store.toggleDarkMode(); break;
        case 'show-shortcuts': store.setShowShortcuts(true); break;
        case 'show-about': break; // placeholder
      }
    });
  }, []);

  // Apply dynamic font size and theme to body
  useEffect(() => {
    document.documentElement.style.setProperty('--font-base', `${fontSize}px`);
    document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.body.style.backgroundColor = '#000';
      document.body.style.color = '#fff';
    } else if (darkMode) {
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#fff';
    } else {
      document.body.style.backgroundColor = '#F8FAFB';
      document.body.style.color = '#212121';
    }
  }, [darkMode, highContrast]);

  if (!user) return <LoginScreen />;

  const screens: Record<string, React.ReactNode> = {
    dashboard: <DashboardScreen />,
    tasks: <TasksScreen />,
    calendar: <CalendarScreen />,
    settings: <SettingsScreen />,
  };

  return (
    <>
      <div style={{ display: 'flex', flex: 1, height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Toolbar />
          <main style={{ flex: 1, overflow: 'auto' }} role="main">
            {screens[currentScreen] ?? <DashboardScreen />}
          </main>
        </div>
      </div>
      <ShortcutsDialog />
    </>
  );
}
