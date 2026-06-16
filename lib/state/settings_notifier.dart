import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_settings.dart';

const double _minFontSize = 18.0;
const double _maxFontSize = 32.0;
const double _fontSizeStep = 2.0;

class SettingsNotifier extends StateNotifier<AppSettings> {
  SettingsNotifier() : super(const AppSettings());

  void decreaseFontSize() {
    if (state.fontSize > _minFontSize) {
      state = state.copyWith(fontSize: state.fontSize - _fontSizeStep);
    }
  }

  void increaseFontSize() {
    if (state.fontSize < _maxFontSize) {
      state = state.copyWith(fontSize: state.fontSize + _fontSizeStep);
    }
  }

  void setFontSize(double size) {
    final clamped = size.clamp(_minFontSize, _maxFontSize);
    state = state.copyWith(fontSize: clamped);
  }

  void toggleHighContrast() {
    state = state.copyWith(highContrast: !state.highContrast);
  }

  void toggleDarkMode() {
    state = state.copyWith(darkMode: !state.darkMode);
  }

  void togglePushNotifications() {
    state = state.copyWith(pushNotifications: !state.pushNotifications);
  }
}
