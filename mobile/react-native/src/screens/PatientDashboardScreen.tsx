import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAuth, useTasks, usePatients } from '../hooks/useStore';
import { getGreeting, formatTime, getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { Colors, FontSizes, Spacing, BorderRadius, Shadows, TouchTarget } from '../utils/theme';
import { CareTask } from '../types';

export default function PatientDashboardScreen() {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { patients } = usePatients();

  const greeting = getGreeting(user?.name?.split(' ')[0] ?? 'there');

  // In a real app, filter by patientId — for demo show all pending as "my schedule"
  const myTasks = tasks.filter((t) => !t.isCompleted).slice(0, 8);

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
            <ScheduleCard key={task.id} task={task} />
          ))
        )}

        {/* Care team */}
        <Text style={styles.sectionTitle}>Your Care Team</Text>
        <View style={styles.careTeamCard}>
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
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Help?</Text>
          <Text style={styles.infoText}>
            Contact your caregiver or call the nursing station if you need assistance.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ScheduleCard({ task }: { task: CareTask }) {
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  hero: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  greeting: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.white },
  subtitle: { fontSize: FontSizes.md, color: 'rgba(255,255,255,0.85)' },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.grey900,
    marginTop: Spacing.sm,
  },
  empty: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: FontSizes.md, color: Colors.grey600 },
  scheduleCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: TouchTarget.minSize,
    ...Shadows.card,
  },
  scheduleStripe: { width: 6 },
  scheduleBody: { flex: 1, padding: Spacing.md, gap: Spacing.xs },
  scheduleTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scheduleTime: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary },
  categoryBadge: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  categoryBadgeText: { color: Colors.white, fontSize: FontSizes.xs, fontWeight: '700' },
  scheduleTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900 },
  scheduleRoom: { fontSize: FontSizes.sm, color: Colors.grey600 },
  scheduleDesc: { fontSize: FontSizes.sm, color: Colors.grey600, lineHeight: 20 },
  careTeamCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    ...Shadows.card,
  },
  careTeamRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: TouchTarget.minSize },
  careTeamAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  careTeamAvatarText: { color: Colors.white, fontWeight: '800', fontSize: FontSizes.lg },
  careTeamName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.grey900 },
  careTeamRole: { fontSize: FontSizes.sm, color: Colors.grey600 },
  infoCard: {
    backgroundColor: '#EAF4FB',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primaryDark },
  infoText: { fontSize: FontSizes.md, color: Colors.primaryDark, lineHeight: 24 },
});
