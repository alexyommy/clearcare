import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Switch,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSettings } from '../hooks/useStore';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius, Shadows } from '../utils/theme';

export default function SettingsScreen() {
  const {
    fontSize,
    highContrast,
    darkMode,
    pushNotifications,
    setFontSize,
    toggleHighContrast,
    toggleDarkMode,
    togglePushNotifications,
  } = useSettings();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle} accessibilityRole="header">Settings</Text>

        {/* Accessibility */}
        <SectionHeader title="ACCESSIBILITY" />
        <View style={styles.card}>
          {/* Font size */}
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowLabel}>Font Size</Text>
              <Text style={styles.rowSub}>{fontSize}sp</Text>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setFontSize(fontSize - 2)}
                accessibilityLabel="Decrease font size"
                accessibilityRole="button"
              >
                <Text style={styles.fontBtnText}>A−</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.fontBtn}
                onPress={() => setFontSize(fontSize + 2)}
                accessibilityLabel="Increase font size"
                accessibilityRole="button"
              >
                <Text style={styles.fontBtnTextLg}>A+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Divider />

          <ToggleRow
            label="High Contrast"
            subtitle="Bold text, thick borders, pure black/white"
            value={highContrast}
            onToggle={toggleHighContrast}
            accessibilityLabel="High contrast mode"
          />

          <Divider />

          <ToggleRow
            label="Dark Mode"
            subtitle="Switch to dark colour scheme"
            value={darkMode}
            onToggle={toggleDarkMode}
            accessibilityLabel="Dark mode"
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="NOTIFICATIONS" />
        <View style={styles.card}>
          <ToggleRow
            label="Push Notifications"
            subtitle="Receive task reminders and alerts"
            value={pushNotifications}
            onToggle={togglePushNotifications}
            accessibilityLabel="Push notifications"
          />
        </View>

        {/* About */}
        <SectionHeader title="ABOUT" />
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <Divider />
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.rowLabel}>Course</Text>
            <Text style={styles.rowValue}>SWEN 661 · Team 2</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function ToggleRow({
  label,
  subtitle,
  value,
  onToggle,
  accessibilityLabel,
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.grey300, true: Colors.primaryLight }}
        thumbColor={value ? Colors.primary : Colors.grey400}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xxl },
  pageTitle: { fontSize: FontSizes.xxl, fontWeight: '800', color: Colors.grey900, marginBottom: Spacing.sm },
  sectionHeader: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.grey600,
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: TouchTarget.minSize,
  },
  rowLeft: { flex: 1, gap: 2 },
  rowLabel: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey900 },
  rowSub: { fontSize: FontSizes.sm, color: Colors.grey600 },
  rowValue: { fontSize: FontSizes.md, color: Colors.grey600 },
  divider: { height: 1, backgroundColor: Colors.grey100, marginHorizontal: Spacing.md },
  fontSizeControls: { flexDirection: 'row', gap: Spacing.sm },
  fontBtn: {
    backgroundColor: Colors.grey100,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: TouchTarget.minSize,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.primary },
  fontBtnTextLg: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.primary },
});
