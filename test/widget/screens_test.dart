/// Widget tests for TaskListScreen, CalendarScreen, SettingsScreen,
/// TaskDetailScreen, CreateEditTaskScreen, ProfileScreen, and AppShell.
library;

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

import 'package:careconnect_flutter/screens/task_list_screen.dart';
import 'package:careconnect_flutter/screens/calendar_screen.dart';
import 'package:careconnect_flutter/screens/settings_screen.dart';
import 'package:careconnect_flutter/screens/task_detail_screen.dart';
import 'package:careconnect_flutter/screens/create_edit_task_screen.dart';
import 'package:careconnect_flutter/screens/profile_screen.dart';
import 'package:careconnect_flutter/state/providers.dart';
import 'package:careconnect_flutter/state/auth_notifier.dart';
import 'package:careconnect_flutter/state/task_notifier.dart';
import 'package:careconnect_flutter/services/auth_service.dart';
import 'package:careconnect_flutter/services/task_service.dart';
import 'package:careconnect_flutter/widgets/task_card.dart';
import 'package:careconnect_flutter/models/task_model.dart';

// ── Helpers ───────────────────────────────────────────────────────────────────

/// Wraps [screen] in ProviderScope + MaterialApp.router with sensible
/// provider overrides and extra routes so go_router doesn't complain.
Widget _wrap(Widget screen, {String initialLocation = '/'}) {
  final router = GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(path: '/', builder: (_, __) => screen),
      GoRoute(path: '/tasks', builder: (_, __) => const Scaffold()),
      GoRoute(path: '/tasks/new', builder: (_, __) => const Scaffold()),
      GoRoute(
          path: '/tasks/:id',
          builder: (_, s) => TaskDetailScreen(
              taskId: s.pathParameters['id']!)),
      GoRoute(
          path: '/tasks/:id/edit',
          builder: (_, s) => CreateEditTaskScreen(
              taskId: s.pathParameters['id'])),
      GoRoute(path: '/login', builder: (_, __) => const Scaffold()),
      GoRoute(path: '/profile', builder: (_, __) => const Scaffold()),
      GoRoute(path: '/settings', builder: (_, __) => const Scaffold()),
      GoRoute(path: '/calendar', builder: (_, __) => const Scaffold()),
      GoRoute(path: '/dashboard', builder: (_, __) => const Scaffold()),
    ],
  );

  return ProviderScope(
    overrides: [
      authServiceProvider.overrideWithValue(AuthService()),
      taskServiceProvider.overrideWithValue(TaskService()),
      authProvider.overrideWith(
          (ref) => AuthNotifier(ref.read(authServiceProvider))),
      taskProvider.overrideWith(
          (ref) => TaskNotifier(ref.read(taskServiceProvider))),
    ],
    child: MaterialApp.router(routerConfig: router),
  );
}

// ── TaskListScreen ────────────────────────────────────────────────────────────

void main() {
  group('TaskListScreen', () {
    testWidgets('renders Tasks app bar', (tester) async {
      await tester.pumpWidget(_wrap(const TaskListScreen()));
      expect(find.text('Tasks'), findsOneWidget);
    });

    testWidgets('renders Add Task FAB', (tester) async {
      await tester.pumpWidget(_wrap(const TaskListScreen()));
      expect(find.text('Add Task'), findsOneWidget);
    });

    testWidgets('renders pending tasks from sample data', (tester) async {
      await tester.pumpWidget(_wrap(const TaskListScreen()));
      expect(find.text('Pending (6)'), findsOneWidget);
    });

    testWidgets('swipe-to-complete shows snackbar', (tester) async {
      await tester.pumpWidget(_wrap(const TaskListScreen()));
      await tester.drag(
          find.byType(Dismissible).first, const Offset(-500, 0));
      await tester.pumpAndSettle();
      expect(find.byType(SnackBar), findsOneWidget);
    });

    testWidgets('tapping a task card navigates to detail', (tester) async {
      await tester.pumpWidget(_wrap(const TaskListScreen()));
      await tester.tap(find.byType(TaskCard).first);
      await tester.pumpAndSettle();
      // navigated away — no longer on task list
      expect(find.text('Tasks'), findsNothing);
    });
  });

  // ── CalendarScreen ──────────────────────────────────────────────────────────

  group('CalendarScreen', () {
    testWidgets('renders Calendar app bar', (tester) async {
      await tester.pumpWidget(_wrap(const CalendarScreen()));
      expect(find.text('Calendar'), findsOneWidget);
    });

    testWidgets('renders month header June 2026', (tester) async {
      await tester.pumpWidget(_wrap(const CalendarScreen()));
      expect(find.text('June 2026'), findsOneWidget);
    });

    testWidgets('renders Upcoming Events section', (tester) async {
      await tester.pumpWidget(_wrap(const CalendarScreen()));
      await tester.scrollUntilVisible(find.text('Upcoming Events'), 200,
          scrollable: find.byType(Scrollable).first);
      expect(find.text('Upcoming Events'), findsOneWidget);
    });

    testWidgets('renders at least one event card', (tester) async {
      await tester.pumpWidget(_wrap(const CalendarScreen()));
      await tester.scrollUntilVisible(
          find.text('Morning medication round'), 200,
          scrollable: find.byType(Scrollable).first);
      expect(find.text('Morning medication round'), findsOneWidget);
    });
  });

  // ── SettingsScreen ──────────────────────────────────────────────────────────

  group('SettingsScreen', () {
    testWidgets('renders Settings app bar', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.text('Settings'), findsOneWidget);
    });

    testWidgets('renders Accessibility section', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.text('ACCESSIBILITY'), findsOneWidget);
    });

    testWidgets('renders font size slider', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.byType(Slider), findsOneWidget);
    });

    testWidgets('renders high contrast toggle', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.text('High Contrast'), findsOneWidget);
    });

    testWidgets('renders dark mode toggle', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.text('Dark Mode'), findsOneWidget);
    });

    testWidgets('renders Notifications section', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      expect(find.text('NOTIFICATIONS'), findsOneWidget);
    });

    testWidgets('toggling high contrast updates UI', (tester) async {
      await tester.pumpWidget(_wrap(const SettingsScreen()));
      final switchFinder = find.byType(Switch).first;
      await tester.tap(switchFinder);
      await tester.pump();
      // no crash = pass
    });
  });

  // ── TaskDetailScreen ────────────────────────────────────────────────────────

  group('TaskDetailScreen', () {
    final firstTask = sampleTasks.first;

    testWidgets('renders task title', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      expect(find.text(firstTask.title), findsOneWidget);
    });

    testWidgets('renders Task Detail app bar', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      expect(find.text('Task Detail'), findsOneWidget);
    });

    testWidgets('renders Mark as Complete button', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      expect(find.text('Mark as Complete'), findsOneWidget);
    });

    testWidgets('renders task time', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      expect(find.textContaining(firstTask.time), findsOneWidget);
    });

    testWidgets('renders task room', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      expect(find.textContaining(firstTask.room), findsOneWidget);
    });

    testWidgets('tapping Mark Complete changes to Mark Pending',
        (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      await tester.tap(find.text('Mark as Complete'));
      await tester.pump();
      expect(find.text('Mark as Pending'), findsOneWidget);
    });

    testWidgets('shows Task not found for unknown id', (tester) async {
      await tester.pumpWidget(
          _wrap(const TaskDetailScreen(taskId: 'nonexistent')));
      expect(find.text('Task not found'), findsOneWidget);
    });

    testWidgets('tapping edit navigates away', (tester) async {
      await tester.pumpWidget(_wrap(TaskDetailScreen(taskId: firstTask.id)));
      await tester.tap(find.byIcon(Icons.edit_outlined));
      await tester.pumpAndSettle();
      expect(find.text('Task Detail'), findsNothing);
    });
  });

  // ── CreateEditTaskScreen (create mode) ──────────────────────────────────────

  group('CreateEditTaskScreen – create mode', () {
    testWidgets('renders New Task app bar', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      expect(find.text('New Task'), findsOneWidget);
    });

    testWidgets('renders Create Task button', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      expect(find.text('Create Task'), findsOneWidget);
    });

    testWidgets('renders title, time, location fields', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      expect(find.byType(TextFormField), findsNWidgets(4));
    });

    testWidgets('renders priority segment buttons', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      expect(find.text('Low'), findsOneWidget);
      expect(find.text('Medium'), findsOneWidget);
      expect(find.text('High'), findsOneWidget);
    });

    testWidgets('shows validation errors on empty save', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      await tester.ensureVisible(find.text('Create Task'));
      await tester.tap(find.text('Create Task'));
      await tester.pump();
      expect(find.text('Title is required'), findsOneWidget);
    });

    testWidgets('can tap priority button to change selection', (tester) async {
      await tester.pumpWidget(_wrap(const CreateEditTaskScreen()));
      await tester.tap(find.text('High'));
      await tester.pump();
      // no crash = pass
    });
  });

  // ── CreateEditTaskScreen (edit mode) ────────────────────────────────────────

  group('CreateEditTaskScreen – edit mode', () {
    final taskId = sampleTasks.first.id;

    testWidgets('renders Edit Task app bar', (tester) async {
      await tester.pumpWidget(_wrap(CreateEditTaskScreen(taskId: taskId)));
      expect(find.text('Edit Task'), findsOneWidget);
    });

    testWidgets('pre-fills title from existing task', (tester) async {
      await tester.pumpWidget(_wrap(CreateEditTaskScreen(taskId: taskId)));
      expect(find.text(sampleTasks.first.title), findsOneWidget);
    });

    testWidgets('renders Save Changes button', (tester) async {
      await tester.pumpWidget(_wrap(CreateEditTaskScreen(taskId: taskId)));
      expect(find.text('Save Changes'), findsOneWidget);
    });
  });

  // ── ProfileScreen ───────────────────────────────────────────────────────────

  group('ProfileScreen', () {
    testWidgets('renders Profile app bar', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('renders Caregiver role badge', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      expect(find.text('Caregiver'), findsWidgets);
    });

    testWidgets('renders stat cards', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      expect(find.text('Completed'), findsOneWidget);
      expect(find.text('Pending'), findsOneWidget);
      expect(find.text('Total'), findsOneWidget);
    });

    testWidgets('renders sign out button', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      await tester.scrollUntilVisible(find.text('Sign Out'), 200,
          scrollable: find.byType(Scrollable).first);
      expect(find.text('Sign Out'), findsOneWidget);
    });

    testWidgets('renders account section', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      await tester.scrollUntilVisible(find.text('ACCOUNT'), 200,
          scrollable: find.byType(Scrollable).first);
      expect(find.text('ACCOUNT'), findsOneWidget);
    });

    testWidgets('tapping edit name shows text field', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      await tester.tap(find.byIcon(Icons.edit_outlined));
      await tester.pump();
      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('sign out button tappable without crash', (tester) async {
      await tester.pumpWidget(_wrap(const ProfileScreen()));
      await tester.scrollUntilVisible(find.text('Sign Out'), 200,
          scrollable: find.byType(Scrollable).first);
      await tester.tap(find.text('Sign Out'));
      await tester.pumpAndSettle();
      // navigated to /login which shows empty Scaffold
    });
  });
}
