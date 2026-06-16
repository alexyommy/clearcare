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
      theme: _buildTheme(
          settings.fontSize, Brightness.light, settings.highContrast),
      darkTheme: _buildTheme(
          settings.fontSize, Brightness.dark, settings.highContrast),
      themeMode: settings.darkMode ? ThemeMode.dark : ThemeMode.light,
    );
  }

  ThemeData _buildTheme(
      double fontSize, Brightness brightness, bool highContrast) {
    final isDark = brightness == Brightness.dark;
    final base = isDark ? ThemeData.dark() : ThemeData.light();

    // High-contrast overrides: heavier borders, stronger text weight,
    // slightly larger font bump, and a pure-black/white surface pair.
    final hcCardColor =
        isDark ? const Color(0xFF000000) : const Color(0xFFFFFFFF);
    final hcSurface =
        isDark ? const Color(0xFF000000) : const Color(0xFFFFFFFF);
    final hcOnSurface =
        isDark ? const Color(0xFFFFFFFF) : const Color(0xFF000000);

    final cardTheme = highContrast
        ? CardThemeData(
            color: hcCardColor,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
              side: BorderSide(
                  color: isDark ? Colors.white : Colors.black, width: 2),
            ),
          )
        : null;

    return base.copyWith(
      useMaterial3: true, // ignore: deprecated_member_use
      cardTheme: cardTheme,
      colorScheme: ColorScheme.fromSeed(
        seedColor: const Color(0xFF1A5276),
        primary: const Color(0xFF1A5276),
        secondary: const Color(0xFF1E8449),
        error: const Color(0xFFC0392B),
        surface: highContrast
            ? hcSurface
            : (isDark ? const Color(0xFF121212) : const Color(0xFFFFFFFF)),
        onSurface: highContrast ? hcOnSurface : null,
        brightness: brightness,
      ),
      textTheme: GoogleFonts.robotoTextTheme(base.textTheme).copyWith(
        bodyMedium: GoogleFonts.roboto(
          fontSize: fontSize,
          fontWeight: highContrast ? FontWeight.w700 : FontWeight.normal,
        ),
        bodyLarge: GoogleFonts.roboto(
          fontSize: fontSize + 2,
          fontWeight: highContrast ? FontWeight.w700 : FontWeight.normal,
        ),
        titleMedium: GoogleFonts.roboto(
          fontSize: fontSize,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}
