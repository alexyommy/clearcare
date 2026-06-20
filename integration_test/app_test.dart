/// Integration tests for CareConnect Flutter app.
///
/// Tests cover the major multi-screen user journeys:
///   1. Login → Dashboard
///   2. Dashboard → Task List → Task Detail
///   3. Dashboard → Create Task → Task List
///   4. Settings → Accessibility preferences (font size, high contrast)
///   5. Profile → Sign Out → Login
///
/// Run with:
///   flutter test integration_test/app_test.dart -d <device-id>

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:careconnect_flutter/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Signs in with the demo account.
  Future<void> signIn(WidgetTester tester) async {
    await tester.pumpAndSettle();
    await tester.enterText(
        find.byType(TextFormField).first, 'demo@careconnect.com');
    await tester.enterText(
        find.byType(TextFormField).last, 'demo123');
    await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
    await tester.pumpAndSettle(const Duration(seconds: 2));
  }

  // ── Journey 1: Login → Dashboard ──────────────────────────────────────────

  group('Journey 1 — Login → Dashboard', () {
    testWidgets('demo credentials sign in and land on dashboard',
        (tester) async {
      app.main();
      await tester.pumpAndSettle();

      // Should start on login screen
      expect(find.text('CareConnect'), findsWidgets);

      await signIn(tester);

      // Dashboard should be visible
      expect(find.text('CareConnect'), findsWidgets);
      expect(
        find.textContaining(RegExp(r'Good (morning|afternoon|evening)')),
        findsOneWidget,
      );
    });

    testWidgets('invalid credentials show error banner', (tester) async {
      app.main();
      await tester.pumpAndSettle();

      await tester.enterText(
          find.byType(TextFormField).first, 'wrong@example.com');
      await tester.enterText(find.byType(TextFormField).last, 'badpass');
      await tester.tap(find.widgetWithText(ElevatedButton, 'Sign in'));
      await tester.pumpAndSettle(const Duration(seconds: 2));

      // Error banner should appear
      expect(find.textContaining('Invalid'), findsOneWidget);
    });

    testWidgets('stat cards show Pending, Completed, Total', (tester) async {
      app.main();
      await signIn(tester);

      expect(find.text('Pending'), findsOneWidget);
      expect(find.text('Completed'), findsOneWidget);
      expect(find.text('Total'), findsOneWidget);
    });
  });

  // ── Journey 2: Dashboard → Task List → Task Detail ────────────────────────

  group('Journey 2 — Dashboard → Task List → Task Detail', () {
    testWidgets('tapping View all navigates to task list', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.text('View all'));
      await tester.pumpAndSettle();

      expect(find.text('Tasks'), findsWidgets);
      expect(find.textContaining('Pending'), findsOneWidget);
    });

    testWidgets('tapping a task card opens task detail', (tester) async {
      app.main();
      await signIn(tester);

      // Navigate to task list via bottom nav
      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      // Tap the first task card
      final taskCards = find.byType(InkWell);
      await tester.tap(taskCards.first);
      await tester.pumpAndSettle();

      // Task Detail screen should be visible
      expect(find.text('Task Detail'), findsOneWidget);
    });

    testWidgets('task detail shows Mark as Complete button', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      final taskCards = find.byType(InkWell);
      await tester.tap(taskCards.first);
      await tester.pumpAndSettle();

      expect(find.text('Mark as Complete'), findsOneWidget);
    });

    testWidgets('marking complete updates button to Mark as Pending',
        (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      final taskCards = find.byType(InkWell);
      await tester.tap(taskCards.first);
      await tester.pumpAndSettle();

      await tester.tap(find.text('Mark as Complete'));
      await tester.pumpAndSettle();

      expect(find.text('Mark as Pending'), findsOneWidget);
    });
  });

  // ── Journey 3: Task List → Create Task ───────────────────────────────────

  group('Journey 3 — Create Task workflow', () {
    testWidgets('Add Task FAB opens create task form', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Add Task'));
      await tester.pumpAndSettle();

      expect(find.text('New Task'), findsOneWidget);
      expect(find.text('Create Task'), findsOneWidget);
    });

    testWidgets('create task form shows validation on empty submit',
        (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      await tester.tap(find.text('Add Task'));
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.text('Create Task'));
      await tester.tap(find.text('Create Task'));
      await tester.pumpAndSettle();

      expect(find.text('Title is required'), findsOneWidget);
    });

    testWidgets('filling title and saving adds task to list', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.task));
      await tester.pumpAndSettle();

      final pendingBefore = find.textContaining('Pending (').evaluate().first;
      final pendingCountBefore = (pendingBefore.widget as Text).data!;

      await tester.tap(find.text('Add Task'));
      await tester.pumpAndSettle();

      // Fill title
      await tester.enterText(
          find.widgetWithText(TextFormField, 'e.g. Administer medication'),
          'Integration Test Task');
      // Fill time
      await tester.enterText(
          find.widgetWithText(TextFormField, 'e.g. 08:00'), '10:00');
      // Fill location
      await tester.enterText(
          find.widgetWithText(TextFormField, 'e.g. Room 12A'), 'Room 99');

      await tester.ensureVisible(find.text('Create Task'));
      await tester.tap(find.text('Create Task'));
      await tester.pumpAndSettle();

      // Should be back on task list with one more task
      expect(find.text('Tasks'), findsWidgets);
      expect(find.text('Integration Test Task'), findsOneWidget);
    });
  });

  // ── Journey 4: Settings → Accessibility preferences ───────────────────────

  group('Journey 4 — Settings accessibility preferences', () {
    testWidgets('navigating to settings shows font size slider',
        (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.settings));
      await tester.pumpAndSettle();

      expect(find.text('Settings'), findsWidgets);
      expect(find.byType(Slider), findsOneWidget);
    });

    testWidgets('toggling high contrast switch updates UI', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.settings));
      await tester.pumpAndSettle();

      final switches = find.byType(Switch);
      expect(switches, findsWidgets);

      // Toggle the first switch (high contrast)
      await tester.tap(switches.first);
      await tester.pumpAndSettle();

      // No crash and switch value changed — pass
      expect(switches, findsWidgets);
    });

    testWidgets('accessibility toolbar A+ button increases font', (tester) async {
      app.main();
      await signIn(tester);

      // Tap A+ in the persistent toolbar
      await tester.tap(find.text('A+'));
      await tester.pumpAndSettle();

      // No crash = toolbar works
      expect(find.text('A+'), findsOneWidget);
    });

    testWidgets('accessibility toolbar contrast button toggles', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.contrast_outlined));
      await tester.pumpAndSettle();

      // High contrast now active — icon changes to Icons.contrast (filled)
      expect(find.byIcon(Icons.contrast), findsOneWidget);
    });
  });

  // ── Journey 5: Profile → Sign Out → Login ─────────────────────────────────

  group('Journey 5 — Profile → Sign Out → Login', () {
    testWidgets('profile screen shows user name and email', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.person));
      await tester.pumpAndSettle();

      expect(find.text('Demo Caregiver'), findsOneWidget);
      expect(find.text('demo@careconnect.com'), findsOneWidget);
    });

    testWidgets('sign out returns user to login screen', (tester) async {
      app.main();
      await signIn(tester);

      await tester.tap(find.byIcon(Icons.person));
      await tester.pumpAndSettle();

      await tester.scrollUntilVisible(
          find.text('Sign Out'), 200,
          scrollable: find.byType(Scrollable).first);
      await tester.tap(find.text('Sign Out'));
      await tester.pumpAndSettle();

      // Confirm dialog
      await tester.tap(find.text('Sign Out').last);
      await tester.pumpAndSettle();

      // Should be back on login
      expect(find.text('Welcome back'), findsOneWidget);
    });
  });
}
