import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthState {
  final AppUser? user;
  final bool isLoading;
  final String? error;

  const AuthState({this.user, this.isLoading = false, this.error});

  bool get isLoggedIn => user != null;

  AuthState copyWith({
    AppUser? user,
    bool? isLoading,
    String? error,
    bool clearUser = false,
    bool clearError = false,
  }) =>
      AuthState(
        user: clearUser ? null : (user ?? this.user),
        isLoading: isLoading ?? this.isLoading,
        error: clearError ? null : (error ?? this.error),
      );
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._service) : super(const AuthState());

  final AuthService _service;

  Future<bool> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _service.signIn(email, password);
      state = AuthState(user: user);
      return true;
    } on AuthException catch (e) {
      state = AuthState(error: e.message);
      return false;
    }
  }

  Future<bool> signUp(String name, String email, String password) async {
    state = state.copyWith(isLoading: true, clearError: true);
    try {
      final user = await _service.signUp(name, email, password);
      state = AuthState(user: user);
      return true;
    } on AuthException catch (e) {
      state = AuthState(error: e.message);
      return false;
    }
  }

  void signOut() {
    state = const AuthState();
  }
}
