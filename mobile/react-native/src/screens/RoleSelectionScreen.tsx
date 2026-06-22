import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { TouchTarget } from '../utils/theme';

export default function RoleSelectionScreen() {
  const { setRole, user } = useAuth();
  const { colors, fontSizes, spacing, borderRadius } = useAppTheme();

  const roles: { key: 'caregiver' | 'patient'; label: string; description: string; emoji: string }[] = [
    {
      key: 'caregiver',
      label: 'Caregiver',
      description: 'Manage tasks, patients, and care schedules',
      emoji: '🩺',
    },
    {
      key: 'patient',
      label: 'Patient',
      description: 'View your schedule and care updates',
      emoji: '🏥',
    },
  ];

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    container: { flex: 1, padding: spacing.lg, gap: spacing.xl },
    header: { alignItems: 'center', paddingTop: spacing.xl },
    title: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.text, textAlign: 'center' },
    subtitle: { fontSize: fontSizes.md, color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, lineHeight: Math.round(fontSizes.md * 1.5) },
    roles: { gap: spacing.md },
    roleCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.lg,
      padding: spacing.xl,
      alignItems: 'center',
      minHeight: TouchTarget.minSize * 2,
      justifyContent: 'center',
      gap: spacing.sm,
      borderWidth: 2,
      borderColor: colors.border,
    },
    roleEmoji: { fontSize: 48 },
    roleLabel: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.primary },
    roleDesc: { fontSize: fontSizes.md, color: colors.textMuted, textAlign: 'center' },
  }), [colors, fontSizes, spacing, borderRadius]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header">
            Select Your Role
          </Text>
          <Text style={styles.subtitle}>
            Welcome{user?.name ? `, ${user.name}` : ''}! How will you use CareConnect?
          </Text>
        </View>

        <View style={styles.roles}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={styles.roleCard}
              onPress={() => setRole(role.key)}
              accessibilityLabel={`Select ${role.label} role: ${role.description}`}
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              <Text style={styles.roleEmoji}>{role.emoji}</Text>
              <Text style={styles.roleLabel}>{role.label}</Text>
              <Text style={styles.roleDesc}>{role.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

