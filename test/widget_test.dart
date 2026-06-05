// Smoke test — verifies the app boots without crashing.
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect_flutter/main.dart';

void main() {
  testWidgets('CareConnect smoke test — app boots without error',
      (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: CareConnectApp()),
    );
    // App must render without throwing
    expect(tester.takeException(), isNull);
  });
}
