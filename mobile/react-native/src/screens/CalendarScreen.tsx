import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTasks } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { formatTime, getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const upcomingTasks = tasks.filter((t) => !t.isCompleted);

  // Build calendar grid
  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
    header: { alignItems: 'center', gap: spacing.xs },
    headerTitle: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text },
    monthYear: { fontSize: fontSizes.lg, color: colors.primary, fontWeight: '700' },
    dayHeaders: {
      flexDirection: 'row',
      backgroundColor: colors.primary,
      borderRadius: borderRadius.sm,
      paddingVertical: spacing.sm,
    },
    dayHeader: {
      flex: 1,
      textAlign: 'center',
      color: colors.isDark ? colors.black : colors.white,
      fontSize: fontSizes.sm,
      fontWeight: '700',
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      ...shadows.card,
    },
    cell: {
      width: `${100 / 7}%`,
      aspectRatio: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 0.5,
      borderColor: colors.border,
      minHeight: TouchTarget.minSize,
    },
    cellToday: { backgroundColor: colors.surface },
    cellSelected: { backgroundColor: colors.primary },
    cellText: { fontSize: fontSizes.md, color: colors.text },
    cellTextToday: { fontWeight: '800', color: colors.primary },
    cellTextSelected: { color: colors.isDark ? colors.black : colors.white, fontWeight: '800' },
    eventDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 2,
    },
    sectionTitle: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.text },
    empty: { alignItems: 'center', padding: spacing.xl },
    emptyText: { fontSize: fontSizes.md, color: colors.textMuted },
    eventCard: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      flexDirection: 'row',
      overflow: 'hidden',
      minHeight: TouchTarget.minSize,
      ...shadows.card,
    },
    eventStripe: { width: 6 },
    eventBody: { flex: 1, padding: spacing.md, justifyContent: 'center' },
    eventTitle: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    eventMeta: { fontSize: fontSizes.sm, color: colors.textMuted, marginTop: 2 },
  }), [colors, fontSizes, spacing, borderRadius, shadows]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} accessibilityRole="header">Calendar</Text>
          <Text style={styles.monthYear}>{MONTHS[month]} {year}</Text>
        </View>

        {/* Day headers */}
        <View style={styles.dayHeaders}>
          {DAYS.map((d) => (
            <Text key={d} style={styles.dayHeader}>{d}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {cells.map((day, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.cell,
                day === today.getDate() && styles.cellToday,
                day === selectedDay && styles.cellSelected,
              ]}
              onPress={() => day && setSelectedDay(day)}
              disabled={!day}
              accessibilityLabel={day ? `${MONTHS[month]} ${day}` : undefined}
              accessibilityRole={day ? 'button' : 'none'}
              accessibilityState={day === selectedDay ? { selected: true } : undefined}
              activeOpacity={0.7}
            >
              {day ? (
                <>
                  <Text style={[
                    styles.cellText,
                    day === today.getDate() && styles.cellTextToday,
                    day === selectedDay && styles.cellTextSelected,
                  ]}>
                    {day}
                  </Text>
                  {/* Event dot indicator */}
                  {upcomingTasks.length > 0 && day === today.getDate() ? (
                    <View style={styles.eventDot} />
                  ) : null}
                </>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming events */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingTasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No upcoming events</Text>
          </View>
        ) : (
          upcomingTasks.slice(0, 6).map((task) => (
            <View
              key={task.id}
              style={styles.eventCard}
              accessibilityLabel={`${task.title} at ${formatTime(task.time)} in ${task.room}. Category: ${getCategoryLabel(task.category)}`}
            >
              <View style={[styles.eventStripe, { backgroundColor: getCategoryColor(task.category) }]} />
              <View style={styles.eventBody}>
                <Text style={styles.eventTitle}>{task.title}</Text>
                <Text style={styles.eventMeta}>
                  {formatTime(task.time)} · {task.room} · {getCategoryLabel(task.category)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

