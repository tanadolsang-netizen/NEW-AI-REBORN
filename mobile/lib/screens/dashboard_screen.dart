import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models/body_position.dart';
import '../models/recent_item.dart';
import '../models/transit_result.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _api = ApiClient();
  List<RecentItem>? _recent;
  TransitResult? _transit;
  String? _error;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final recentRes = await _api.postJson('/v1/dashboard/recent', {'limit': 5});
      final transitRes = await _api.getJson('/v1/transit/now', query: {
        'lat': 13.8591,
        'lon': 100.5217,
        'tz': 7,
      });
      setState(() {
        _recent = (recentRes['recent'] as List)
            .map((e) => RecentItem.fromJson(e as Map<String, dynamic>))
            .toList();
        _transit = TransitResult.fromJson(transitRes);
        _loading = false;
      });
    } catch (e) {
      setState(() {
        _error = '$e';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Dashboard')),
      body: RefreshIndicator(
        onRefresh: _load,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? ListView(children: [_ErrorTile(message: _error!, onRetry: _load)])
                : ListView(
                    padding: const EdgeInsets.all(16),
                    children: [
                      _StatRow(recentCount: _recent?.length ?? 0, transit: _transit),
                      const SizedBox(height: 24),
                      Text('Recent charts', style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      ...?_recent?.map((r) => Card(
                            child: ListTile(
                              title: Text(r.name),
                              subtitle: Text('${r.system} • ${r.datetimeUtc}'),
                            ),
                          )),
                      const SizedBox(height: 24),
                      Text("Today's transit", style: Theme.of(context).textTheme.titleMedium),
                      const SizedBox(height: 8),
                      ...?_transit?.bodies.take(6).map((b) => _BodyTile(body: b)),
                    ],
                  ),
      ),
    );
  }
}

class _StatRow extends StatelessWidget {
  const _StatRow({required this.recentCount, required this.transit});

  final int recentCount;
  final TransitResult? transit;

  @override
  Widget build(BuildContext context) {
    final retrogradeCount = transit?.bodies.where((b) => b.isRetrograde == true).length ?? 0;
    return Row(
      children: [
        _StatTile(label: 'Recent charts', value: '$recentCount'),
        _StatTile(label: 'Bodies tracked', value: '${transit?.bodies.length ?? 0}'),
        _StatTile(label: 'Retrograde', value: '$retrogradeCount'),
        _StatTile(label: 'Systems', value: '2'),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 4),
          child: Column(
            children: [
              Text(value, style: Theme.of(context).textTheme.headlineSmall),
              const SizedBox(height: 4),
              Text(label, textAlign: TextAlign.center, style: Theme.of(context).textTheme.bodySmall),
            ],
          ),
        ),
      ),
    );
  }
}

class _BodyTile extends StatelessWidget {
  const _BodyTile({required this.body});

  final BodyPosition body;

  @override
  Widget build(BuildContext context) {
    return ListTile(
      dense: true,
      title: Text(body.body),
      trailing: Text(
        '${body.sign} ${body.degree.toStringAsFixed(1)}°'
        '${body.isRetrograde == true ? ' ℞' : ''}',
      ),
    );
  }
}

class _ErrorTile extends StatelessWidget {
  const _ErrorTile({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(Icons.error_outline, size: 40, color: Colors.red),
          const SizedBox(height: 8),
          Text(message, textAlign: TextAlign.center),
          const SizedBox(height: 12),
          FilledButton(onPressed: onRetry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
