import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../state/providers.dart';

class AppShell extends ConsumerWidget {
  final StatefulNavigationShell navigationShell;

  const AppShell({super.key, required this.navigationShell});

  static const _primary = Color(0xFF1A5276);
  static const _accent = Color(0xFFD4AC0D); // highlight for active HC button

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
    final hc = settings.highContrast;

    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // ── Accessibility toolbar ────────────────────────────────────────
          Container(
            height: 56,
            color: _primary,
            child: Semantics(
              label: 'Accessibility toolbar',
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _ToolbarButton(
                    label: 'Decrease font size',
                    onTap: () =>
                        ref.read(settingsProvider.notifier).decreaseFontSize(),
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
                    onTap: () =>
                        ref.read(settingsProvider.notifier).increaseFontSize(),
                    child: const Text(
                      'A+',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                  // High-contrast toggle — visually highlighted when active
                  _ToolbarButton(
                    label: hc ? 'Disable high contrast' : 'Enable high contrast',
                    onTap: () =>
                        ref.read(settingsProvider.notifier).toggleHighContrast(),
                    isActive: hc,
                    child: Icon(
                      hc ? Icons.contrast : Icons.contrast_outlined,
                      // Gold when active so it's obviously "on"
                      color: hc ? _accent : Colors.white,
                      size: 26,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Bottom nav — always light, never follows dark theme ──────────
          NavigationBarTheme(
            data: NavigationBarThemeData(
              backgroundColor: Colors.white,
              indicatorColor: _primary.withValues(alpha: 0.14),
              labelTextStyle: WidgetStateProperty.resolveWith((states) {
                final selected = states.contains(WidgetState.selected);
                return TextStyle(
                  fontSize: 12,
                  fontWeight:
                      selected ? FontWeight.w700 : FontWeight.normal,
                  color: selected ? _primary : Colors.grey[600],
                );
              }),
              iconTheme: WidgetStateProperty.resolveWith((states) {
                final selected = states.contains(WidgetState.selected);
                return IconThemeData(
                  color: selected ? _primary : Colors.grey[600],
                );
              }),
            ),
            child: NavigationBar(
              selectedIndex: navigationShell.currentIndex,
              onDestinationSelected: (i) => navigationShell.goBranch(
                i,
                initialLocation: i == navigationShell.currentIndex,
              ),
              backgroundColor: Colors.white,
              surfaceTintColor: Colors.white,
              shadowColor: Colors.black12,
              indicatorColor: _primary.withValues(alpha: 0.14),
              labelBehavior:
                  NavigationDestinationLabelBehavior.onlyShowSelected,
              destinations: _destinations,
            ),
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
  final bool isActive;

  const _ToolbarButton({
    required this.label,
    required this.onTap,
    required this.child,
    this.isActive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      toggled: isActive,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Container(
          width: 64,
          height: 56,
          decoration: isActive
              ? BoxDecoration(
                  // Pill-shaped highlight so user knows HC is ON
                  color: Colors.white.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: const Color(0xFFD4AC0D), width: 1.5),
                )
              : null,
          child: Center(child: child),
        ),
      ),
    );
  }
}
