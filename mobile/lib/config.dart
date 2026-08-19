/// Backend base URL. Override at build/run time with:
///   flutter run --dart-define=API_BASE_URL=https://api.astral.app
const String apiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:8000',
);
