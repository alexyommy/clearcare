import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'router/app_router.dart';
import 'state/providers.dart';

void main() {
  runApp(const ProviderScope(child: CareConnectApp()));
}

class CareConnectApp extends ConsumerWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(routerProvider);
    final settings = ref.watch(settingsProvider);

    return MaterialApp.router(
      title: 'CareConnect',
      debugShowCheckedModeBanner: false,
      routerConfig: router,
      theme: _buildTheme(settings.fontSize, Brightness.light),
      darkTheme: _buildTheme(settings.fontSize, Brightness.dark),
      themeMode:
          settings.darkMode ? ThemeMode.dark : ThemeMode.light,
    );
  }

  ThemeData _buildTheme(double fontSize, Brightness brightness) {
    final isDark = brightness == Brightness.dark;
    final base = isDark ? ThemeData.dark() : ThemeData.light();

    return base.copyWith(
      useMaterial3: true, // ignore: deprecated_member_use
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF1A5276),
        primary: const Color(0xFF1A5276),
        secondary: const Color(0xFF1E8449),
        error: const Color(0xFFC0392B),
        surface: isDark ? const Color(0xFF121212) : const Color(0xFFFFFFFF),
        brightness: brightness,
      ),
      textTheme: GoogleFonts.robotoTextTheme(base.textTheme).copyWith(
        bodyMedium: GoogleFonts.roboto(fontSize: fontSize),
        bodyLarge: GoogleFonts.roboto(fontSize: fontSize + 2),
        titleMedium: GoogleFonts.roboto(
            fontSize: fontSize, fontWeight: FontWeight.w600),
      ),
    );
  }
}
