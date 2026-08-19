import 'body_position.dart';

class ChartResult {
  final String name;
  final String datetimeUtc;
  final String system;
  final List<BodyPosition> bodies;
  final BodyPosition ascendant;

  ChartResult({
    required this.name,
    required this.datetimeUtc,
    required this.system,
    required this.bodies,
    required this.ascendant,
  });

  factory ChartResult.fromJson(Map<String, dynamic> json) {
    return ChartResult(
      name: json['name'] as String,
      datetimeUtc: json['datetime_utc'] as String,
      system: json['system'] as String,
      bodies: (json['bodies'] as List)
          .map((b) => BodyPosition.fromJson(b as Map<String, dynamic>))
          .toList(),
      ascendant: BodyPosition.fromJson(json['ascendant'] as Map<String, dynamic>),
    );
  }
}
