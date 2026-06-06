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
    final isDark = Theme.of(context).brightness == Brightness.dark;

    // Text colours that work in both light and dark
    final titleColor = isDark ? Colors.white : const Color(0xFF0A0A0A);
    final subtitleColor = isDark ? Colors.white70 : Colors.grey[600]!;
    final uncheckedColor = isDark ? Colors.white38 : Colors.grey[400]!;

    // In dark mode give the card a visible surface with a subtle border
    final cardColor = isDark ? const Color(0xFF1E2A38) : null;
    final cardBorder = isDark
        ? Border.all(color: Colors.white12)
        : Border.all(color: Colors.grey.shade200);

    return Semantics(
      label: '${task.title}, ${task.room}, ${task.time}, '
          '${task.isCompleted ? "completed" : "pending"}',
      button: onTap != null,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: cardColor ?? Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(12),
          border: cardBorder,
          boxShadow: isDark
              ? null
              : [
                  BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 6,
                      offset: const Offset(0, 2))
                ],
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(12),
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
                      color: _priorityColor.withValues(alpha: isDark ? 0.25 : 0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child:
                        Icon(_categoryIcon, color: _priorityColor, size: 22),
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
                            color: titleColor,
                            decoration: task.isCompleted
                                ? TextDecoration.lineThrough
                                : null,
                            decorationColor: subtitleColor,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${task.time}  ·  ${task.room}',
                          style: TextStyle(
                            fontSize: fontSize - 2,
                            color: subtitleColor,
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
                        : uncheckedColor,
                    size: 26,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
