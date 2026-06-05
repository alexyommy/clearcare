import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/models/task_model.dart';

void main() {
  group('CareTask', () {
    const base = CareTask(
      id: 't1',
      title: 'Test task',
      time: '9:00 AM',
      room: 'Room 1',
    );

    test('has correct default values', () {
      expect(base.priority, TaskPriority.medium);
      expect(base.category, TaskCategory.other);
      expect(base.isCompleted, false);
      expect(base.notes, isNull);
    });

    test('copyWith updates specified fields', () {
      final updated = base.copyWith(
        title: 'Updated',
        isCompleted: true,
        priority: TaskPriority.high,
      );
      expect(updated.title, 'Updated');
      expect(updated.isCompleted, true);
      expect(updated.priority, TaskPriority.high);
      // unchanged fields
      expect(updated.id, 't1');
      expect(updated.time, '9:00 AM');
      expect(updated.room, 'Room 1');
    });

    test('copyWith with no args returns equivalent task', () {
      final copy = base.copyWith();
      expect(copy.id, base.id);
      expect(copy.title, base.title);
      expect(copy.time, base.time);
      expect(copy.room, base.room);
    });

    test('equality is based on id', () {
      const same = CareTask(id: 't1', title: 'Different', time: '5pm', room: 'X');
      const different = CareTask(id: 't2', title: 'Test task', time: '9:00 AM', room: 'Room 1');
      expect(base, equals(same));
      expect(base, isNot(equals(different)));
    });

    test('hashCode is based on id', () {
      const same = CareTask(id: 't1', title: 'Other', time: '1pm', room: 'Y');
      expect(base.hashCode, same.hashCode);
    });

    test('toString contains id and title', () {
      expect(base.toString(), contains('t1'));
      expect(base.toString(), contains('Test task'));
    });

    test('copyWith can set notes', () {
      final withNotes = base.copyWith(notes: 'Some notes');
      expect(withNotes.notes, 'Some notes');
    });

    test('can copy with category', () {
      final med = base.copyWith(category: TaskCategory.medication);
      expect(med.category, TaskCategory.medication);
    });
  });

  group('TaskPriority', () {
    test('has three values', () {
      expect(TaskPriority.values.length, 3);
    });

    test('contains low, medium, high', () {
      expect(TaskPriority.values, containsAll([
        TaskPriority.low,
        TaskPriority.medium,
        TaskPriority.high,
      ]));
    });
  });

  group('TaskCategory', () {
    test('has seven values', () {
      expect(TaskCategory.values.length, 7);
    });
  });

  group('sampleTasks', () {
    test('is not empty', () {
      expect(sampleTasks, isNotEmpty);
    });

    test('all tasks have non-empty id, title, time, room', () {
      for (final t in sampleTasks) {
        expect(t.id, isNotEmpty);
        expect(t.title, isNotEmpty);
        expect(t.time, isNotEmpty);
        expect(t.room, isNotEmpty);
      }
    });

    test('ids are unique', () {
      final ids = sampleTasks.map((t) => t.id).toSet();
      expect(ids.length, sampleTasks.length);
    });
  });
}
