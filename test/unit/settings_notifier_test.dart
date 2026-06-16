import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/state/settings_notifier.dart';
import 'package:careconnect_flutter/models/app_settings.dart';

void main() {
  late SettingsNotifier notifier;

  setUp(() => notifier = SettingsNotifier());

  group('SettingsNotifier – font size', () {
    test('initial font size is 18', () {
      expect(notifier.state.fontSize, 18.0);
    });

    test('increaseFontSize increases by 2', () {
      notifier.increaseFontSize();
      expect(notifier.state.fontSize, 20.0);
    });

    test('increaseFontSize does not exceed 32', () {
      for (var i = 0; i < 10; i++) {
        notifier.increaseFontSize();
      }
      expect(notifier.state.fontSize, 32.0);
    });

    test('decreaseFontSize decreases by 2', () {
      notifier.increaseFontSize(); // 20
      notifier.decreaseFontSize(); // 18
      expect(notifier.state.fontSize, 18.0);
    });

    test('decreaseFontSize does not go below 18', () {
      for (var i = 0; i < 10; i++) {
        notifier.decreaseFontSize();
      }
      expect(notifier.state.fontSize, 18.0);
    });

    test('setFontSize clamps to min', () {
      notifier.setFontSize(10.0);
      expect(notifier.state.fontSize, 18.0);
    });

    test('setFontSize clamps to max', () {
      notifier.setFontSize(50.0);
      expect(notifier.state.fontSize, 32.0);
    });

    test('setFontSize sets valid value', () {
      notifier.setFontSize(24.0);
      expect(notifier.state.fontSize, 24.0);
    });
  });

  group('SettingsNotifier – toggles', () {
    test('toggleHighContrast flips value', () {
      expect(notifier.state.highContrast, false);
      notifier.toggleHighContrast();
      expect(notifier.state.highContrast, true);
      notifier.toggleHighContrast();
      expect(notifier.state.highContrast, false);
    });

    test('toggleDarkMode flips value', () {
      expect(notifier.state.darkMode, false);
      notifier.toggleDarkMode();
      expect(notifier.state.darkMode, true);
    });

    test('togglePushNotifications flips value', () {
      expect(notifier.state.pushNotifications, true);
      notifier.togglePushNotifications();
      expect(notifier.state.pushNotifications, false);
      notifier.togglePushNotifications();
      expect(notifier.state.pushNotifications, true);
    });

    test('toggling one setting does not affect others', () {
      notifier.toggleDarkMode();
      expect(notifier.state.highContrast, false);
      expect(notifier.state.pushNotifications, true);
    });
  });

  group('SettingsNotifier – state type', () {
    test('state is AppSettings', () {
      expect(notifier.state, isA<AppSettings>());
    });
  });
}
