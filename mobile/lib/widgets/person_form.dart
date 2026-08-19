import 'package:flutter/material.dart';

/// Holds the input state for one person's birth data (name/date/time/tz/lat/lon/system).
/// Shared between the natal and synastry screens, which both POST a
/// ChartRequest-shaped body to astral-backend.
class PersonFormData {
  PersonFormData({String initialName = ''})
      : nameController = TextEditingController(text: initialName),
        dateController = TextEditingController(text: '1990-05-15'),
        timeController = TextEditingController(text: '14:30:00'),
        tzController = TextEditingController(text: '7'),
        latController = TextEditingController(text: '13.7563'),
        lonController = TextEditingController(text: '100.5018');

  final TextEditingController nameController;
  final TextEditingController dateController;
  final TextEditingController timeController;
  final TextEditingController tzController;
  final TextEditingController latController;
  final TextEditingController lonController;
  String system = 'tropical';

  Map<String, dynamic> toJson() {
    return {
      'name': nameController.text,
      'date': dateController.text,
      'time': timeController.text,
      'tz_offset_hours': double.tryParse(tzController.text) ?? 7.0,
      'lat': double.tryParse(latController.text) ?? 13.7563,
      'lon': double.tryParse(lonController.text) ?? 100.5018,
      'system': system,
    };
  }

  void dispose() {
    nameController.dispose();
    dateController.dispose();
    timeController.dispose();
    tzController.dispose();
    latController.dispose();
    lonController.dispose();
  }
}

class PersonFormFields extends StatefulWidget {
  const PersonFormFields({super.key, required this.data, this.label});

  final PersonFormData data;
  final String? label;

  @override
  State<PersonFormFields> createState() => _PersonFormFieldsState();
}

class _PersonFormFieldsState extends State<PersonFormFields> {
  @override
  Widget build(BuildContext context) {
    final d = widget.data;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Text(widget.label!, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
        ],
        TextField(
          controller: d.nameController,
          decoration: const InputDecoration(labelText: 'Name'),
        ),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: d.dateController,
                decoration: const InputDecoration(labelText: 'Date (YYYY-MM-DD)'),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: d.timeController,
                decoration: const InputDecoration(labelText: 'Time (HH:MM:SS)'),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: TextField(
                controller: d.tzController,
                decoration: const InputDecoration(labelText: 'TZ offset (h)'),
                keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: d.latController,
                decoration: const InputDecoration(labelText: 'Lat'),
                keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: TextField(
                controller: d.lonController,
                decoration: const InputDecoration(labelText: 'Lon'),
                keyboardType: const TextInputType.numberWithOptions(signed: true, decimal: true),
              ),
            ),
          ],
        ),
        DropdownButtonFormField<String>(
          initialValue: d.system,
          decoration: const InputDecoration(labelText: 'System'),
          items: const [
            DropdownMenuItem(value: 'tropical', child: Text('Tropical')),
            DropdownMenuItem(value: 'sidereal', child: Text('Sidereal')),
          ],
          onChanged: (v) => setState(() => d.system = v ?? 'tropical'),
        ),
        const SizedBox(height: 16),
      ],
    );
  }
}
