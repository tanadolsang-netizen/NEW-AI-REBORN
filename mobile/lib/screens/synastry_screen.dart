import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models/synastry_result.dart';
import '../widgets/person_form.dart';

class SynastryScreen extends StatefulWidget {
  const SynastryScreen({super.key});

  @override
  State<SynastryScreen> createState() => _SynastryScreenState();
}

class _SynastryScreenState extends State<SynastryScreen> {
  final _api = ApiClient();
  final _personA = PersonFormData(initialName: 'A');
  final _personB = PersonFormData(initialName: 'B');
  SynastryResult? _result;
  String? _error;
  bool _loading = false;

  @override
  void dispose() {
    _personA.dispose();
    _personB.dispose();
    super.dispose();
  }

  Future<void> _compute() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final res = await _api.postJson('/v1/synastry/cross-aspects', {
        'a': _personA.toJson(),
        'b': _personB.toJson(),
      });
      setState(() => _result = SynastryResult.fromJson(res));
    } catch (e) {
      setState(() => _error = '$e');
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Synastry')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          PersonFormFields(data: _personA, label: 'Person A'),
          PersonFormFields(data: _personB, label: 'Person B'),
          FilledButton(
            onPressed: _loading ? null : _compute,
            child: _loading
                ? const SizedBox(
                    height: 18, width: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Compare charts'),
          ),
          if (_error != null) ...[
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: Colors.red)),
          ],
          if (_result != null) ...[
            const SizedBox(height: 24),
            Text('Cross-aspects (${_result!.crossAspects.length})',
                style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Table(
              border: TableBorder.all(color: Theme.of(context).dividerColor),
              columnWidths: const {
                0: FlexColumnWidth(2),
                1: FlexColumnWidth(2),
                2: FlexColumnWidth(2),
                3: FlexColumnWidth(1),
                4: FlexColumnWidth(1),
              },
              children: [
                const TableRow(children: [
                  _CellHeader('A'),
                  _CellHeader('B'),
                  _CellHeader('Aspect'),
                  _CellHeader('Orb'),
                  _CellHeader('Appl.'),
                ]),
                for (final asp in _result!.crossAspects)
                  TableRow(children: [
                    _Cell(asp.bodyA),
                    _Cell(asp.bodyB),
                    _Cell(asp.aspect),
                    _Cell(asp.orb.toStringAsFixed(2)),
                    _Cell(asp.applying ? 'yes' : 'no'),
                  ]),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _CellHeader extends StatelessWidget {
  const _CellHeader(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6),
      child: Text(text, style: const TextStyle(fontWeight: FontWeight.bold)),
    );
  }
}

class _Cell extends StatelessWidget {
  const _Cell(this.text);
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(6),
      child: Text(text),
    );
  }
}
