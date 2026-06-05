import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/app_settings.dart';
import '../models/task_model.dart';
import '../services/auth_service.dart';
import '../services/task_service.dart';
import 'auth_notifier.dart';
import 'settings_notifier.dart';
import 'task_notifier.dart';

// ── Services (singletons) ─────────────────────────────────────────────────────

final authServiceProvider = Provider<AuthService>((_) => AuthService());
final taskServiceProvider = Provider<TaskService>((_) => TaskService());

// ── State notifiers ───────────────────────────────────────────────────────────

final authProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authServiceProvider));
});

final taskProvider =
    StateNotifierProvider<TaskNotifier, List<CareTask>>((ref) {
  return TaskNotifier(ref.read(taskServiceProvider));
});

final settingsProvider =
    StateNotifierProvider<SettingsNotifier, AppSettings>((ref) {
  return SettingsNotifier();
});
