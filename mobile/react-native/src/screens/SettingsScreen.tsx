import React, { useMemo } from 'react';
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
import { useAppTheme } from '../hooks/useTheme';
import { TouchTarget } from '../utils/theme';

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

  const { colors, fontSizes, spacing, borderRadius, shadows } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xxl },
    pageTitle: { fontSize: fontSizes.xxl, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
    sectionHeader: {
      fontSize: fontSizes.sm,
      fontWeight: '700',
      color: colors.textMuted,
      letterSpacing: 1,
      marginTop: spacing.md,
      marginBottom: spacing.xs,
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: borderRadius.md,
      overflow: 'hidden',
      borderWidth: highContrast ? 2 : 0,
      borderColor: colors.border,
      ...shadows.card,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: TouchTarget.minSize,
    },
    rowLeft: { flex: 1, gap: 2 },
    rowLabel: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    rowSub: { fontSize: fontSizes.sm, color: colors.textMuted },
    rowValue: { fontSize: fontSizes.md, color: colors.textMuted },
    divider: { height: 1, backgroundColor: colors.border, marginHorizontal: spacing.md },
    fontSizeControls: { flexDirection: 'row', gap: spacing.sm },
    fontBtn: {
      backgroundColor: darkMode ? colors.surface : colors.border,
      borderRadius: borderRadius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minWidth: TouchTarget.minSize,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fontBtnText: { fontSize: fontSizes.md, fontWeight: '700', color: colors.primary },
    fontBtnTextLg: { fontSize: fontSizes.lg, fontWeight: '700', color: colors.primary },
  }), [colors, fontSizes, spacing, borderRadius, shadows, highContrast, darkMode]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle} accessibilityRole="header">Settings</Text>

        {/* Accessibility */}
        <SectionHeader title="ACCESSIBILITY" styles={styles} />
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

          <Divider styles={styles} />

          <ToggleRow
            label="High Contrast"
            subtitle="Bold text, thick borders, pure black/white"
            value={highContrast}
            onToggle={toggleHighContrast}
            accessibilityLabel="High contrast mode"
            styles={styles}
            colors={colors}
          />

          <Divider styles={styles} />

          <ToggleRow
            label="Dark Mode"
            subtitle="Switch to dark colour scheme"
            value={darkMode}
            onToggle={toggleDarkMode}
            accessibilityLabel="Dark mode"
            styles={styles}
            colors={colors}
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="NOTIFICATIONS" styles={styles} />
        <View style={styles.card}>
          <ToggleRow
            label="Push Notifications"
            subtitle="Receive task reminders and alerts"
            value={pushNotifications}
            onToggle={togglePushNotifications}
            accessibilityLabel="Push notifications"
            styles={styles}
            colors={colors}
          />
        </View>

        {/* About */}
        <SectionHeader title="ABOUT" styles={styles} />
        <View style={styles.card}>
          <View style={styles.row} accessibilityLabel={`App Version: 1.0.0`}>
            <Text style={styles.rowLabel}>App Version</Text>
            <Text style={styles.rowValue}>1.0.0</Text>
          </View>
          <Divider styles={styles} />
          <View style={[styles.row, { borderBottomWidth: 0 }]} accessibilityLabel={`Course: SWEN 661, Team 2`}>
            <Text style={styles.rowLabel}>Course</Text>
            <Text style={styles.rowValue}>SWEN 661 · Team 2</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title, styles }: { title: string; styles: any }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function Divider({ styles }: { styles: any }) {
  return <View style={styles.divider} />;
}

function ToggleRow({
  label,
  subtitle,
  value,
  onToggle,
  accessibilityLabel,
  styles,
  colors,
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: () => void;
  accessibilityLabel: string;
  styles: any;
  colors: any;
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
        trackColor={{ false: colors.grey300, true: colors.primaryLight }}
        thumbColor={value ? colors.primary : colors.grey400}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      />
    </View>
  );
}

