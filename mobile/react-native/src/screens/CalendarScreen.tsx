import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTasks } from '../hooks/useStore';
import { formatTime, getCategoryColor, getCategoryLabel } from '../utils/helpers';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function CalendarScreen() {
  const { tasks } = useTasks();
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
            <View key={task.id} style={styles.eventCard}>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: Spacing.xxl },
  header: { alignItems: 'center', gap: Spacing.xs },
  headerTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.grey900 },
  monthYear: { fontSize: FontSizes.lg, color: Colors.primary, fontWeight: '700' },
  dayHeaders: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    color: Colors.white,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.grey100,
    minHeight: TouchTarget.minSize,
  },
  cellToday: { backgroundColor: Colors.grey100 },
  cellSelected: { backgroundColor: Colors.primary },
  cellText: { fontSize: FontSizes.md, color: Colors.grey800 },
  cellTextToday: { fontWeight: '800', color: Colors.primary },
  cellTextSelected: { color: Colors.white, fontWeight: '800' },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 2,
  },
  sectionTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.grey900 },
  empty: { alignItems: 'center', padding: Spacing.xl },
  emptyText: { fontSize: FontSizes.md, color: Colors.grey600 },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    overflow: 'hidden',
    minHeight: TouchTarget.minSize,
    ...Shadows.card,
  },
  eventStripe: { width: 6 },
  eventBody: { flex: 1, padding: Spacing.md, justifyContent: 'center' },
  eventTitle: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900 },
  eventMeta: { fontSize: FontSizes.sm, color: Colors.grey600, marginTop: 2 },
});
