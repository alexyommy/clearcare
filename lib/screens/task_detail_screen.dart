import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../models/task_model.dart';
import '../state/providers.dart';

class TaskDetailScreen extends ConsumerWidget {
  final String taskId;
  const TaskDetailScreen({super.key, required this.taskId});

  static const _primary = Color(0xFF1A5276);
  static const _green = Color(0xFF1E8449);
  static const _red = Color(0xFFC0392B);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fs = ref.watch(settingsProvider).fontSize;
    final tasks = ref.watch(taskProvider);
    final task = tasks.cast<CareTask?>().firstWhere(
          (t) => t?.id == taskId,
          orElse: () => null,
        );

    if (task == null) {
      return Scaffold(
        appBar: AppBar(
          backgroundColor: _primary,
          leading: BackButton(
            color: Colors.white,
            onPressed: () => context.go('/tasks'),
          ),
        ),
        body: Center(
          child: Text('Task not found',
              style: TextStyle(fontSize: fs, color: Colors.grey)),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Task Detail',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: fs)),
        backgroundColor: _primary,
        leading: BackButton(
          color: Colors.white,
          onPressed: () => context.go('/tasks'),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined, color: Colors.white),
            onPressed: () => context.go('/tasks/$taskId/edit'),
            tooltip: 'Edit task',
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: Colors.white),
            onPressed: () => _confirmDelete(context, ref, task),
            tooltip: 'Delete task',
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          // Status chip
          Row(
            children: [
              _StatusChip(isCompleted: task.isCompleted, fontSize: fs),
              const SizedBox(width: 10),
              _PriorityChip(priority: task.priority, fontSize: fs),
            ],
          ),
          const SizedBox(height: 20),

          // Title
          Text(
            task.title,
            style: TextStyle(
                fontSize: fs + 6,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF0A0A0A)),
          ),
          const SizedBox(height: 20),

          // Details grid
          _DetailRow(
              icon: Icons.schedule,
              label: 'Time',
              value: task.time,
              fontSize: fs),
          _DetailRow(
              icon: Icons.room,
              label: 'Location',
              value: task.room,
              fontSize: fs),
          _DetailRow(
              icon: Icons.category_outlined,
              label: 'Category',
              value: _categoryLabel(task.category),
              fontSize: fs),
          _DetailRow(
              icon: Icons.flag_outlined,
              label: 'Priority',
              value: _priorityLabel(task.priority),
              fontSize: fs),

          if (task.notes != null && task.notes!.isNotEmpty) ...[
            const SizedBox(height: 8),
            _DetailRow(
                icon: Icons.notes,
                label: 'Notes',
                value: task.notes!,
                fontSize: fs),
          ],

          const SizedBox(height: 32),

          // Toggle completion button
          SizedBox(
            height: 52,
            child: ElevatedButton.icon(
              onPressed: () {
                if (task.isCompleted) {
                  ref.read(taskProvider.notifier).markIncomplete(task.id);
                } else {
                  ref.read(taskProvider.notifier).markComplete(task.id);
                }
              },
              icon: Icon(
                task.isCompleted ? Icons.undo : Icons.check_circle_outline,
              ),
              label: Text(
                task.isCompleted ? 'Mark as Pending' : 'Mark as Complete',
                style: TextStyle(
                    fontSize: fs, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: task.isCompleted ? Colors.grey[700] : _green,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(
      BuildContext context, WidgetRef ref, CareTask task) {
    showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete task?'),
        content: Text('Remove "${task.title}" from the task list?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              ref.read(taskProvider.notifier).deleteTask(task.id);
              context.go('/tasks');
            },
            style:
                ElevatedButton.styleFrom(backgroundColor: _red),
            child: const Text('Delete',
                style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  String _categoryLabel(TaskCategory c) {
    const labels = {
      TaskCategory.medication: 'Medication',
      TaskCategory.vitals: 'Vitals',
      TaskCategory.therapy: 'Therapy',
      TaskCategory.dressing: 'Dressing',
      TaskCategory.monitoring: 'Monitoring',
      TaskCategory.rounds: 'Rounds',
      TaskCategory.other: 'Other',
    };
    return labels[c] ?? 'Other';
  }

  String _priorityLabel(TaskPriority p) {
    switch (p) {
      case TaskPriority.high:
        return 'High';
      case TaskPriority.medium:
        return 'Medium';
      case TaskPriority.low:
        return 'Low';
    }
  }
}

class _StatusChip extends StatelessWidget {
  final bool isCompleted;
  final double fontSize;
  const _StatusChip({required this.isCompleted, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        isCompleted ? 'Completed' : 'Pending',
        style: TextStyle(
            color: Colors.white,
            fontSize: fontSize - 4,
            fontWeight: FontWeight.w600),
      ),
      backgroundColor:
          isCompleted ? const Color(0xFF1E8449) : const Color(0xFFD4AC0D),
      padding: EdgeInsets.zero,
    );
  }
}

class _PriorityChip extends StatelessWidget {
  final TaskPriority priority;
  final double fontSize;
  const _PriorityChip({required this.priority, required this.fontSize});

  Color get _color {
    switch (priority) {
      case TaskPriority.high:
        return const Color(0xFFC0392B);
      case TaskPriority.medium:
        return const Color(0xFFD4AC0D);
      case TaskPriority.low:
        return const Color(0xFF1E8449);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        priority.name.toUpperCase(),
        style: TextStyle(
            color: Colors.white,
            fontSize: fontSize - 4,
            fontWeight: FontWeight.w600),
      ),
      backgroundColor: _color,
      padding: EdgeInsets.zero,
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final double fontSize;

  const _DetailRow({
    required this.icon,
    required this.label,
    required this.value,
    required this.fontSize,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 20, color: const Color(0xFF1A5276)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label,
                    style: TextStyle(
                        fontSize: fontSize - 4,
                        color: Colors.grey[500],
                        fontWeight: FontWeight.w600)),
                Text(value,
                    style: TextStyle(
                        fontSize: fontSize - 1,
                        color: const Color(0xFF0A0A0A))),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
