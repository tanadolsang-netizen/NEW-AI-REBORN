import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:astral/main.dart';

void main() {
  testWidgets('Astral app shows bottom navigation with 6 destinations', (WidgetTester tester) async {
    await tester.pumpWidget(const AstralApp());
    await tester.pump();

    expect(find.text('Astral'), findsWidgets);
    expect(find.byType(NavigationBar), findsOneWidget);
    for (final label in ['Home', 'Dashboard', 'Natal', 'Transit', 'Synastry', 'Branches']) {
      expect(find.text(label), findsWidgets);
    }
  });
}
