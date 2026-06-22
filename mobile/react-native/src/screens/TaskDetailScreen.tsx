import React, { useMemo } from 'react';
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
import { useAppTheme } from '../hooks/useTheme';
import { formatTime, getPriorityColor, getPriorityLabel, getCategoryLabel, getCategoryColor } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';
import { RootStackParamList } from '../types';

type RouteType = RouteProp<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteType>();
  const { taskId } = route.params ?? { taskId: '' };
  const { tasks, toggleTask, deleteTask } = useTasks();
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();

  const task = tasks.find((t) => t.id === taskId);

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
    notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
    notFoundText: { fontSize: fontSizes.lg, color: colors.textMuted },
    backBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      minHeight: TouchTarget.minSize,
      justifyContent: 'center',
    },
    backBtnText: { color: colors.isDark ? colors.black : colors.white, fontSize: fontSizes.md, fontWeight: '700' },
    navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    navBtn: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
    navBtnText: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
    deleteBtn: { minHeight: TouchTarget.minSize, justifyContent: 'center' },
    deleteBtnText: { color: colors.error, fontSize: fontSizes.md, fontWeight: '600' },
    statusBadge: {
      alignSelf: 'flex-start',
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    statusDone: { backgroundColor: '#D5F5E3' },
    statusPending: { backgroundColor: '#FEF9E7' },
    statusText: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.black },
    taskTitle: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, lineHeight: Math.round(fontSizes.xxl * 1.4) },
    chips: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' },
    chip: { borderRadius: borderRadius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
    chipText: { color: colors.white, fontSize: fontSizes.sm, fontWeight: '700' },
    detailCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      ...shadows.card,
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      minHeight: TouchTarget.minSize,
    },
    detailIcon: { fontSize: 24, width: 32, textAlign: 'center' },
    detailContent: { flex: 1 },
    detailLabel: { fontSize: fontSizes.sm, color: colors.textMuted },
    detailValue: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text, marginTop: 2 },
    descCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      gap: spacing.xs,
      ...shadows.card,
    },
    descLabel: { fontSize: fontSizes.sm, color: colors.textMuted, fontWeight: '600' },
    descText: { fontSize: fontSizes.md, color: colors.text, lineHeight: Math.round(fontSizes.md * 1.5) },
    completeBtn: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.md,
    },
    completeBtnDone: { backgroundColor: colors.grey400 },
    completeBtnText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '700' },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

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
            <View key={row.label} style={styles.detailRow} accessibilityLabel={`${row.label}: ${row.value}`}>
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

