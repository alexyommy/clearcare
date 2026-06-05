import 'package:flutter/material.dart';
import '../models/task_model.dart';

class TaskCard extends StatelessWidget {
  final CareTask task;
  final double fontSize;
  final VoidCallback? onTap;

  const TaskCard({
    super.key,
    required this.task,
    required this.fontSize,
    this.onTap,
  });

  Color get _priorityColor {
    switch (task.priority) {
      case TaskPriority.high:
        return const Color(0xFFC0392B);
      case TaskPriority.medium:
        return const Color(0xFFD4AC0D);
      case TaskPriority.low:
        return const Color(0xFF1E8449);
    }
  }

  IconData get _categoryIcon {
    switch (task.category) {
      case TaskCategory.medication:
        return Icons.medication_outlined;
      case TaskCategory.vitals:
        return Icons.monitor_heart_outlined;
      case TaskCategory.therapy:
        return Icons.self_improvement_outlined;
      case TaskCategory.dressing:
        return Icons.healing_outlined;
      case TaskCategory.monitoring:
        return Icons.biotech_outlined;
      case TaskCategory.rounds:
        return Icons.directions_walk_outlined;
      case TaskCategory.other:
        return Icons.medical_services_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: '${task.title}, ${task.room}, ${task.time}, '
          '${task.isCompleted ? "completed" : "pending"}',
      button: onTap != null,
      child: Card(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        elevation: 1,
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                // Priority indicator + category icon
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: _priorityColor.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(_categoryIcon, color: _priorityColor, size: 22),
                ),
                const SizedBox(width: 14),
                // Title + meta
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        task.title,
                        style: TextStyle(
                          fontSize: fontSize,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF0A0A0A),
                          decoration: task.isCompleted
                              ? TextDecoration.lineThrough
                              : null,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${task.time}  ·  ${task.room}',
                        style: TextStyle(
                          fontSize: fontSize - 2,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),
                // Completion icon
                Icon(
                  task.isCompleted
                      ? Icons.check_circle
                      : Icons.radio_button_unchecked,
                  color: task.isCompleted
                      ? const Color(0xFF1E8449)
                      : Colors.grey[400],
                  size: 26,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
