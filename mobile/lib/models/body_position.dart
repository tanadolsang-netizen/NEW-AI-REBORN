class BodyPosition {
  final String body;
  final String sign;
  final double degree;
  final double absoluteDeg;
  final bool? isRetrograde;

  BodyPosition({
    required this.body,
    required this.sign,
    required this.degree,
    required this.absoluteDeg,
    this.isRetrograde,
  });

  factory BodyPosition.fromJson(Map<String, dynamic> json) {
    return BodyPosition(
      body: json['body'] as String,
      sign: json['sign'] as String,
      degree: (json['degree'] as num).toDouble(),
      absoluteDeg: (json['absolute_deg'] as num).toDouble(),
      isRetrograde: json['is_retrograde'] as bool?,
    );
  }
}
