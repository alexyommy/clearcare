import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth, useTasks } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { TouchTarget } from '../utils/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { tasks } = useTasks();
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(user?.name ?? '');

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const totalCount = tasks.length;

  const initials = (user?.name ?? 'U')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  const stats = [
    { label: 'Completed', value: completedCount, color: colors.success },
    { label: 'Pending', value: pendingCount, color: colors.warning },
    { label: 'Total', value: totalCount, color: colors.primary },
  ];

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    avatarSection: { alignItems: 'center', gap: spacing.sm },
    avatarCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.white },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    name: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
    editBtn: { minWidth: TouchTarget.minSize, alignItems: 'center' },
    editBtnText: { fontSize: 22 },
    nameEditRow: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
    nameInput: {
      backgroundColor: colors.cardBg,
      borderWidth: 1.5,
      borderColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      fontSize: fontSizes.lg,
      color: colors.text,
      minHeight: TouchTarget.minSize,
      minWidth: 160,
    },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: TouchTarget.minSize,
      justifyContent: 'center',
    },
    saveBtnText: { color: colors.isDark ? colors.black : colors.white, fontWeight: '700', fontSize: fontSizes.md },
    email: { fontSize: fontSizes.md, color: colors.textMuted },
    roleBadge: {
      backgroundColor: colors.primaryLight,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    roleBadgeText: { color: colors.white, fontSize: fontSizes.sm, fontWeight: '700' },
    sectionTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.textMuted, letterSpacing: 1 },
    statsRow: { flexDirection: 'row', gap: spacing.sm },
    statCard: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
      borderTopWidth: 4,
      ...shadows.card,
    },
    statValue: { fontSize: fontSizes.xxl, fontWeight: '800' },
    statLabel: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: spacing.xs },
    accountCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      ...shadows.card,
    },
    accountRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
    },
    accountLabel: { fontSize: fontSizes.md, color: colors.textMuted, fontWeight: '600' },
    accountValue: { fontSize: fontSizes.md, color: colors.text },
    signOutBtn: {
      backgroundColor: colors.error,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    signOutText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '700' },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle} accessibilityLabel={`Profile avatar for ${user?.name}`} accessibilityRole="image">
            <Text style={styles.avatarText}>{initials}</Text>
          </View>

          {editingName ? (
            <View style={styles.nameEditRow}>
              <TextInput
                style={styles.nameInput}
                value={nameValue}
                onChangeText={setNameValue}
                autoFocus
                accessibilityLabel="Edit your name"
                returnKeyType="done"
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={() => setEditingName(false)}
                accessibilityLabel="Save name"
                accessibilityRole="button"
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.name}>{nameValue || user?.name}</Text>
              <TouchableOpacity
                onPress={() => setEditingName(true)}
                accessibilityLabel="Edit name"
                accessibilityRole="button"
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>✏️</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.email}>{user?.email}</Text>

          <View style={styles.roleBadge} accessibilityLabel={`Role: ${user?.role === 'patient' ? 'Patient' : 'Caregiver'}`}>
            <Text style={styles.roleBadgeText}>
              {user?.role === 'patient' ? '🏥 Patient' : '🩺 Caregiver'}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Task Overview</Text>
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]} accessibilityLabel={`${s.label}: ${s.value}`}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Account section */}
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.accountCard}>
          <View style={styles.accountRow} accessibilityLabel={`Email: ${user?.email}`}>
            <Text style={styles.accountLabel}>Email</Text>
            <Text style={styles.accountValue}>{user?.email}</Text>
          </View>
          <View style={[styles.accountRow, { borderBottomWidth: 0 }]} accessibilityLabel={`Role: ${user?.role === 'patient' ? 'Patient' : 'Caregiver'}`}>
            <Text style={styles.accountLabel}>Role</Text>
            <Text style={styles.accountValue}>{user?.role === 'patient' ? 'Patient' : 'Caregiver'}</Text>
          </View>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={handleSignOut}
          accessibilityLabel="Sign out of CareConnect"
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

