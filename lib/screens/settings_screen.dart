import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/providers.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  static const _primary = Color(0xFF1A5276);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);
    final fs = settings.fontSize;

    return Scaffold(
      appBar: AppBar(
        title: Text('Settings',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: fs)),
        backgroundColor: _primary,
      ),
      body: ListView(
        padding: const EdgeInsets.only(top: 8, bottom: 32),
        children: [
          // ── Accessibility ─────────────────────────────────────────────────
          _SectionHeader(title: 'Accessibility', fontSize: fs),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Font Size: ${settings.fontSize.round()}sp',
                    style: TextStyle(
                        fontSize: fs,
                        fontWeight: FontWeight.w600)),
                Semantics(
                  label:
                      'Font size slider, current value ${settings.fontSize.round()} sp',
                  child: Slider(
                    value: settings.fontSize,
                    min: 18,
                    max: 32,
                    divisions: 7,
                    activeColor: _primary,
                    label: '${settings.fontSize.round()}sp',
                    onChanged: notifier.setFontSize,
                  ),
                ),
              ],
            ),
          ),
          _SwitchTile(
            icon: Icons.contrast,
            title: 'High Contrast',
            subtitle: 'Increases text and UI contrast',
            value: settings.highContrast,
            onChanged: (_) => notifier.toggleHighContrast(),
            fontSize: fs,
          ),
          _SwitchTile(
            icon: Icons.dark_mode_outlined,
            title: 'Dark Mode',
            subtitle: 'Dark background for low-light environments',
            value: settings.darkMode,
            onChanged: (_) => notifier.toggleDarkMode(),
            fontSize: fs,
          ),
          const Divider(height: 32),

          // ── Notifications ─────────────────────────────────────────────────
          _SectionHeader(title: 'Notifications', fontSize: fs),
          _SwitchTile(
            icon: Icons.notifications_outlined,
            title: 'Push Notifications',
            subtitle: 'Receive task and reminder alerts',
            value: settings.pushNotifications,
            onChanged: (_) => notifier.togglePushNotifications(),
            fontSize: fs,
          ),
          ListTile(
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            leading:
                const Icon(Icons.alarm_outlined, color: _primary, size: 28),
            title: Text('Reminder Time',
                style: TextStyle(
                    fontSize: fs, fontWeight: FontWeight.w600)),
            subtitle: Text('15 minutes before task',
                style:
                    TextStyle(fontSize: fs - 4, color: Colors.grey[600])),
            trailing: const Icon(Icons.chevron_right, color: Colors.grey),
            onTap: () {},
          ),
          const Divider(height: 32),

          // ── About ─────────────────────────────────────────────────────────
          _SectionHeader(title: 'About', fontSize: fs),
          _InfoTile(label: 'Version', value: '1.0.0', fontSize: fs),
          _InfoTile(
              label: 'Course',
              value: 'SWEN 661 — UMGC Team 2',
              fontSize: fs),
          _InfoTile(
              label: 'Accessibility',
              value: 'WCAG 2.1 AA',
              fontSize: fs),
        ],
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
            fontSize: (fontSize - 4).clamp(11, 20),
            fontWeight: FontWeight.w700,
            color: const Color(0xFF1A5276),
            letterSpacing: 1.2),
      ),
    );
  }
}

class _SwitchTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;
  final double fontSize;

  const _SwitchTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      toggled: value,
      label: '$title, ${value ? "on" : "off"}',
      child: SwitchListTile(
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        secondary: Icon(icon, color: const Color(0xFF1A5276), size: 28),
        title: Text(title,
            style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600)),
        subtitle: Text(subtitle,
            style:
                TextStyle(fontSize: fontSize - 4, color: Colors.grey[600])),
        value: value,
        onChanged: onChanged,
        thumbColor: WidgetStateProperty.resolveWith(
            (s) => s.contains(WidgetState.selected)
                ? const Color(0xFF1A5276)
                : null),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final String label;
  final String value;
  final double fontSize;

  const _InfoTile({
    required this.label,
    required this.value,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 16, vertical: 2),
      title:
          Text(label, style: TextStyle(fontSize: fontSize - 2, color: Colors.grey[600])),
      trailing: Text(value,
          style: TextStyle(fontSize: fontSize - 2, fontWeight: FontWeight.w500)),
    );
  }
}
