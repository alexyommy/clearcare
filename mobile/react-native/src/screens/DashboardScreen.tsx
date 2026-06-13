import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth, useTasks } from '../hooks/useStore';
import { getGreeting, formatTime, getCategoryColor } from '../utils/helpers';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';
import { CareTask } from '../types';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { tasks, pendingTasks, completedTasks } = useTasks();

  const greeting = getGreeting(user?.name?.split(' ')[0] ?? 'Caregiver');
  const previewTasks = pendingTasks.slice(0, 3);

  const stats = [
    { label: 'Pending', value: pendingTasks.length, color: Colors.warning },
    { label: 'Completed', value: completedTasks.length, color: Colors.success },
    { label: 'Total', value: tasks.length, color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting} accessibilityRole="header">{greeting}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
        </View>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          {stats.map((s) => (
            <View key={s.label} style={[styles.statCard, { borderTopColor: s.color }]} accessibilityLabel={`${s.label}: ${s.value}`}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Today's tasks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Tasks')}
              accessibilityLabel="View all tasks"
              accessibilityRole="button"
              style={styles.viewAll}
            >
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {previewTasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>All tasks complete! 🎉</Text>
            </View>
          ) : (
            previewTasks.map((task) => (
              <TaskPreviewCard key={task.id} task={task} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} />
            ))
          )}
        </View>

        {/* Quick access */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.quickRow}>
            {[
              { label: 'Calendar', route: 'Calendar', emoji: '📅' },
              { label: 'Profile', route: 'Profile', emoji: '👤' },
              { label: 'Settings', route: 'Settings', emoji: '⚙️' },
            ].map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.quickCard}
                onPress={() => navigation.navigate(item.route)}
                accessibilityLabel={`Go to ${item.label}`}
                accessibilityRole="button"
                activeOpacity={0.8}
              >
                <Text style={styles.quickEmoji}>{item.emoji}</Text>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TaskPreviewCard({ task, onPress }: { task: CareTask; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={onPress}
      accessibilityLabel={`Task: ${task.title}, ${formatTime(task.time)}, ${task.room}`}
      accessibilityRole="button"
      activeOpacity={0.85}
    >
      <View style={[styles.taskDot, { backgroundColor: getCategoryColor(task.category) }]} />
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle} numberOfLines={1}>{task.title}</Text>
        <Text style={styles.taskMeta}>{formatTime(task.time)} · {task.room}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  header: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  greeting: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.white },
  date: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: Spacing.xs },
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
  statValue: { fontSize: FontSizes.xxxl, fontWeight: '800' },
  statLabel: { fontSize: FontSizes.sm, color: Colors.grey600, marginTop: Spacing.xs },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.grey900 },
  viewAll: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
  viewAllText: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '600' },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: { fontSize: FontSizes.md, color: Colors.grey600 },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    minHeight: TouchTarget.minSize,
    ...Shadows.card,
  },
  taskDot: { width: 12, height: 12, borderRadius: 6 },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900 },
  taskMeta: { fontSize: FontSizes.sm, color: Colors.grey600, marginTop: 2 },
  quickRow: { flexDirection: 'row', gap: Spacing.sm },
  quickCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    minHeight: TouchTarget.minSize,
    justifyContent: 'center',
    gap: Spacing.xs,
    ...Shadows.card,
  },
  quickEmoji: { fontSize: 28 },
  quickLabel: { fontSize: FontSizes.sm, color: Colors.grey800, fontWeight: '600' },
});
