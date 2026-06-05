import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../state/providers.dart';
import '../widgets/task_card.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  static const _primary = Color(0xFF1A5276);
  static const _secondary = Color(0xFF1E8449);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final tasks = ref.watch(taskProvider);
    final user = ref.watch(authProvider).user;
    final pending = tasks.where((t) => !t.isCompleted).toList();
    final completed = tasks.where((t) => t.isCompleted).length;
    final preview = pending.take(3).toList();
    final fs = settings.fontSize;

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'CareConnect',
          style: TextStyle(
              color: Colors.white, fontWeight: FontWeight.bold, fontSize: fs),
        ),
        backgroundColor: _primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_outlined, color: Colors.white),
            onPressed: () {},
            tooltip: 'Notifications',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Greeting
          Text(
            'Good ${_greeting()}, ${user?.name.split(' ').first ?? 'Caregiver'}',
            style: TextStyle(
                fontSize: fs + 4,
                fontWeight: FontWeight.bold,
                color: _primary),
          ),
          const SizedBox(height: 4),
          Text(
            _todayLabel(),
            style: TextStyle(fontSize: fs - 2, color: Colors.grey[600]),
          ),
          const SizedBox(height: 20),

          // Stats row
          Row(
            children: [
              Expanded(
                child: _StatCard(
                  label: 'Pending',
                  value: '${pending.length}',
                  icon: Icons.pending_actions,
                  color: const Color(0xFFD4AC0D),
                  fontSize: fs,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  label: 'Completed',
                  value: '$completed',
                  icon: Icons.check_circle_outline,
                  color: _secondary,
                  fontSize: fs,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _StatCard(
                  label: 'Total',
                  value: '${tasks.length}',
                  icon: Icons.list_alt,
                  color: _primary,
                  fontSize: fs,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Today's tasks header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Today's Tasks",
                style: TextStyle(
                    fontSize: fs + 2,
                    fontWeight: FontWeight.w700,
                    color: _primary),
              ),
              TextButton(
                onPressed: () => context.go('/tasks'),
                child: Text('View all',
                    style: TextStyle(color: _primary, fontSize: fs - 2)),
              ),
            ],
          ),
          const SizedBox(height: 8),

          if (preview.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  const Icon(Icons.check_circle, color: _secondary, size: 48),
                  const SizedBox(height: 8),
                  Text('All tasks complete!',
                      style: TextStyle(
                          fontSize: fs,
                          color: _secondary,
                          fontWeight: FontWeight.w600)),
                ],
              ),
            )
          else
            ...preview.map((task) => TaskCard(
                  task: task,
                  fontSize: fs,
                  onTap: () => context.go('/tasks/${task.id}'),
                )),

          if (pending.length > 3) ...[
            const SizedBox(height: 8),
            Center(
              child: TextButton.icon(
                onPressed: () => context.go('/tasks'),
                icon: const Icon(Icons.arrow_forward, size: 18),
                label: Text('+${pending.length - 3} more tasks',
                    style: TextStyle(fontSize: fs - 2)),
                style: TextButton.styleFrom(foregroundColor: _primary),
              ),
            ),
          ],

          const SizedBox(height: 24),
          // Quick links
          Text(
            'Quick Access',
            style: TextStyle(
                fontSize: fs + 2,
                fontWeight: FontWeight.w700,
                color: _primary),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _QuickLink(
                  icon: Icons.calendar_month,
                  label: 'Calendar',
                  onTap: () => context.go('/calendar'),
                  fontSize: fs,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _QuickLink(
                  icon: Icons.person,
                  label: 'Profile',
                  onTap: () => context.go('/profile'),
                  fontSize: fs,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  String _todayLabel() {
    final now = DateTime.now();
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return '${days[now.weekday - 1]}, ${months[now.month - 1]} ${now.day}';
  }
}

class _StatCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final double fontSize;

  const _StatCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 26),
          const SizedBox(height: 6),
          Text(value,
              style: TextStyle(
                  fontSize: fontSize + 4,
                  fontWeight: FontWeight.bold,
                  color: color)),
          Text(label,
              style:
                  TextStyle(fontSize: fontSize - 4, color: Colors.grey[700])),
        ],
      ),
    );
  }
}

class _QuickLink extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final double fontSize;

  const _QuickLink({
    required this.icon,
    required this.label,
    required this.onTap,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: label,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey[200]!),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 8)
            ],
          ),
          child: Column(
            children: [
              Icon(icon, color: const Color(0xFF1A5276), size: 28),
              const SizedBox(height: 6),
              Text(label,
                  style: TextStyle(
                      fontSize: fontSize - 2,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF1A5276))),
            ],
          ),
        ),
      ),
    );
  }
}
