import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect_flutter/screens/dashboard_screen.dart';
import 'package:careconnect_flutter/widgets/task_card.dart';
import 'package:careconnect_flutter/state/providers.dart';
import 'package:careconnect_flutter/state/auth_notifier.dart';
import 'package:careconnect_flutter/state/task_notifier.dart';
import 'package:careconnect_flutter/services/auth_service.dart';
import 'package:careconnect_flutter/services/task_service.dart';
import 'package:careconnect_flutter/models/task_model.dart';

Widget _buildDashboard() {
  final router = GoRouter(
    initialLocation: '/dashboard',
    routes: [
      GoRoute(
          path: '/dashboard',
          builder: (_, __) => const DashboardScreen()),
      GoRoute(
          path: '/tasks',
          builder: (_, __) => const Scaffold(body: Text('Tasks'))),
      GoRoute(
          path: '/tasks/:id',
          builder: (_, s) => Scaffold(body: Text('Detail ${s.pathParameters['id']}'))),
      GoRoute(
          path: '/calendar',
          builder: (_, __) => const Scaffold(body: Text('Cal'))),
      GoRoute(
          path: '/profile',
          builder: (_, __) => const Scaffold(body: Text('Profile'))),
    ],
  );

  return ProviderScope(
    overrides: [
      authServiceProvider.overrideWithValue(AuthService()),
      taskServiceProvider.overrideWithValue(TaskService()),
      authProvider.overrideWith((ref) {
        final notifier = AuthNotifier(ref.read(authServiceProvider));
        return notifier;
      }),
      taskProvider.overrideWith(
          (ref) => TaskNotifier(ref.read(taskServiceProvider))),
    ],
    child: MaterialApp.router(routerConfig: router),
  );
}

void main() {
  testWidgets('renders CareConnect app bar', (tester) async {
    await tester.pumpWidget(_buildDashboard());
    expect(find.text('CareConnect'), findsOneWidget);
  });

  testWidgets('shows stat cards for Pending, Completed, Total',
      (tester) async {
    await tester.pumpWidget(_buildDashboard());
    expect(find.text('Pending'), findsOneWidget);
    expect(find.text('Completed'), findsOneWidget);
    expect(find.text('Total'), findsOneWidget);
  });

  testWidgets("shows Today's Tasks section", (tester) async {
    await tester.pumpWidget(_buildDashboard());
    expect(find.text("Today's Tasks"), findsOneWidget);
  });

  testWidgets('shows View all button', (tester) async {
    await tester.pumpWidget(_buildDashboard());
    expect(find.text('View all'), findsOneWidget);
  });

  testWidgets('shows Quick Access section', (tester) async {
    await tester.pumpWidget(_buildDashboard());
    await tester.scrollUntilVisible(
        find.text('Quick Access'), 200,
        scrollable: find.byType(Scrollable).first);
    expect(find.text('Quick Access'), findsOneWidget);
  });

  testWidgets('task cards render for pending tasks', (tester) async {
    await tester.pumpWidget(_buildDashboard());
    // Sample data has 6 tasks; dashboard shows up to 3 TaskCards
    expect(find.byType(TaskCard), findsWidgets);
  });

  testWidgets('greets caregiver with time-of-day message', (tester) async {
    await tester.pumpWidget(_buildDashboard());
    final textFinder = find.textContaining(RegExp(r'Good (morning|afternoon|evening)'));
    expect(textFinder, findsOneWidget);
  });

  testWidgets('shows "All tasks complete!" when no pending tasks',
      (tester) async {
    final service = TaskService();
    // Mark all complete
    for (final t in service.getTasks()) {
      service.updateTask(t.copyWith(isCompleted: true));
    }
    final router = GoRouter(
      initialLocation: '/dashboard',
      routes: [
        GoRoute(
            path: '/dashboard', builder: (_, __) => const DashboardScreen()),
        GoRoute(path: '/tasks', builder: (_, __) => const Scaffold()),
        GoRoute(path: '/calendar', builder: (_, __) => const Scaffold()),
        GoRoute(path: '/profile', builder: (_, __) => const Scaffold()),
        GoRoute(path: '/tasks/:id', builder: (_, __) => const Scaffold()),
      ],
    );
    await tester.pumpWidget(ProviderScope(
      overrides: [
        authServiceProvider.overrideWithValue(AuthService()),
        taskServiceProvider.overrideWithValue(service),
        authProvider.overrideWith(
            (ref) => AuthNotifier(ref.read(authServiceProvider))),
        taskProvider.overrideWith(
            (ref) => TaskNotifier(ref.read(taskServiceProvider))),
      ],
      child: MaterialApp.router(routerConfig: router),
    ));
    expect(find.text('All tasks complete!'), findsOneWidget);
  });
}
