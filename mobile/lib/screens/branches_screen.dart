import 'package:flutter/material.dart';

import '../api/api_client.dart';
import '../models/branch.dart';

class BranchesScreen extends StatefulWidget {
  const BranchesScreen({super.key});

  @override
  State<BranchesScreen> createState() => _BranchesScreenState();
}

class _BranchesScreenState extends State<BranchesScreen> {
  final _api = ApiClient();
  List<Branch>? _branches;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    try {
      final res = await _api.getJson('/v1/branches/list');
      setState(() {
        _branches = (res['branches'] as List)
            .map((b) => Branch.fromJson(b as Map<String, dynamic>))
            .toList();
      });
    } catch (e) {
      setState(() => _error = '$e');
    }
  }

  Future<void> _openBranch(Branch branch) async {
    try {
      final res = await _api.getJson('/v1/branches/${branch.slug}');
      if (!mounted) return;
      Navigator.of(context).push(MaterialPageRoute(
        builder: (_) => Scaffold(
          appBar: AppBar(title: Text(branch.slug)),
          body: SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Text(res['content'] as String? ?? ''),
          ),
        ),
      ));
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('$e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Branches')),
      body: _error != null
          ? Center(child: Text(_error!, style: const TextStyle(color: Colors.red)))
          : _branches == null
              ? const Center(child: CircularProgressIndicator())
              : RefreshIndicator(
                  onRefresh: _load,
                  child: ListView.builder(
                    itemCount: _branches!.length,
                    itemBuilder: (context, i) {
                      final branch = _branches![i];
                      return ListTile(
                        title: Text(branch.slug),
                        subtitle: Text(branch.path),
                        trailing: const Icon(Icons.chevron_right),
                        onTap: () => _openBranch(branch),
                      );
                    },
                  ),
                ),
    );
  }
}
