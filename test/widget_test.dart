import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/main.dart';

void main() {
  testWidgets('CareConnect smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const CareConnectApp());
    expect(find.text('CareConnect'), findsOneWidget);
  });
}
