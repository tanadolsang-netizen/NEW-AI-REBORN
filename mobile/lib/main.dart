import 'package:flutter/material.dart';

import 'screens/branches_screen.dart';
import 'screens/dashboard_screen.dart';
import 'screens/home_screen.dart';
import 'screens/natal_screen.dart';
import 'screens/synastry_screen.dart';
import 'screens/transit_screen.dart';
import 'theme.dart';

void main() {
  runApp(const AstralApp());
}

class AstralApp extends StatefulWidget {
  const AstralApp({super.key});

  @override
  State<AstralApp> createState() => _AstralAppState();
}

class _AstralAppState extends State<AstralApp> {
  ThemeMode _themeMode = ThemeMode.system;

  void _toggleTheme() {
    setState(() {
      _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Astral',
      debugShowCheckedModeBanner: false,
      theme: astralLightTheme,
      darkTheme: astralDarkTheme,
      themeMode: _themeMode,
      home: RootShell(onToggleTheme: _toggleTheme),
    );
  }
}

class RootShell extends StatefulWidget {
  const RootShell({super.key, required this.onToggleTheme});

  final VoidCallback onToggleTheme;

  @override
  State<RootShell> createState() => _RootShellState();
}

class _RootShellState extends State<RootShell> {
  int _index = 0;

  void _navigate(int index) => setState(() => _index = index);

  @override
  Widget build(BuildContext context) {
    final screens = [
      HomeScreen(onNavigate: _navigate),
      const DashboardScreen(),
      const NatalScreen(),
      const TransitScreen(),
      const SynastryScreen(),
      const BranchesScreen(),
    ];

    return Scaffold(
      body: IndexedStack(index: _index, children: screens),
      floatingActionButton: FloatingActionButton.small(
        onPressed: widget.onToggleTheme,
        tooltip: 'Toggle theme',
        child: const Icon(Icons.brightness_6),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _index,
        onDestinationSelected: _navigate,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), selectedIcon: Icon(Icons.dashboard), label: 'Dashboard'),
          NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Natal'),
          NavigationDestination(icon: Icon(Icons.public_outlined), selectedIcon: Icon(Icons.public), label: 'Transit'),
          NavigationDestination(icon: Icon(Icons.favorite_border), selectedIcon: Icon(Icons.favorite), label: 'Synastry'),
          NavigationDestination(icon: Icon(Icons.menu_book_outlined), selectedIcon: Icon(Icons.menu_book), label: 'Branches'),
        ],
      ),
    );
  }
}
