import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../state/providers.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  bool _editingName = false;
  final _nameCtrl = TextEditingController();

  static const _primary = Color(0xFF1A5276);

  @override
  void dispose() {
    _nameCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final fs = ref.watch(settingsProvider).fontSize;
    final user = ref.watch(authProvider).user;
    final tasks = ref.watch(taskProvider);
    final completed = tasks.where((t) => t.isCompleted).length;
    final pending = tasks.where((t) => !t.isCompleted).length;

    final initials = (user?.name ?? 'CC')
        .split(' ')
        .take(2)
        .map((w) => w.isNotEmpty ? w[0] : '')
        .join()
        .toUpperCase();

    return Scaffold(
      appBar: AppBar(
        title: Text('Profile',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: fs)),
        backgroundColor: _primary,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Avatar + name
          Center(
            child: Column(
              children: [
                Semantics(
                  label: 'Profile avatar for ${user?.name ?? 'user'}',
                  child: CircleAvatar(
                    radius: 48,
                    backgroundColor: _primary,
                    child: Text(
                      initials,
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: fs + 10,
                          fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                if (_editingName)
                  _EditNameField(
                    controller: _nameCtrl,
                    fontSize: fs,
                    color: Colors.black,
                    onSave: () => setState(() => _editingName = false),
                    onCancel: () => setState(() => _editingName = false),
                  )
                else
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        user?.name ?? 'Caregiver',
                        style: TextStyle(
                            fontSize: fs + 4, color: Colors.black, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.edit_outlined,
                            size: 20, color: _primary),
                        onPressed: () {
                          _nameCtrl.text = user?.name ?? '';
                          setState(() => _editingName = true);
                        },
                        tooltip: 'Edit name',
                      ),
                    ],
                  ),
                const SizedBox(height: 4),
                Text(
                  user?.email ?? '',
                  style: TextStyle(
                      fontSize: fs - 2, color: Colors.grey[600]),
                ),
                const SizedBox(height: 4),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: _primary.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Caregiver',
                    style: TextStyle(
                        fontSize: fs - 4,
                        color: _primary,
                        fontWeight: FontWeight.w600),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),

          // Stats
          Row(
            children: [
              Expanded(
                child: _ProfileStat(
                  label: 'Completed',
                  value: '$completed',
                  color: const Color(0xFF1E8449),
                  fontSize: fs,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ProfileStat(
                  label: 'Pending',
                  value: '$pending',
                  color: const Color(0xFFD4AC0D),
                  fontSize: fs,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _ProfileStat(
                  label: 'Total',
                  value: '${tasks.length}',
                  color: _primary,
                  fontSize: fs,
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),

          // Info section
          _SectionHeader(title: 'Account', fontSize: fs),
          _InfoTile(
              icon: Icons.email_outlined,
              label: 'Email',
              value: user?.email ?? '—',
              fontSize: fs),
          _InfoTile(
              icon: Icons.badge_outlined,
              label: 'Role',
              value: 'Caregiver',
              fontSize: fs),
          _InfoTile(
              icon: Icons.work_outline,
              label: 'Facility',
              value: 'Sunrise Care Center',
              fontSize: fs),
          const SizedBox(height: 24),

          // Sign out
          SizedBox(
            height: 52,
            child: OutlinedButton.icon(
              onPressed: () {
                ref.read(authProvider.notifier).signOut();
                context.go('/login');
              },
              icon: const Icon(Icons.logout, color: Color(0xFFC0392B)),
              label: Text('Sign Out',
                  style: TextStyle(
                      color: const Color(0xFFC0392B),
                      fontSize: fs,
                      fontWeight: FontWeight.bold)),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFC0392B)),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _EditNameField extends StatelessWidget {
  final TextEditingController controller;
  final double fontSize;
  final Color color;
  final VoidCallback onSave;
  final VoidCallback onCancel;

  const _EditNameField({
    required this.controller,
    required this.fontSize,
    required this.color,
    required this.onSave,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        SizedBox(
          width: 180,
          child: TextField(
            controller: controller,
            style: TextStyle(fontSize: fontSize, color: color),
            decoration: const InputDecoration(
              isDense: true,
              border: OutlineInputBorder(),
            ),
            autofocus: true,
          ),
        ),
        IconButton(
          icon: const Icon(Icons.check, color: Color(0xFF1E8449)),
          onPressed: onSave,
          tooltip: 'Save name',
        ),
        IconButton(
          icon: const Icon(Icons.close, color: Colors.grey),
          onPressed: onCancel,
          tooltip: 'Cancel',
        ),
      ],
    );
  }
}

class _ProfileStat extends StatelessWidget {
  final String label;
  final String value;
  final Color color;
  final double fontSize;

  const _ProfileStat({
    required this.label,
    required this.value,
    required this.color,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Text(value,
              style: TextStyle(
                  fontSize: fontSize + 6,
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

class _SectionHeader extends StatelessWidget {
  final String title;
  final double fontSize;
  const _SectionHeader({required this.title, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
            fontSize: fontSize - 4,
            fontWeight: FontWeight.w700,
            color: const Color(0xFF1A5276),
            letterSpacing: 1.2),
      ),
    );
  }
}

class _InfoTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final double fontSize;

  const _InfoTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: Icon(icon, color: const Color(0xFF1A5276)),
      title: Text(value, style: TextStyle(fontSize: fontSize)),
      subtitle: Text(label,
          style: TextStyle(fontSize: fontSize - 4, color: Colors.grey[600])),
    );
  }
}
