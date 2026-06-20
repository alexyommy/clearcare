import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../state/providers.dart';
import '../widgets/task_card.dart';

class TaskListScreen extends ConsumerWidget {
  const TaskListScreen({super.key});

  static const _primary = Color(0xFF1A5276);
  static const _green = Color(0xFF1E8449);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final fs = ref.watch(settingsProvider).fontSize;
    final tasks = ref.watch(taskProvider);
    final pending = tasks.where((t) => !t.isCompleted).toList();
    final completed = tasks.where((t) => t.isCompleted).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text('Tasks',
            style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: fs)),
        backgroundColor: _primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list, color: Colors.white),
            onPressed: () {},
            tooltip: 'Filter tasks',
          ),
        ],
      ),
      body: tasks.isEmpty
          ? Center(
              child: Text('No tasks yet',
                  style: TextStyle(fontSize: fs, color: Colors.grey[500])),
            )
          : ListView(
              padding: const EdgeInsets.only(top: 8, bottom: 100),
              children: [
                if (pending.isNotEmpty) ...[
                  _SectionLabel(
                      label: 'Pending (${pending.length})', fontSize: fs),
                  ...pending.map((task) => Semantics(
                        customSemanticsActions: {
                          CustomSemanticsAction(label: 'Mark complete'):
                              () => ref
                                  .read(taskProvider.notifier)
                                  .markComplete(task.id),
                        },
                        child: Dismissible(
                        key: Key('task_${task.id}'),
                        direction: DismissDirection.endToStart,
                        background: _SwipeBackground(),
                        confirmDismiss: (_) async {
                          ref
                              .read(taskProvider.notifier)
                              .markComplete(task.id);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content:
                                  Text('${task.title} marked complete'),
                              backgroundColor: _green,
                              action: SnackBarAction(
                                label: 'Undo',
                                textColor: Colors.white,
                                onPressed: () => ref
                                    .read(taskProvider.notifier)
                                    .markIncomplete(task.id),
                              ),
                            ),
                          );
                          return false;
                        },
                        child: TaskCard(
                          task: task,
                          fontSize: fs,
                          onTap: () => context.go('/tasks/${task.id}'),
                        ),
                      ))),
                ],
                if (completed.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  _SectionLabel(
                      label: 'Completed (${completed.length})',
                      fontSize: fs),
                  ...completed.map((task) => TaskCard(
                        task: task,
                        fontSize: fs,
                        onTap: () => context.go('/tasks/${task.id}'),
                      )),
                ],
              ],
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.go('/tasks/new'),
        backgroundColor: _primary,
        icon: const Icon(Icons.add, color: Colors.white),
        label: Text('Add Task',
            style: TextStyle(color: Colors.white, fontSize: fs - 2)),
      ),
    );
  }
}

class _SectionLabel extends StatelessWidget {
  final String label;
  final double fontSize;
  const _SectionLabel({required this.label, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      header: true,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
        child: Text(
          label,
          style: TextStyle(
              fontSize: fontSize - 2,
              fontWeight: FontWeight.w700,
              color: const Color(0xFF1A5276),
              letterSpacing: 0.5),
        ),
      ),
    );
  }
}

class _SwipeBackground extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // Decorative affordance — exclude from semantics; swipe action is
    // surfaced via CustomSemanticsAction on the parent Semantics widget.
    return ExcludeSemantics(
      child: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 24),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: const Color(0xFF1E8449),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.check, color: Colors.white, size: 28),
            SizedBox(height: 4),
            Text('Complete',
                style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
