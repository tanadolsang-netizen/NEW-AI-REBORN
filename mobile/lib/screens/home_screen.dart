import 'package:flutter/material.dart';

import '../api/api_client.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.onNavigate});

  /// Jumps the parent bottom-nav to another tab index.
  final void Function(int index) onNavigate;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _api = ApiClient();
  late Future<bool> _health;

  @override
  void initState() {
    super.initState();
    _health = _checkHealth();
  }

  Future<bool> _checkHealth() async {
    try {
      final res = await _api.getReady();
      return res['status'] == 'ok';
    } catch (_) {
      return false;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      appBar: AppBar(title: const Text('Astral')),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('Astral', style: theme.textTheme.headlineMedium),
          const SizedBox(height: 8),
          Text(
            'Natal charts, transits, and synastry — offline astrology on your phone.',
            style: theme.textTheme.bodyLarge,
          ),
          const SizedBox(height: 16),
          FutureBuilder<bool>(
            future: _health,
            builder: (context, snapshot) {
              final ok = snapshot.data == true;
              final loading = snapshot.connectionState != ConnectionState.done;
              return Chip(
                avatar: Icon(
                  loading
                      ? Icons.hourglass_top
                      : (ok ? Icons.check_circle : Icons.error),
                  size: 18,
                  color: loading
                      ? null
                      : (ok ? Colors.green : Colors.red),
                ),
                label: Text(loading
                    ? 'Checking backend…'
                    : (ok ? 'Backend online' : 'Backend unreachable')),
              );
            },
          ),
          const SizedBox(height: 24),
          _FeatureCard(
            icon: Icons.person,
            title: 'Natal chart',
            subtitle: 'Compute planetary positions for a birth time',
            onTap: () => widget.onNavigate(2),
          ),
          _FeatureCard(
            icon: Icons.public,
            title: 'Transit',
            subtitle: 'See where the planets are right now',
            onTap: () => widget.onNavigate(3),
          ),
          _FeatureCard(
            icon: Icons.favorite,
            title: 'Synastry',
            subtitle: 'Compare two charts for cross-aspects',
            onTap: () => widget.onNavigate(4),
          ),
          _FeatureCard(
            icon: Icons.menu_book,
            title: 'Branches',
            subtitle: 'Browse astrological traditions',
            onTap: () => widget.onNavigate(5),
          ),
        ],
      ),
    );
  }
}

class _FeatureCard extends StatelessWidget {
  const _FeatureCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Icon(icon),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
