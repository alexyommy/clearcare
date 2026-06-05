import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/state/task_notifier.dart';
import 'package:careconnect_flutter/services/task_service.dart';
import 'package:careconnect_flutter/models/task_model.dart';

void main() {
  late TaskNotifier notifier;
  late TaskService service;

  setUp(() {
    service = TaskService();
    notifier = TaskNotifier(service);
  });

  group('TaskNotifier – initial state', () {
    test('loads sample tasks on creation', () {
      expect(notifier.state, isNotEmpty);
    });

    test('no tasks completed initially', () {
      expect(notifier.state.any((t) => t.isCompleted), false);
    });

    test('pendingTasks equals all tasks initially', () {
      expect(notifier.pendingTasks.length, notifier.state.length);
    });

    test('completedTasks is empty initially', () {
      expect(notifier.completedTasks, isEmpty);
    });
  });

  group('TaskNotifier – markComplete', () {
    test('marks a task as completed', () {
      final id = notifier.state.first.id;
      notifier.markComplete(id);
      expect(notifier.state.firstWhere((t) => t.id == id).isCompleted, true);
    });

    test('does not affect other tasks', () {
      final id = notifier.state.first.id;
      notifier.markComplete(id);
      final others = notifier.state.where((t) => t.id != id);
      expect(others.any((t) => t.isCompleted), false);
    });

    test('no-op for unknown id', () {
      final countBefore = notifier.state.length;
      notifier.markComplete('nonexistent');
      expect(notifier.state.length, countBefore);
    });
  });

  group('TaskNotifier – markIncomplete', () {
    test('restores a completed task to pending', () {
      final id = notifier.state.first.id;
      notifier.markComplete(id);
      notifier.markIncomplete(id);
      expect(notifier.state.firstWhere((t) => t.id == id).isCompleted, false);
    });
  });

  group('TaskNotifier – addTask', () {
    test('adds a new task to state', () {
      final before = notifier.state.length;
      notifier.addTask(const CareTask(
          id: 'new1', title: 'New', time: '1pm', room: 'Test'));
      expect(notifier.state.length, before + 1);
    });

    test('new task appears in state with correct fields', () {
      notifier.addTask(const CareTask(
          id: 'new2', title: 'Check-in', time: '3pm', room: 'Room A'));
      final found = notifier.state.firstWhere((t) => t.id == 'new2');
      expect(found.title, 'Check-in');
      expect(found.room, 'Room A');
    });
  });

  group('TaskNotifier – updateTask', () {
    test('updates an existing task', () {
      final id = notifier.state.first.id;
      final updated =
          notifier.state.first.copyWith(title: 'Updated Title');
      notifier.updateTask(updated);
      expect(
          notifier.state.firstWhere((t) => t.id == id).title,
          'Updated Title');
    });

    test('no-op for unknown id', () {
      final before = notifier.state.length;
      notifier.updateTask(const CareTask(
          id: 'ghost', title: 'Ghost', time: '1pm', room: 'X'));
      expect(notifier.state.length, before);
    });
  });

  group('TaskNotifier – deleteTask', () {
    test('removes task from state', () {
      final id = notifier.state.first.id;
      final before = notifier.state.length;
      notifier.deleteTask(id);
      expect(notifier.state.length, before - 1);
      expect(notifier.state.any((t) => t.id == id), false);
    });

    test('no-op for unknown id', () {
      final before = notifier.state.length;
      notifier.deleteTask('does-not-exist');
      expect(notifier.state.length, before);
    });
  });

  group('TaskNotifier – computed properties', () {
    test('pendingTasks only returns incomplete tasks', () {
      notifier.markComplete(notifier.state.first.id);
      expect(notifier.pendingTasks.every((t) => !t.isCompleted), true);
    });

    test('completedTasks only returns completed tasks', () {
      notifier.markComplete(notifier.state.first.id);
      expect(notifier.completedTasks.every((t) => t.isCompleted), true);
    });
  });
}
