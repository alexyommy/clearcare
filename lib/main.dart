import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'models/app_state.dart';
import 'screens/dashboard_screen.dart';
import 'screens/task_list_screen.dart';
import 'screens/calendar_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  runApp(const CareConnectApp());
}

class CareConnectApp extends StatefulWidget {
  const CareConnectApp({super.key});

  @override
  State<CareConnectApp> createState() => _CareConnectState();
}

class _CareConnectState extends State<CareConnectApp> {
  final AppState _appState = AppState();

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _appState,
      builder: (context, child) {
        return MaterialApp(
          title: 'CareConnect',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF1A5276),
              primary: const Color(0xFF1A5276),
              secondary: const Color(0xFF1E8449),
              error: const Color(0xFFC0392B),
              surface: const Color(0xFFFFFFFF),
            ),
            textTheme: GoogleFonts.robotoTextTheme().copyWith(
              bodyMedium: GoogleFonts.roboto(fontSize: _appState.fontSize),
              bodyLarge: GoogleFonts.roboto(fontSize: _appState.fontSize + 2),
            ),
            useMaterial3: true,
          ),
          darkTheme: ThemeData(
            brightness: Brightness.dark,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF1A5276),
              brightness: Brightness.dark,
              surface: const Color(0xFF121212),
            ),
            textTheme: GoogleFonts.robotoTextTheme(ThemeData.dark().textTheme),
            useMaterial3: true,
          ),
          themeMode: _appState.darkMode ? ThemeMode.dark : ThemeMode.light,
          home: MainShell(appState: _appState),
        );
      },
    );
  }
}

class MainShell extends StatefulWidget {
  final AppState appState;

  const MainShell({super.key, required this.appState});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      DashboardScreen(appState: widget.appState),
      TaskListScreen(appState: widget.appState),
      CalendarScreen(appState: widget.appState),
      SettingsScreen(appState: widget.appState),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFF1A5276).withValues(alpha: 0.15),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_outlined),
            selectedIcon: Icon(Icons.dashboard, color: Color(0xFF1A5276)),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.task_outlined),
            selectedIcon: Icon(Icons.task, color: Color(0xFF1A5276)),
            label: 'Tasks',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_month_outlined),
            selectedIcon: Icon(Icons.calendar_month, color: Color(0xFF1A5276)),
            label: 'Calendar',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings, color: Color(0xFF1A5276)),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
