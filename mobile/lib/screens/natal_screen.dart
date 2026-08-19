import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models/chart_result.dart';
import '../widgets/person_form.dart';

class NatalScreen extends StatefulWidget {
  const NatalScreen({super.key});

  @override
  State<NatalScreen> createState() => _NatalScreenState();
}

class _NatalScreenState extends State<NatalScreen> {
  final _api = ApiClient();
  final _formData = PersonFormData();
  ChartResult? _result;
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _formData.dispose();
    super.dispose();
  }

  Future<void> _compute() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.postJson('/v1/natal/compute', _formData.toJson());
      setState(() => _result = ChartResult.fromJson(res));
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Natal chart')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          PersonFormFields(data: _formData),
          FilledButton(
            onPressed: _loading ? null : _compute,
            child: _loading
                ? const SizedBox(
                    height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Compute chart'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          if (_result != null) ...[
            const SizedBox(height: 24),
            Text('Ascendant', style: Theme.of(context).textTheme.titleMedium),
            ListTile(
              title: Text(_result!.ascendant.sign),
              subtitle: Text('${_result!.ascendant.degree.toStringAsFixed(2)}°'),
            ),
            const SizedBox(height: 16),
            Text('Bodies', style: Theme.of(context).textTheme.titleMedium),
            ..._result!.bodies.map((b) => ListTile(
                  dense: true,
                  title: Text(b.body),
                  trailing: Text('${b.sign} ${b.degree.toStringAsFixed(2)}°'),
                )),
          ],
        ],
      ),
    );
  }
}
