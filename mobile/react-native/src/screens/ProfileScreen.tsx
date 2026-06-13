import React, { useState } from 'react';
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
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { tasks } = useTasks();
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
    { label: 'Completed', value: completedCount, color: Colors.success },
    { label: 'Pending', value: pendingCount, color: Colors.warning },
    { label: 'Total', value: totalCount, color: Colors.primary },
  ];

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

          <View style={styles.roleBadge}>
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
          <View style={styles.accountRow}>
            <Text style={styles.accountLabel}>Email</Text>
            <Text style={styles.accountValue}>{user?.email}</Text>
          </View>
          <View style={[styles.accountRow, { borderBottomWidth: 0 }]}>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  avatarSection: { alignItems: 'center', gap: Spacing.sm },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.white },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  name: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.grey900 },
  editBtn: { minWidth: TouchTarget.minSize, alignItems: 'center' },
  editBtnText: { fontSize: 22 },
  nameEditRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'center' },
  nameInput: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.lg,
    color: Colors.grey900,
    minHeight: TouchTarget.minSize,
    minWidth: 160,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: TouchTarget.minSize,
    justifyContent: 'center',
  },
  saveBtnText: { color: Colors.white, fontWeight: '700', fontSize: FontSizes.md },
  email: { fontSize: FontSizes.md, color: Colors.grey600 },
  roleBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  roleBadgeText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700' },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.grey600, letterSpacing: 1 },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderTopWidth: 4,
    ...Shadows.card,
  },
  statValue: { fontSize: FontSizes.xxl, fontWeight: '800' },
  statLabel: { fontSize: FontSizes.sm, color: Colors.grey600, marginTop: Spacing.xs },
  accountCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey100,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
  },
  accountLabel: { fontSize: FontSizes.md, color: Colors.grey600, fontWeight: '600' },
  accountValue: { fontSize: FontSizes.md, color: Colors.grey900 },
  signOutBtn: {
    backgroundColor: Colors.error,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  signOutText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
});
