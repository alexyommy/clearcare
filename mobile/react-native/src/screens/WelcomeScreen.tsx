import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAppTheme } from '../hooks/useTheme';
import { TouchTarget } from '../utils/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const { colors, fontSizes, spacing, borderRadius, isDark } = useAppTheme();

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: isDark ? colors.background : colors.primary },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
    },
    logoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
    logoCircle: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: { fontSize: 36, fontWeight: '800', color: colors.primary },
    appName: { fontSize: fontSizes.display, fontWeight: '800', color: colors.white },
    tagline: { fontSize: fontSizes.md, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26 },
    actions: { width: '100%', gap: spacing.md },
    primaryBtn: {
      backgroundColor: colors.white,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnText: { color: colors.primary, fontSize: fontSizes.lg, fontWeight: '700' },
    secondaryBtn: {
      borderWidth: 2,
      borderColor: colors.white,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
    },
    secondaryBtnText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '600' },
    footer: { color: 'rgba(255,255,255,0.6)', fontSize: fontSizes.xs, textAlign: 'center' },
  }), [colors, fontSizes, spacing, borderRadius, isDark]);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.container}>
        {/* Logo area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle} accessibilityRole="image" accessibilityLabel="CareConnect logo">
            <Text style={styles.logoText}>CC</Text>
          </View>
          <Text style={styles.appName}>CareConnect</Text>
          <Text style={styles.tagline}>Low-vision care coordination{'\n'}for caregivers and patients</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Login')}
            accessibilityLabel="Sign in to CareConnect"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Register')}
            accessibilityLabel="Create a new CareConnect account"
            accessibilityRole="button"
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>
          SWEN 661 · UMGC Team 2 · Spring 2026
        </Text>
      </View>
    </SafeAreaView>
  );
}

