import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/services/task_service.dart';
import 'package:careconnect_flutter/models/task_model.dart';

void main() {
  late TaskService service;

  setUp(() => service = TaskService());

  group('TaskService', () {
    test('getTasks returns a non-empty list', () {
      expect(service.getTasks(), isNotEmpty);
    });

    test('getTasks returns an unmodifiable copy', () {
      final tasks = service.getTasks();
      expect(() => (tasks as dynamic).add(null), throwsA(anything));
    });

    test('getTaskById returns correct task', () {
      final first = service.getTasks().first;
      final found = service.getTaskById(first.id);
      expect(found, equals(first));
    });

    test('getTaskById returns null for unknown id', () {
      expect(service.getTaskById('nope'), isNull);
    });

    test('addTask increases count by 1', () {
      final before = service.totalCount;
      service.addTask(
          const CareTask(id: 'x', title: 'T', time: '1pm', room: 'R'));
      expect(service.totalCount, before + 1);
    });

    test('updateTask changes the task', () {
      final id = service.getTasks().first.id;
      final updated =
          service.getTasks().first.copyWith(title: 'Changed');
      service.updateTask(updated);
      expect(service.getTaskById(id)?.title, 'Changed');
    });

    test('updateTask is no-op for unknown id', () {
      final before = service.totalCount;
      service.updateTask(
          const CareTask(id: 'ghost', title: 'G', time: '1pm', room: 'R'));
      expect(service.totalCount, before);
    });

    test('deleteTask removes the task', () {
      final id = service.getTasks().first.id;
      final before = service.totalCount;
      service.deleteTask(id);
      expect(service.totalCount, before - 1);
      expect(service.getTaskById(id), isNull);
    });

    test('deleteTask is no-op for unknown id', () {
      final before = service.totalCount;
      service.deleteTask('ghost');
      expect(service.totalCount, before);
    });

    test('completedCount starts at 0', () {
      expect(service.completedCount, 0);
    });

    test('completedCount increases after marking complete', () {
      final id = service.getTasks().first.id;
      final updated = service.getTasks().first.copyWith(isCompleted: true);
      service.updateTask(updated);
      expect(service.completedCount, 1);
    });
  });
}
