import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/models/user_model.dart';

void main() {
  group('AppUser', () {
    const u = AppUser(id: 'u1', name: 'Alex', email: 'alex@test.com');

    test('constructor sets all fields', () {
      expect(u.id, 'u1');
      expect(u.name, 'Alex');
      expect(u.email, 'alex@test.com');
    });

    test('copyWith updates name', () {
      final updated = u.copyWith(name: 'Bob');
      expect(updated.name, 'Bob');
      expect(updated.id, 'u1');
      expect(updated.email, 'alex@test.com');
    });

    test('copyWith updates email', () {
      final updated = u.copyWith(email: 'new@test.com');
      expect(updated.email, 'new@test.com');
      expect(updated.name, 'Alex');
    });

    test('equality is by id', () {
      const same = AppUser(id: 'u1', name: 'Different', email: 'other@x.com');
      const diff = AppUser(id: 'u2', name: 'Alex', email: 'alex@test.com');
      expect(u, equals(same));
      expect(u, isNot(equals(diff)));
    });

    test('hashCode is by id', () {
      const same = AppUser(id: 'u1', name: 'Other', email: 'x@x.com');
      expect(u.hashCode, same.hashCode);
    });

    test('toString contains id name and email', () {
      final s = u.toString();
      expect(s, contains('u1'));
      expect(s, contains('Alex'));
      expect(s, contains('alex@test.com'));
    });
  });
}
