import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/models/task_model.dart';
import 'package:careconnect_flutter/widgets/task_card.dart';

void main() {
  const task = CareTask(
    id: 't1',
    title: 'Administer medication',
    time: '8:00 AM',
    room: 'Room 204',
    priority: TaskPriority.high,
    category: TaskCategory.medication,
  );

  Widget buildCard({CareTask? t, VoidCallback? onTap}) {
    return MaterialApp(
      home: Scaffold(
        body: TaskCard(
          task: t ?? task,
          fontSize: 18,
          onTap: onTap,
        ),
      ),
    );
  }

  testWidgets('renders task title', (tester) async {
    await tester.pumpWidget(buildCard());
    expect(find.text('Administer medication'), findsOneWidget);
  });

  testWidgets('renders time and room', (tester) async {
    await tester.pumpWidget(buildCard());
    expect(find.textContaining('8:00 AM'), findsOneWidget);
    expect(find.textContaining('Room 204'), findsOneWidget);
  });

  testWidgets('shows unchecked icon when not completed', (tester) async {
    await tester.pumpWidget(buildCard());
    expect(find.byIcon(Icons.radio_button_unchecked), findsOneWidget);
  });

  testWidgets('shows check icon when completed', (tester) async {
    const done =
        CareTask(id: 't2', title: 'Done', time: '1pm', room: 'R', isCompleted: true);
    await tester.pumpWidget(buildCard(t: done));
    expect(find.byIcon(Icons.check_circle), findsOneWidget);
  });

  testWidgets('calls onTap when tapped', (tester) async {
    var tapped = false;
    await tester.pumpWidget(buildCard(onTap: () => tapped = true));
    await tester.tap(find.byType(TaskCard));
    expect(tapped, true);
  });

  testWidgets('has Semantics label', (tester) async {
    await tester.pumpWidget(buildCard());
    final semantics = tester.getSemantics(find.byType(TaskCard));
    expect(semantics.label, isNotEmpty);
  });

  testWidgets('title has strikethrough when completed', (tester) async {
    const done =
        CareTask(id: 't3', title: 'Done task', time: '1pm', room: 'R', isCompleted: true);
    await tester.pumpWidget(buildCard(t: done));
    final textWidget = tester.widget<Text>(
        find.text('Done task'));
    expect(textWidget.style?.decoration, TextDecoration.lineThrough);
  });
}
