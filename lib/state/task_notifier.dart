import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/task_model.dart';
import '../services/task_service.dart';

class TaskNotifier extends StateNotifier<List<CareTask>> {
  TaskNotifier(this._service) : super(_service.getTasks());

  final TaskService _service;

  void markComplete(String id) {
    final task = _service.getTaskById(id);
    if (task == null) return;
    final updated = task.copyWith(isCompleted: true);
    _service.updateTask(updated);
    state = _service.getTasks();
  }

  void markIncomplete(String id) {
    final task = _service.getTaskById(id);
    if (task == null) return;
    final updated = task.copyWith(isCompleted: false);
    _service.updateTask(updated);
    state = _service.getTasks();
  }

  void addTask(CareTask task) {
    _service.addTask(task);
    state = _service.getTasks();
  }

  void updateTask(CareTask task) {
    _service.updateTask(task);
    state = _service.getTasks();
  }

  void deleteTask(String id) {
    _service.deleteTask(id);
    state = _service.getTasks();
  }

  List<CareTask> get pendingTasks =>
      state.where((t) => !t.isCompleted).toList();

  List<CareTask> get completedTasks =>
      state.where((t) => t.isCompleted).toList();
}
