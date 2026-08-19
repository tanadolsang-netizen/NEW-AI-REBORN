class RecentItem {
  final String name;
  final String datetimeUtc;
  final String system;

  RecentItem({required this.name, required this.datetimeUtc, required this.system});

  factory RecentItem.fromJson(Map<String, dynamic> json) {
    return RecentItem(
      name: json['name'] as String,
      datetimeUtc: json['datetime_utc'] as String,
      system: json['system'] as String,
    );
  }
}
