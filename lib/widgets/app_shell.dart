import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../state/providers.dart';

class AppShell extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const AppShell({super.key, required this.navigationShell});

  static const _destinations = [
    NavigationDestination(
      icon: Icon(Icons.dashboard_outlined),
      selectedIcon: Icon(Icons.dashboard),
      label: 'Dashboard',
    ),
    NavigationDestination(
      icon: Icon(Icons.task_outlined),
      selectedIcon: Icon(Icons.task),
      label: 'Tasks',
    ),
    NavigationDestination(
      icon: Icon(Icons.calendar_month_outlined),
      selectedIcon: Icon(Icons.calendar_month),
      label: 'Calendar',
    ),
    NavigationDestination(
      icon: Icon(Icons.person_outlined),
      selectedIcon: Icon(Icons.person),
      label: 'Profile',
    ),
    NavigationDestination(
      icon: Icon(Icons.settings_outlined),
      selectedIcon: Icon(Icons.settings),
      label: 'Settings',
    ),
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    const primary = Color(0xFF1A5276);

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Accessibility toolbar — persistent above nav bar
          Container(
            height: 56,
            color: primary,
            child: Semantics(
              label: 'Accessibility toolbar',
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ToolbarButton(
                    label: 'Decrease font size',
                    onTap: () => ref
                        .read(settingsProvider.notifier)
                        .decreaseFontSize(),
                    child: const Text(
                      'A−',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                  _ToolbarButton(
                    label: 'Increase font size',
                    onTap: () => ref
                        .read(settingsProvider.notifier)
                        .increaseFontSize(),
                    child: const Text(
                      'A+',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                  _ToolbarButton(
                    label: settings.highContrast
                        ? 'Disable high contrast'
                        : 'Enable high contrast',
                    onTap: () => ref
                        .read(settingsProvider.notifier)
                        .toggleHighContrast(),
                    child: Icon(
                      settings.highContrast
                          ? Icons.contrast
                          : Icons.contrast_outlined,
                      color: Colors.white,
                      size: 26,
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Bottom navigation bar
          NavigationBar(
            selectedIndex: navigationShell.currentIndex,
            onDestinationSelected: (i) => navigationShell.goBranch(
              i,
              initialLocation: i == navigationShell.currentIndex,
            ),
            backgroundColor: Colors.white,
            indicatorColor: primary.withValues(alpha: 0.14),
            labelBehavior:
                NavigationDestinationLabelBehavior.onlyShowSelected,
            destinations: _destinations,
          ),
        ],
      ),
    );
  }
}

class _ToolbarButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final Widget child;

  const _ToolbarButton({
    required this.label,
    required this.onTap,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: SizedBox(
          width: 64,
          height: 56,
          child: Center(child: child),
        ),
      ),
    );
  }
}
