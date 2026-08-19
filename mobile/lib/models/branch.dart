class Branch {
  final String slug;
  final String path;

  Branch({required this.slug, required this.path});

  factory Branch.fromJson(Map<String, dynamic> json) {
    return Branch(slug: json['slug'] as String, path: json['path'] as String);
  }
}
