import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/models/app_settings.dart';

void main() {
  group('AppSettings', () {
    test('default values', () {
      const s = AppSettings();
      expect(s.fontSize, 18.0);
      expect(s.highContrast, false);
      expect(s.darkMode, false);
      expect(s.pushNotifications, true);
    });

    test('copyWith updates fontSize', () {
      const s = AppSettings();
      final updated = s.copyWith(fontSize: 24.0);
      expect(updated.fontSize, 24.0);
      expect(updated.highContrast, false);
    });

    test('copyWith updates highContrast', () {
      const s = AppSettings();
      final updated = s.copyWith(highContrast: true);
      expect(updated.highContrast, true);
      expect(updated.fontSize, 18.0);
    });

    test('copyWith updates darkMode', () {
      const s = AppSettings();
      final updated = s.copyWith(darkMode: true);
      expect(updated.darkMode, true);
    });

    test('copyWith updates pushNotifications', () {
      const s = AppSettings();
      final updated = s.copyWith(pushNotifications: false);
      expect(updated.pushNotifications, false);
    });

    test('copyWith with no args produces equal object', () {
      const s = AppSettings(fontSize: 22, highContrast: true);
      final copy = s.copyWith();
      expect(copy, equals(s));
    });

    test('equality compares all fields', () {
      const a = AppSettings(fontSize: 20, highContrast: true);
      const b = AppSettings(fontSize: 20, highContrast: true);
      const c = AppSettings(fontSize: 22, highContrast: true);
      expect(a, equals(b));
      expect(a, isNot(equals(c)));
    });

    test('hashCode is consistent with equality', () {
      const a = AppSettings(fontSize: 20);
      const b = AppSettings(fontSize: 20);
      expect(a.hashCode, b.hashCode);
    });
  });
}
