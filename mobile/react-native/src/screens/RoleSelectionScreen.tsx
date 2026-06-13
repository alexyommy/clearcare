import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../hooks/useStore';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius } from '../utils/theme';

export default function RoleSelectionScreen() {
  const { setRole, user } = useAuth();

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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: Spacing.lg, gap: Spacing.xl },
  header: { alignItems: 'center', paddingTop: Spacing.xl },
  title: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.grey900, textAlign: 'center' },
  subtitle: { fontSize: FontSizes.md, color: Colors.grey600, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 24 },
  roles: { gap: Spacing.md },
  roleCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    minHeight: TouchTarget.minSize * 2,
    justifyContent: 'center',
    gap: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.grey200,
  },
  roleEmoji: { fontSize: 48 },
  roleLabel: { fontSize: FontSizes.xl, fontWeight: '800', color: Colors.primary },
  roleDesc: { fontSize: FontSizes.md, color: Colors.grey600, textAlign: 'center' },
});
