import React, { useState } from 'react';
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
import { formatTime, getPriorityColor, getCategoryLabel } from '../utils/helpers';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';
import { CareTask } from '../types';

export default function TaskListScreen() {
  const navigation = useNavigation<any>();
  const { pendingTasks, completedTasks, toggleTask } = useTasks();
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');

  const displayedTasks = tab === 'pending' ? pendingTasks : completedTasks;

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
}: {
  task: CareTask;
  onPress: () => void;
  onToggle: () => void;
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey200,
  },
  title: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.grey900 },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minHeight: TouchTarget.minSize,
    justifyContent: 'center',
  },
  addBtnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey200,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    minHeight: TouchTarget.minSize,
    justifyContent: 'center',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: FontSizes.md, color: Colors.grey600, fontWeight: '600' },
  tabTextActive: { color: Colors.primary },
  list: { padding: Spacing.md, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: TouchTarget.minSize,
    ...Shadows.card,
  },
  priorityStripe: { width: 6 },
  taskBody: { flex: 1, padding: Spacing.md, gap: Spacing.xs },
  taskTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  taskTitle: { flex: 1, fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900 },
  taskTitleDone: { textDecorationLine: 'line-through', color: Colors.grey400 },
  taskMeta: { fontSize: FontSizes.sm, color: Colors.grey600 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.grey100,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: FontSizes.xs, color: Colors.grey600, fontWeight: '600' },
  checkbox: { minWidth: TouchTarget.minSize, alignItems: 'center' },
  checkInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.grey300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInnerDone: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkMark: { color: Colors.white, fontSize: 16, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', paddingTop: Spacing.xxl },
  emptyText: { fontSize: FontSizes.lg, color: Colors.grey600 },
});
