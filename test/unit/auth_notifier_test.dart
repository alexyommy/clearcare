import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/state/auth_notifier.dart';
import 'package:careconnect_flutter/services/auth_service.dart';

void main() {
  late AuthNotifier notifier;

  setUp(() => notifier = AuthNotifier(AuthService()));

  group('AuthNotifier – initial state', () {
    test('user is null initially', () {
      expect(notifier.state.user, isNull);
    });

    test('isLoggedIn is false initially', () {
      expect(notifier.state.isLoggedIn, false);
    });

    test('isLoading is false initially', () {
      expect(notifier.state.isLoading, false);
    });

    test('error is null initially', () {
      expect(notifier.state.error, isNull);
    });
  });

  group('AuthNotifier – signIn', () {
    test('signs in with demo credentials', () async {
      final ok = await notifier.signIn('demo@careconnect.com', 'demo123');
      expect(ok, true);
      expect(notifier.state.isLoggedIn, true);
      expect(notifier.state.user?.email, 'demo@careconnect.com');
      expect(notifier.state.user?.name, 'Alex Caregiver');
    });

    test('fails with wrong password', () async {
      final ok = await notifier.signIn('demo@careconnect.com', 'wrong');
      expect(ok, false);
      expect(notifier.state.isLoggedIn, false);
      expect(notifier.state.error, isNotNull);
    });

    test('fails with unknown email', () async {
      final ok = await notifier.signIn('nobody@x.com', 'pass');
      expect(ok, false);
      expect(notifier.state.error, isNotNull);
    });

    test('error is cleared on successful sign in', () async {
      await notifier.signIn('bad@x.com', 'x'); // sets error
      await notifier.signIn('demo@careconnect.com', 'demo123');
      expect(notifier.state.error, isNull);
    });
  });

  group('AuthNotifier – signUp', () {
    test('signs up a new user', () async {
      final ok = await notifier.signUp('New User', 'new@test.com', 'pass123');
      expect(ok, true);
      expect(notifier.state.isLoggedIn, true);
      expect(notifier.state.user?.name, 'New User');
      expect(notifier.state.user?.email, 'new@test.com');
    });

    test('fails if email already registered', () async {
      await notifier.signUp('Alice', 'alice@test.com', 'pass');
      notifier.signOut();
      final ok = await notifier.signUp('Alice 2', 'alice@test.com', 'pass2');
      expect(ok, false);
      expect(notifier.state.error, isNotNull);
    });

    test('new user can sign in after sign up', () async {
      await notifier.signUp('Bob', 'bob@test.com', 'mypassword');
      notifier.signOut();
      final ok = await notifier.signIn('bob@test.com', 'mypassword');
      expect(ok, true);
    });
  });

  group('AuthNotifier – signOut', () {
    test('clears user and resets state', () async {
      await notifier.signIn('demo@careconnect.com', 'demo123');
      expect(notifier.state.isLoggedIn, true);
      notifier.signOut();
      expect(notifier.state.isLoggedIn, false);
      expect(notifier.state.user, isNull);
    });
  });

  group('AuthState – copyWith', () {
    test('copyWith clearUser sets user to null', () {
      const s = AuthState();
      final updated = s.copyWith(isLoading: true);
      expect(updated.isLoading, true);
      expect(updated.user, isNull);
    });
  });
}
