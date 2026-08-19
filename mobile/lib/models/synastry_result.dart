import 'chart_result.dart';

class CrossAspect {
  final String bodyA;
  final String bodyB;
  final String aspect;
  final double orb;
  final bool applying;

  CrossAspect({
    required this.bodyA,
    required this.bodyB,
    required this.aspect,
    required this.orb,
    required this.applying,
  });

  factory CrossAspect.fromJson(Map<String, dynamic> json) {
    return CrossAspect(
      bodyA: json['body_a'] as String,
      bodyB: json['body_b'] as String,
      aspect: json['aspect'] as String,
      orb: (json['orb'] as num).toDouble(),
      applying: json['applying'] as bool,
    );
  }
}

class SynastryResult {
  final ChartResult a;
  final ChartResult b;
  final List<CrossAspect> crossAspects;

  SynastryResult({required this.a, required this.b, required this.crossAspects});

  factory SynastryResult.fromJson(Map<String, dynamic> json) {
    return SynastryResult(
      a: ChartResult.fromJson(json['a'] as Map<String, dynamic>),
      b: ChartResult.fromJson(json['b'] as Map<String, dynamic>),
      crossAspects: (json['cross_aspects'] as List)
          .map((c) => CrossAspect.fromJson(c as Map<String, dynamic>))
          .toList(),
    );
  }
}
