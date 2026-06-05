import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect_flutter/screens/login_screen.dart';
import 'package:careconnect_flutter/state/providers.dart';
import 'package:careconnect_flutter/state/auth_notifier.dart';
import 'package:careconnect_flutter/services/auth_service.dart';

Widget _buildLoginScreen() {
  final router = GoRouter(
    initialLocation: '/login',
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(
          path: '/dashboard',
          builder: (_, __) => const Scaffold(body: Text('Dashboard'))),
    ],
  );

  return ProviderScope(
    overrides: [
      authServiceProvider.overrideWithValue(AuthService()),
      authProvider.overrideWith(
          (ref) => AuthNotifier(ref.read(authServiceProvider))),
    ],
    child: MaterialApp.router(routerConfig: router),
  );
}

void main() {
  testWidgets('renders CareConnect title', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    expect(find.text('CareConnect'), findsOneWidget);
  });

  testWidgets('renders email and password fields', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    expect(find.byType(TextFormField), findsNWidgets(2));
  });

  testWidgets('renders sign in button', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    expect(find.text('Sign in'), findsOneWidget);
  });

  testWidgets('shows validation errors on empty submit', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    await tester.tap(find.text('Sign in'));
    await tester.pump();
    expect(find.text('Email is required'), findsOneWidget);
    expect(find.text('Password is required'), findsOneWidget);
  });

  testWidgets('shows email validation error for invalid email', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    await tester.enterText(
        find.byType(TextFormField).first, 'notanemail');
    await tester.tap(find.text('Sign in'));
    await tester.pump();
    expect(find.text('Enter a valid email'), findsOneWidget);
  });

  testWidgets('toggles to sign up mode', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    await tester.tap(find.text("Don't have an account? Sign up"));
    await tester.pump();
    expect(find.text('Create account'), findsOneWidget);
  });

  testWidgets('sign up mode shows 3 fields', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    await tester.tap(find.text("Don't have an account? Sign up"));
    await tester.pump();
    expect(find.byType(TextFormField), findsNWidgets(3));
  });

  testWidgets('shows demo hint text', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    expect(find.textContaining('demo@careconnect.com'), findsOneWidget);
  });

  testWidgets('password field has obscure toggle button', (tester) async {
    await tester.pumpWidget(_buildLoginScreen());
    expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
  });
}
