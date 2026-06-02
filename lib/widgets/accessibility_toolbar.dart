import 'package:flutter/material.dart';
import '../models/app_state.dart';

class AccessibilityToolbar extends StatelessWidget {
  final AppState appState;

  const AccessibilityToolbar({
    super.key,
    required this.appState,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      color: const Color(0xFF1A5276),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _ToolbarButton(
            onTap: appState.decreaseFontSize,
            child: const Text(
              'A-',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          _ToolbarButton(
            onTap: appState.increaseFontSize,
            child: const Text(
              'A+',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          _ToolbarButton(
            onTap: appState.toggleHighContrast,
            child: Icon(
              appState.highContrast ? Icons.contrast : Icons.contrast_outlined,
              color: Colors.white,
              size: 28,
            ),
          ),
        ],
      ),
    );
  }
}

class _ToolbarButton extends StatelessWidget {
  final VoidCallback onTap;
  final Widget child;

  const _ToolbarButton({required this.onTap, required this.child});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: SizedBox(
        width: 60,
        height: 60,
        child: Center(child: child),
      ),
    );
  }
}
