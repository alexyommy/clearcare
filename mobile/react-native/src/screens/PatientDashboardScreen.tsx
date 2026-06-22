import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth, useTasks, usePatients } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { getGreeting, formatTime, getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';
import { CareTask } from '../types';

export default function PatientDashboardScreen() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { patients } = usePatients();
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();

  const greeting = getGreeting(user?.name?.split(' ')[0] ?? 'there');

  // In a real app, filter by patientId — for demo show all pending as "my schedule"
  const myTasks = tasks.filter((t) => !t.isCompleted).slice(0, 8);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
    hero: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      gap: spacing.xs,
    },
    greeting: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.white },
    subtitle: { fontSize: fontSizes.md, color: 'rgba(255,255,255,0.85)' },
    sectionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: '700',
      color: colors.text,
      marginTop: spacing.sm,
    },
    empty: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyText: { fontSize: fontSizes.md, color: colors.textMuted },
    scheduleCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      overflow: 'hidden',
      minHeight: TouchTarget.minSize,
      ...shadows.card,
    },
    scheduleStripe: { width: 6 },
    scheduleBody: { flex: 1, padding: spacing.md, gap: spacing.xs },
    scheduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    scheduleTime: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
    categoryBadge: { borderRadius: borderRadius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
    categoryBadgeText: { color: colors.white, fontSize: fontSizes.xs, fontWeight: '700' },
    scheduleTitle: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    scheduleRoom: { fontSize: fontSizes.sm, color: colors.textMuted },
    scheduleDesc: { fontSize: fontSizes.sm, color: colors.textMuted, lineHeight: Math.round(fontSizes.sm * 1.5) },
    careTeamCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      ...shadows.card,
    },
    careTeamRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: TouchTarget.minSize },
    careTeamAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    careTeamAvatarText: { color: colors.white, fontWeight: '800', fontSize: fontSizes.lg },
    careTeamName: { fontSize: fontSizes.md, fontWeight: '700', color: colors.text },
    careTeamRole: { fontSize: fontSizes.sm, color: colors.textMuted },
    infoCard: {
      backgroundColor: '#EAF4FB',
      borderRadius: borderRadius.md,
      padding: spacing.md,
      gap: spacing.xs,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    infoTitle: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primaryDark },
    infoText: { fontSize: fontSizes.md, color: colors.primaryDark, lineHeight: Math.round(fontSizes.md * 1.5) },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.hero}>
          <Text style={styles.greeting} accessibilityRole="header">{greeting}</Text>
          <Text style={styles.subtitle}>Here's your care schedule for today</Text>
        </View>

        {/* Today's schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        {myTasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No scheduled care tasks for today 🎉</Text>
          </View>
        ) : (
          myTasks.map((task) => (
            <ScheduleCard key={task.id} task={task} styles={styles} />
          ))
        )}

        {/* Care team */}
        <Text style={styles.sectionTitle}>Your Care Team</Text>
        <View style={styles.careTeamCard} accessibilityLabel="Caregiver: Demo Caregiver. Primary Caregiver">
          <View style={styles.careTeamRow}>
            <View style={styles.careTeamAvatar}>
              <Text style={styles.careTeamAvatarText}>DC</Text>
            </View>
            <View>
              <Text style={styles.careTeamName}>Demo Caregiver</Text>
              <Text style={styles.careTeamRole}>Primary Caregiver</Text>
            </View>
          </View>
        </View>

        {/* Info footer */}
        <View style={styles.infoCard} accessibilityLabel="Need Help? Contact your caregiver or call the nursing station if you need assistance.">
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Contact your caregiver or call the nursing station if you need assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScheduleCard({ task, styles }: { task: CareTask; styles: any }) {
  return (
    <View
      style={styles.scheduleCard}
      accessibilityLabel={`${task.title} at ${formatTime(task.time)} in ${task.room}`}
    >
      <View style={[styles.scheduleStripe, { backgroundColor: getCategoryColor(task.category) }]} />
      <View style={styles.scheduleBody}>
        <View style={styles.scheduleTop}>
          <Text style={styles.scheduleTime}>{formatTime(task.time)}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(task.category) }]}>
            <Text style={styles.categoryBadgeText}>{getCategoryLabel(task.category)}</Text>
          </View>
        </View>
        <Text style={styles.scheduleTitle}>{task.title}</Text>
        <Text style={styles.scheduleRoom}>📍 {task.room}</Text>
        {task.description ? (
          <Text style={styles.scheduleDesc}>{task.description}</Text>
        ) : null}
      </View>
    </View>
  );
}

