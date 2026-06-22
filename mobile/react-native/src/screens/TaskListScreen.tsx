import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { formatTime, getPriorityColor, getCategoryLabel } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';
import { CareTask } from '../types';

export default function TaskListScreen() {
  const navigation = useNavigation<any>();
  const { pendingTasks, completedTasks, toggleTask } = useTasks();
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();

  const displayedTasks = tab === 'pending' ? pendingTasks : completedTasks;

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.cardBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
    addBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: TouchTarget.minSize,
      justifyContent: 'center',
    },
    addBtnText: { color: colors.isDark ? colors.black : colors.white, fontSize: fontSizes.md, fontWeight: '700' },
    tabs: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
      minHeight: TouchTarget.minSize,
      justifyContent: 'center',
    },
    tabActive: { borderBottomColor: colors.primary },
    tabText: { fontSize: fontSizes.md, color: colors.textMuted, fontWeight: '600' },
    tabTextActive: { color: colors.primary },
    list: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
    taskCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      overflow: 'hidden',
      minHeight: TouchTarget.minSize,
      ...shadows.card,
    },
    priorityStripe: { width: 6 },
    taskBody: { flex: 1, padding: spacing.md, gap: spacing.xs },
    taskTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
    taskTitle: { flex: 1, fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    taskTitleDone: { textDecorationLine: 'line-through', color: colors.textMuted },
    taskMeta: { fontSize: fontSizes.sm, color: colors.textMuted },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
    },
    badgeText: { fontSize: fontSizes.xs, color: colors.textMuted, fontWeight: '600' },
    checkbox: { minWidth: TouchTarget.minSize, alignItems: 'center' },
    checkInner: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkInnerDone: { backgroundColor: colors.success, borderColor: colors.success },
    checkMark: { color: colors.white, fontSize: 16, fontWeight: '700' },
    empty: { flex: 1, alignItems: 'center', paddingTop: spacing.xxl },
    emptyText: { fontSize: fontSizes.lg, color: colors.textMuted },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title} accessibilityRole="header">Tasks</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('TaskDetail', { taskId: 'new' })}
          accessibilityLabel="Add new task"
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <Text style={styles.addBtnText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['pending', 'completed'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
            accessibilityLabel={`${t === 'pending' ? 'Pending' : 'Completed'} tasks tab`}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === t }}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'pending' ? `Pending (${pendingTasks.length})` : `Completed (${completedTasks.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskRow
            task={item}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item.id })}
            onToggle={() => toggleTask(item.id)}
            styles={styles}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {tab === 'pending' ? 'No pending tasks 🎉' : 'No completed tasks yet'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function TaskRow({
  task,
  onPress,
  onToggle,
  styles,
}: {
  task: CareTask;
  onPress: () => void;
  onToggle: () => void;
  styles: any;
}) {
  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={onPress}
      accessibilityLabel={`${task.title}, ${formatTime(task.time)}, ${task.room}. ${task.isCompleted ? 'Completed' : 'Pending'}`}
      accessibilityRole="button"
      activeOpacity={0.85}
    >
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, { backgroundColor: getPriorityColor(task.priority) }]} />

      <View style={styles.taskBody}>
        <View style={styles.taskTop}>
          <Text style={[styles.taskTitle, task.isCompleted && styles.taskTitleDone]} numberOfLines={2}>
            {task.title}
          </Text>
          <TouchableOpacity
            onPress={onToggle}
            style={styles.checkbox}
            accessibilityLabel={task.isCompleted ? 'Mark as pending' : 'Mark as complete'}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: task.isCompleted }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.checkInner, task.isCompleted && styles.checkInnerDone]}>
              {task.isCompleted && <Text style={styles.checkMark}>✓</Text>}
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.taskMeta}>
          {formatTime(task.time)} · {task.room}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getCategoryLabel(task.category)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

