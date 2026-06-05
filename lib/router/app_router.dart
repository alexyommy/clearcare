import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../screens/login_screen.dart';
import '../screens/dashboard_screen.dart';
import '../screens/task_list_screen.dart';
import '../screens/task_detail_screen.dart';
import '../screens/create_edit_task_screen.dart';
import '../screens/calendar_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/settings_screen.dart';
import '../widgets/app_shell.dart';
import '../state/providers.dart';
import '../state/auth_notifier.dart';

// ── Router notifier — bridges Riverpod auth state to GoRouter ─────────────────

class _RouterNotifier extends ChangeNotifier {
  final Ref _ref;

  _RouterNotifier(this._ref) {
    _ref.listen<AuthState>(authProvider, (prev, next) => notifyListeners());
  }

  String? redirect(BuildContext context, GoRouterState state) {
    final isLoggedIn = _ref.read(authProvider).isLoggedIn;
    final onLogin = state.matchedLocation == '/login';

    if (!isLoggedIn && !onLogin) return '/login';
    if (isLoggedIn && onLogin) return '/dashboard';
    return null;
  }
}

// ── Router provider ───────────────────────────────────────────────────────────

final routerProvider = Provider<GoRouter>((ref) {
  final notifier = _RouterNotifier(ref);

  return GoRouter(
    initialLocation: '/login',
    refreshListenable: notifier,
    redirect: notifier.redirect,
    routes: [
      // ── Public ─────────────────────────────────────────────────────────────
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),

      // ── Protected shell (bottom nav) ────────────────────────────────────────
      StatefulShellRoute.indexedStack(
        builder: (context, state, shell) => AppShell(navigationShell: shell),
        branches: [
          // Dashboard
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/dashboard',
              builder: (context, state) => const DashboardScreen(),
            ),
          ]),
          // Tasks (list → detail / create / edit)
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/tasks',
              builder: (context, state) => const TaskListScreen(),
              routes: [
                GoRoute(
                  path: 'new',
                  builder: (context, state) =>
                      const CreateEditTaskScreen(),
                ),
                GoRoute(
                  path: ':id',
                  builder: (context, state) => TaskDetailScreen(
                    taskId: state.pathParameters['id']!,
                  ),
                  routes: [
                    GoRoute(
                      path: 'edit',
                      builder: (context, state) => CreateEditTaskScreen(
                        taskId: state.pathParameters['id'],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ]),
          // Calendar
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/calendar',
              builder: (context, state) => const CalendarScreen(),
            ),
          ]),
          // Profile
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/profile',
              builder: (context, state) => const ProfileScreen(),
            ),
          ]),
          // Settings
          StatefulShellBranch(routes: [
            GoRoute(
              path: '/settings',
              builder: (context, state) => const SettingsScreen(),
            ),
          ]),
        ],
      ),
    ],
  );
});
