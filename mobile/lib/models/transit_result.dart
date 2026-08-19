import 'body_position.dart';

class TransitResult {
  final String nowUtc;
  final double tzOffsetHours;
  final double lat;
  final double lon;
  final List<BodyPosition> bodies;

  TransitResult({
    required this.nowUtc,
    required this.tzOffsetHours,
    required this.lat,
    required this.lon,
    required this.bodies,
  });

  factory TransitResult.fromJson(Map<String, dynamic> json) {
    return TransitResult(
      nowUtc: json['now_utc'] as String,
      tzOffsetHours: (json['tz_offset_hours'] as num).toDouble(),
      lat: (json['lat'] as num).toDouble(),
      lon: (json['lon'] as num).toDouble(),
      bodies: (json['bodies'] as List)
          .map((b) => BodyPosition.fromJson(b as Map<String, dynamic>))
          .toList(),
    );
  }
}
