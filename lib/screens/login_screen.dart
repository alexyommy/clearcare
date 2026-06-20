import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../state/providers.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  bool _isSignUp = false;
  final _nameCtrl = TextEditingController();
  bool _obscurePassword = true;

  static const _primary = Color(0xFF1A5276);

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _nameCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    final notifier = ref.read(authProvider.notifier);
    final bool ok;
    if (_isSignUp) {
      ok = await notifier.signUp(
          _nameCtrl.text.trim(), _emailCtrl.text.trim(), _passwordCtrl.text);
    } else {
      ok = await notifier.signIn(_emailCtrl.text.trim(), _passwordCtrl.text);
    }
    if (ok && mounted) context.go('/dashboard');
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final isLoading = authState.isLoading;
    final error = authState.error;

    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Logo — decorative, excluded from screen reader tree
                ExcludeSemantics(
                  child: Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: _primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Icon(Icons.favorite,
                        color: Colors.white, size: 36),
                  ),
                ),
                const SizedBox(height: 16),
                Semantics(
                  header: true,
                  child: Text(
                    'CareConnect',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.bold,
                          color: _primary,
                        ),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  _isSignUp ? 'Create your account' : 'Welcome back',
                  style: Theme.of(context)
                      .textTheme
                      .bodyLarge
                      ?.copyWith(color: Colors.grey[600]),
                ),
                const SizedBox(height: 32),

                // Form card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.07),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        // Error banner
                        if (error != null) ...[
                          Semantics(
                            liveRegion: true,
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFDEDED),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: const Color(0xFFC0392B)),
                              ),
                              child: Text(
                                error,
                                style: const TextStyle(
                                    color: Color(0xFFC0392B), fontSize: 14),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                        ],

                        // Name field (sign-up only)
                        if (_isSignUp) ...[
                          _buildField(
                            controller: _nameCtrl,
                            label: 'Full name',
                            hint: 'e.g. Alex Caregiver',
                            icon: Icons.person_outline,
                            validator: (v) =>
                                (v == null || v.trim().isEmpty)
                                    ? 'Name is required'
                                    : null,
                          ),
                          const SizedBox(height: 16),
                        ],

                        _buildField(
                          controller: _emailCtrl,
                          label: 'Email address',
                          hint: 'you@example.com',
                          icon: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                          validator: (v) {
                            if (v == null || v.trim().isEmpty) {
                              return 'Email is required';
                            }
                            if (!RegExp(r'\S+@\S+\.\S+').hasMatch(v)) {
                              return 'Enter a valid email';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        _buildField(
                          controller: _passwordCtrl,
                          label: 'Password',
                          hint: _isSignUp
                              ? 'At least 6 characters'
                              : 'Your password',
                          icon: Icons.lock_outline,
                          obscureText: _obscurePassword,
                          suffixIcon: IconButton(
                            icon: Icon(_obscurePassword
                                ? Icons.visibility_outlined
                                : Icons.visibility_off_outlined),
                            onPressed: () => setState(
                                () => _obscurePassword = !_obscurePassword),
                            tooltip: _obscurePassword
                                ? 'Show password'
                                : 'Hide password',
                          ),
                          validator: (v) {
                            if (v == null || v.isEmpty) {
                              return 'Password is required';
                            }
                            if (_isSignUp && v.length < 6) {
                              return 'Must be at least 6 characters';
                            }
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // Submit button
                        SizedBox(
                          height: 52,
                          child: ElevatedButton(
                            onPressed: isLoading ? null : _submit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: _primary,
                              foregroundColor: Colors.white,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12)),
                            ),
                            child: isLoading
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(
                                        color: Colors.white, strokeWidth: 2.5),
                                  )
                                : Text(
                                    _isSignUp ? 'Create account' : 'Sign in',
                                    style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold),
                                  ),
                          ),
                        ),

                        // Demo hint (sign-in only)
                        if (!_isSignUp) ...[
                          const SizedBox(height: 12),
                          Text(
                            'Demo: demo@careconnect.com / demo123',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                                fontSize: 12, color: Colors.grey[500]),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Toggle sign-in / sign-up
                TextButton(
                  onPressed: () {
                    setState(() {
                      _isSignUp = !_isSignUp;
                      _formKey.currentState?.reset();
                    });
                    ref.read(authProvider.notifier).signOut();
                  },
                  child: Text(
                    _isSignUp
                        ? 'Already have an account? Sign in'
                        : "Don't have an account? Sign up",
                    style: const TextStyle(color: _primary),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType? keyboardType,
    bool obscureText = false,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    // Login card is always white, so text must always be dark regardless of
    // the app's dark/light theme mode.
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      validator: validator,
      style: const TextStyle(fontSize: 16, color: Colors.black87),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.black54),
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.black38),
        prefixIcon: Icon(icon, color: Colors.grey[600]),
        suffixIcon: suffixIcon,
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
          borderSide: const BorderSide(color: _primary, width: 2),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}
