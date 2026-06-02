import 'package:flutter/material.dart';
import '../models/app_state.dart';
import '../models/task_model.dart';
import '../widgets/accessibility_toolbar.dart';
import '../widgets/task_card.dart';

class DashboardScreen extends StatelessWidget {
  final AppState appState;

  const DashboardScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    final preview = sampleTasks.take(4).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CareConnect',
          style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
        ),
        backgroundColor: const Color(0xFF1A5276),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView(
              padding: const EdgeInsets.only(top: 16, bottom: 8),
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text(
                    "Today's Tasks",
                    style: TextStyle(
                      fontSize: appState.fontSize + 2,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF1A5276),
                    ),
                  ),
                ),
                ...preview.map((task) => TaskCard(task: task, fontSize: appState.fontSize)),
                const SizedBox(height: 8),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Text(
                    'Upcoming',
                    style: TextStyle(
                      fontSize: appState.fontSize + 2,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF1A5276),
                    ),
                  ),
                ),
                _SummaryTile(
                  icon: Icons.calendar_today,
                  label: 'Calendar',
                  detail: '3 events this week',
                  fontSize: appState.fontSize,
                ),
                _SummaryTile(
                  icon: Icons.notifications_outlined,
                  label: 'Reminders',
                  detail: '2 reminders set',
                  fontSize: appState.fontSize,
                ),
              ],
            ),
          ),
          ListenableBuilder(
            listenable: appState,
            builder: (context, child) => AccessibilityToolbar(appState: appState),
          ),
        ],
      ),
    );
  }
}

class _SummaryTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String detail;
  final double fontSize;

  const _SummaryTile({
    required this.icon,
    required this.label,
    required this.detail,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Icon(icon, color: const Color(0xFF1A5276), size: 32),
        title: Text(label, style: TextStyle(fontSize: fontSize, fontWeight: FontWeight.w600)),
        subtitle: Text(detail, style: TextStyle(fontSize: fontSize - 2)),
        trailing: const Icon(Icons.chevron_right),
      ),
    );
  }
}
