import React, { useMemo } from 'react';
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
import { useAppTheme } from '../hooks/useTheme';
import { getGreeting, formatTime, getCategoryColor } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';
import { CareTask } from '../types';

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { tasks, pendingTasks, completedTasks } = useTasks();
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();

  const greeting = getGreeting(user?.name?.split(' ')[0] ?? 'Caregiver');
  const previewTasks = pendingTasks.slice(0, 3);

  const stats = [
    { label: 'Pending', value: pendingTasks.length, color: colors.warning },
    { label: 'Completed', value: completedTasks.length, color: colors.success },
    { label: 'Total', value: tasks.length, color: colors.primary },
  ];

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    header: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
    },
    greeting: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.white },
    date: { fontSize: fontSizes.sm, color: 'rgba(255,255,255,0.8)', marginTop: spacing.xs },
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
    statValue: { fontSize: fontSizes.xxxl, fontWeight: '800' },
    statLabel: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: spacing.xs },
    section: { gap: spacing.sm },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sectionTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
    viewAll: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
    viewAllText: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
    emptyCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.xl,
      alignItems: 'center',
    },
    emptyText: { fontSize: fontSizes.md, color: colors.textMuted },
    taskCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      minHeight: TouchTarget.minSize,
      ...shadows.card,
    },
    taskDot: { width: 12, height: 12, borderRadius: 6 },
    taskInfo: { flex: 1 },
    taskTitle: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    taskMeta: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: 2 },
    quickRow: { flexDirection: 'row', gap: spacing.sm },
    quickCard: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      alignItems: 'center',
      minHeight: TouchTarget.minSize,
      justifyContent: 'center',
      gap: spacing.xs,
      ...shadows.card,
    },
    quickEmoji: { fontSize: 28 },
    quickLabel: { fontSize: fontSizes.sm, color: colors.text, fontWeight: '600' },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

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
              <TaskPreviewCard key={task.id} task={task} onPress={() => navigation.navigate('TaskDetail', { taskId: task.id })} styles={styles} />
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

function TaskPreviewCard({ task, onPress, styles }: { task: CareTask; onPress: () => void; styles: any }) {
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

