class AppSettings {
  final double fontSize;
  final bool highContrast;
  final bool darkMode;
  final bool pushNotifications;

  const AppSettings({
    this.fontSize = 18.0,
    this.highContrast = false,
    this.darkMode = false,
    this.pushNotifications = true,
  });

  AppSettings copyWith({
    double? fontSize,
    bool? highContrast,
    bool? darkMode,
    bool? pushNotifications,
  }) =>
      AppSettings(
        fontSize: fontSize ?? this.fontSize,
        highContrast: highContrast ?? this.highContrast,
        darkMode: darkMode ?? this.darkMode,
        pushNotifications: pushNotifications ?? this.pushNotifications,
      );

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is AppSettings &&
          other.fontSize == fontSize &&
          other.highContrast == highContrast &&
          other.darkMode == darkMode &&
          other.pushNotifications == pushNotifications);

  @override
  int get hashCode =>
      Object.hash(fontSize, highContrast, darkMode, pushNotifications);
}
