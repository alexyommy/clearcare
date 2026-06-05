import '../models/task_model.dart';

class TaskService {
  // Mutable in-memory store seeded from sample data
  final List<CareTask> _tasks = List.from(sampleTasks);

  List<CareTask> getTasks() => List.unmodifiable(_tasks);

  CareTask? getTaskById(String id) {
    try {
      return _tasks.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }

  void addTask(CareTask task) {
    _tasks.add(task);
  }

  /// Replaces the task with matching id. No-op if id not found.
  void updateTask(CareTask updated) {
    final index = _tasks.indexWhere((t) => t.id == updated.id);
    if (index != -1) _tasks[index] = updated;
  }

  /// Removes the task with [id]. No-op if not found.
  void deleteTask(String id) {
    _tasks.removeWhere((t) => t.id == id);
  }

  int get completedCount => _tasks.where((t) => t.isCompleted).length;
  int get totalCount => _tasks.length;
}
