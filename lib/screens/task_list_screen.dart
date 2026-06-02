import 'package:flutter/material.dart';
import '../models/app_state.dart';
import '../models/task_model.dart';
import '../widgets/accessibility_toolbar.dart';

class TaskListScreen extends StatefulWidget {
  final AppState appState;

  const TaskListScreen({super.key, required this.appState});

  @override
  State<TaskListScreen> createState() => _TaskListScreenState();
}

class _TaskListScreenState extends State<TaskListScreen> {
  late List<CareTask> _tasks;

  @override
  void initState() {
    super.initState();
    _tasks = List.from(sampleTasks);
  }

  void _markComplete(CareTask task) {
    setState(() => task.isCompleted = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('${task.title} marked complete'),
        backgroundColor: const Color(0xFF1E8449),
        duration: const Duration(seconds: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tasks', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF1A5276),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListenableBuilder(
              listenable: widget.appState,
              builder: (context, child) => ListView.builder(
                padding: const EdgeInsets.symmetric(vertical: 8),
                itemCount: _tasks.length,
                itemBuilder: (context, index) {
                  final task = _tasks[index];
                  return Dismissible(
                    key: Key(task.id),
                    direction: DismissDirection.endToStart,
                    background: Container(
                      alignment: Alignment.centerRight,
                      padding: const EdgeInsets.only(right: 24),
                      color: const Color(0xFF1E8449),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.check, color: Colors.white, size: 32),
                          SizedBox(height: 4),
                          Text('Complete', style: TextStyle(color: Colors.white)),
                        ],
                      ),
                    ),
                    confirmDismiss: (_) async {
                      _markComplete(task);
                      return false;
                    },
                    child: _TaskListTile(task: task, fontSize: widget.appState.fontSize),
                  );
                },
              ),
            ),
          ),
          ListenableBuilder(
            listenable: widget.appState,
            builder: (context, child) => AccessibilityToolbar(appState: widget.appState),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Add task — coming soon')),
          );
        },
        backgroundColor: const Color(0xFF1A5276),
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text('Add Task', style: TextStyle(color: Colors.white)),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.endFloat,
    );
  }
}

class _TaskListTile extends StatelessWidget {
  final CareTask task;
  final double fontSize;

  const _TaskListTile({required this.task, required this.fontSize});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: task.isCompleted ? Colors.grey[100] : Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        minVerticalPadding: 0,
        leading: Icon(
          task.isCompleted ? Icons.check_circle : Icons.radio_button_unchecked,
          color: task.isCompleted ? const Color(0xFF1E8449) : const Color(0xFF1A5276),
          size: 32,
        ),
        title: Text(
          '${task.title} — ${task.room}',
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: FontWeight.w600,
            decoration: task.isCompleted ? TextDecoration.lineThrough : null,
            color: task.isCompleted ? Colors.grey : const Color(0xFF0A0A0A),
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            task.time,
            style: TextStyle(fontSize: fontSize - 2, color: Colors.grey[600]),
          ),
        ),
        trailing: const Icon(Icons.drag_handle, color: Colors.grey),
      ),
    );
  }
}
