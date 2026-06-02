import 'package:flutter/material.dart';

class AppState extends ChangeNotifier {
  double _fontSize = 18.0;
  bool _highContrast = false;
  bool _darkMode = false;
  bool _pushNotifications = true;

  double get fontSize => _fontSize;
  bool get highContrast => _highContrast;
  bool get darkMode => _darkMode;
  bool get pushNotifications => _pushNotifications;

  void decreaseFontSize() {
    if (_fontSize > 18) {
      _fontSize -= 2;
      notifyListeners();
    }
  }

  void increaseFontSize() {
    if (_fontSize < 32) {
      _fontSize += 2;
      notifyListeners();
    }
  }

  void setFontSize(double size) {
    _fontSize = size;
    notifyListeners();
  }

  void toggleHighContrast() {
    _highContrast = !_highContrast;
    notifyListeners();
  }

  void toggleDarkMode() {
    _darkMode = !_darkMode;
    notifyListeners();
  }

  void togglePushNotifications() {
    _pushNotifications = !_pushNotifications;
    notifyListeners();
  }
}
