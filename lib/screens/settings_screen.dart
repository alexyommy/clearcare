import 'package:flutter/material.dart';
import '../models/app_state.dart';
import '../widgets/accessibility_toolbar.dart';

class SettingsScreen extends StatelessWidget {
  final AppState appState;

  const SettingsScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1A5276),
      ),
      body: ListenableBuilder(
        listenable: appState,
        builder: (context, child) => Column(
          children: [
            Expanded(
              child: ListView(
                padding: const EdgeInsets.only(top: 8, bottom: 16),
                children: [
                  _SectionHeader(title: 'Accessibility', fontSize: appState.fontSize),
                  _SettingsTile(
                    title: 'Font Size',
                    subtitle: '${appState.fontSize.round()}sp',
                    fontSize: appState.fontSize,
                    trailing: SizedBox(
                      width: 180,
                      child: Slider(
                        value: appState.fontSize,
                        min: 18,
                        max: 32,
                        divisions: 7,
                        activeColor: const Color(0xFF1A5276),
                        label: '${appState.fontSize.round()}sp',
                        onChanged: appState.setFontSize,
                      ),
                    ),
                  ),
                  _SwitchTile(
                    title: 'High Contrast',
                    subtitle: 'Increases text and UI contrast',
                    value: appState.highContrast,
                    onChanged: (_) => appState.toggleHighContrast(),
                    fontSize: appState.fontSize,
                  ),
                  _SwitchTile(
                    title: 'Dark Mode',
                    subtitle: 'Dark background for low-light use',
                    value: appState.darkMode,
                    onChanged: (_) => appState.toggleDarkMode(),
                    fontSize: appState.fontSize,
                  ),
                  const Divider(height: 24),
                  _SectionHeader(title: 'Notifications', fontSize: appState.fontSize),
                  _SwitchTile(
                    title: 'Push Notifications',
                    subtitle: 'Receive task and reminder alerts',
                    value: appState.pushNotifications,
                    onChanged: (_) => appState.togglePushNotifications(),
                    fontSize: appState.fontSize,
                  ),
                  _SettingsTile(
                    title: 'Reminder Time',
                    subtitle: '15 minutes before task',
                    fontSize: appState.fontSize,
                    trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  ),
                  const Divider(height: 24),
                  _SectionHeader(title: 'Account', fontSize: appState.fontSize),
                  _SettingsTile(
                    title: 'Caregiver Name',
                    subtitle: 'Alex — Shift A',
                    fontSize: appState.fontSize,
                    trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  ),
                  _SettingsTile(
                    title: 'Facility',
                    subtitle: 'Sunrise Care Center',
                    fontSize: appState.fontSize,
                    trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                  ),
                  _SettingsTile(
                    title: 'Sign Out',
                    subtitle: '',
                    fontSize: appState.fontSize,
                    titleColor: const Color(0xFFC0392B),
                    trailing: const Icon(Icons.logout, color: Color(0xFFC0392B)),
                  ),
                ],
              ),
            ),
            AccessibilityToolbar(appState: appState),
          ],
        ),
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final double fontSize;

  const _SectionHeader({required this.title, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: fontSize - 4,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF1A5276),
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final double fontSize;
  final Widget trailing;
  final Color? titleColor;

  const _SettingsTile({
    required this.title,
    required this.subtitle,
    required this.fontSize,
    required this.trailing,
    this.titleColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      title: Text(
        title,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.w600,
          color: titleColor ?? const Color(0xFF0A0A0A),
        ),
      ),
      subtitle: subtitle.isNotEmpty
          ? Text(subtitle, style: TextStyle(fontSize: fontSize - 2, color: Colors.grey[600]))
          : null,
      trailing: trailing,
    );
  }
}

class _SwitchTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final double fontSize;

  const _SwitchTile({
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      title: Text(
        title,
        style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600),
      ),
      subtitle: Text(subtitle, style: TextStyle(fontSize: fontSize - 2, color: Colors.grey[600])),
      trailing: Switch(
        value: value,
        onChanged: onChanged,
        thumbColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? const Color(0xFF1A5276)
              : null,
        ),
      ),
    );
  }
}
