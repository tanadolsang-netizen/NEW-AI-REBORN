import 'package:flutter/material.dart';

final ThemeData astralLightTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6D5BD0)),
);

final ThemeData astralDarkTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF6D5BD0),
    brightness: Brightness.dark,
  ),
);
