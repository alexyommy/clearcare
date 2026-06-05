import '../models/user_model.dart';

class AuthException implements Exception {
  final String message;
  const AuthException(this.message);
  @override
  String toString() => message;
}

class AuthService {
  // Pre-seeded demo account — always available
  static const _demoEmail = 'demo@careconnect.com';
  static const _demoPassword = 'demo123';
  static const _demoUser = AppUser(
    id: 'u_demo',
    name: 'Alex Caregiver',
    email: _demoEmail,
  );

  final _store = <String, ({String password, AppUser user})>{
    _demoEmail: (password: _demoPassword, user: _demoUser),
  };

  /// Signs in with [email] and [password]. Throws [AuthException] on failure.
  Future<AppUser> signIn(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    final key = email.trim().toLowerCase();
    final entry = _store[key];
    if (entry == null) {
      throw const AuthException(
          "No account found with that email. Try signing up.");
    }
    if (entry.password != password) {
      throw const AuthException("Incorrect password. Please try again.");
    }
    return entry.user;
  }

  /// Registers a new account. Throws [AuthException] if email already taken.
  Future<AppUser> signUp(
      String name, String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    final key = email.trim().toLowerCase();
    if (_store.containsKey(key)) {
      throw const AuthException(
          "An account already exists with this email. Try signing in.");
    }
    final user = AppUser(
      id: 'u_${DateTime.now().millisecondsSinceEpoch}',
      name: name.trim(),
      email: key,
    );
    _store[key] = (password: password, user: user);
    return user;
  }
}
