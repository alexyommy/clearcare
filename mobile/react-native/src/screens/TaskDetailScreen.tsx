import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTasks } from '../hooks/useStore';
import { formatTime, getPriorityColor, getPriorityLabel, getCategoryLabel, getCategoryColor } from '../utils/helpers';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const { taskId } = route.params ?? { taskId: '' };
  const { tasks, toggleTask, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Task not found</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteTask(task.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const rows: { icon: string; label: string; value: string }[] = [
    { icon: '🕐', label: 'Time', value: formatTime(task.time) },
    { icon: '📍', label: 'Location', value: task.room },
    { icon: '🏷️', label: 'Category', value: getCategoryLabel(task.category) },
    { icon: '⚡', label: 'Priority', value: getPriorityLabel(task.priority) },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Nav row */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.navBtn}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.navBtnText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={handleDelete}
            accessibilityLabel="Delete task"
            accessibilityRole="button"
          >
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Status badge */}
        <View style={[styles.statusBadge, task.isCompleted ? styles.statusDone : styles.statusPending]}>
          <Text style={styles.statusText}>{task.isCompleted ? '✓ Completed' : '⏳ Pending'}</Text>
        </View>

        {/* Title */}
        <Text style={styles.taskTitle} accessibilityRole="header">{task.title}</Text>

        {/* Priority + category */}
        <View style={styles.chips}>
          <View style={[styles.chip, { backgroundColor: getPriorityColor(task.priority) }]}>
            <Text style={styles.chipText}>{getPriorityLabel(task.priority)} Priority</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: getCategoryColor(task.category) }]}>
            <Text style={styles.chipText}>{getCategoryLabel(task.category)}</Text>
          </View>
        </View>

        {/* Detail rows */}
        <View style={styles.detailCard}>
          {rows.map((row) => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{row.icon}</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Description */}
        {task.description ? (
          <View style={styles.descCard}>
            <Text style={styles.descLabel}>Notes</Text>
            <Text style={styles.descText}>{task.description}</Text>
          </View>
        ) : null}

        {/* Complete button */}
        <TouchableOpacity
          style={[styles.completeBtn, task.isCompleted && styles.completeBtnDone]}
          onPress={() => toggleTask(task.id)}
          accessibilityLabel={task.isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <Text style={styles.completeBtnText}>
            {task.isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  notFoundText: { fontSize: FontSizes.lg, color: Colors.grey600 },
  backBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    minHeight: TouchTarget.minSize,
    justifyContent: 'center',
  },
  backBtnText: { color: Colors.white, fontSize: FontSizes.md, fontWeight: '700' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  navBtn: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
  navBtnText: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '600' },
  deleteBtn: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
  deleteBtnText: { color: Colors.error, fontSize: FontSizes.md, fontWeight: '600' },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  statusDone: { backgroundColor: '#D5F5E3' },
  statusPending: { backgroundColor: '#FEF9E7' },
  statusText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.grey800 },
  taskTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.grey900, lineHeight: 34 },
  chips: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  chip: { borderRadius: BorderRadius.full, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  chipText: { color: Colors.white, fontSize: FontSizes.sm, fontWeight: '700' },
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey100,
    minHeight: TouchTarget.minSize,
  },
  detailIcon: { fontSize: 24, width: 32, textAlign: 'center' },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: FontSizes.sm, color: Colors.grey600 },
  detailValue: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900, marginTop: 2 },
  descCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.xs,
    ...Shadows.card,
  },
  descLabel: { fontSize: FontSizes.sm, color: Colors.grey600, fontWeight: '600' },
  descText: { fontSize: FontSizes.md, color: Colors.grey800, lineHeight: 24 },
  completeBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  completeBtnDone: { backgroundColor: Colors.grey400 },
  completeBtnText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
});
