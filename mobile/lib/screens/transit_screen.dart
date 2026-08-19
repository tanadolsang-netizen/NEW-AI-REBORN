import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models/transit_result.dart';

class TransitScreen extends StatefulWidget {
  const TransitScreen({super.key});

  @override
  State<TransitScreen> createState() => _TransitScreenState();
}

class _TransitScreenState extends State<TransitScreen> {
  final _api = ApiClient();
  final _tzController = TextEditingController(text: '7');
  final _latController = TextEditingController(text: '13.7563');
  final _lonController = TextEditingController(text: '100.5018');
  TransitResult? _result;
  String? _error;
  bool _loading = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  @override
  void dispose() {
    _tzController.dispose();
    _latController.dispose();
    _lonController.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.getJson('/v1/transit/now', query: {
        'tz': double.tryParse(_tzController.text) ?? 7.0,
        'lat': double.tryParse(_latController.text) ?? 13.7563,
        'lon': double.tryParse(_lonController.text) ?? 100.5018,
      });
      setState(() => _result = TransitResult.fromJson(res));
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Transit')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _tzController,
                  decoration: const InputDecoration(labelText: 'TZ offset (h)'),
                  keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _latController,
                  decoration: const InputDecoration(labelText: 'Lat'),
                  keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: _lonController,
                  decoration: const InputDecoration(labelText: 'Lon'),
                  keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          FilledButton(
            onPressed: _loading ? null : _load,
            child: _loading
                ? const SizedBox(
                    height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Refresh'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          if (_result != null) ...[
            const SizedBox(height: 16),
            Text('As of ${_result!.nowUtc}', style: Theme.of(context).textTheme.bodySmall),
            ..._result!.bodies.map((b) => ListTile(
                  dense: true,
                  title: Text(b.body),
                  trailing: Text(
                    '${b.sign} ${b.degree.toStringAsFixed(2)}°'
                    '${b.isRetrograde == true ? ' ℞' : ''}',
                  ),
                )),
          ],
        ],
      ),
    );
  }
}
