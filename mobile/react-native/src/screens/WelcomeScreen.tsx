import React from 'react';
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
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius } from '../utils/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<Nav>();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  logoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  appName: { fontSize: FontSizes.display, fontWeight: '800', color: Colors.white },
  tagline: { fontSize: FontSizes.md, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 26 },
  actions: { width: '100%', gap: Spacing.md },
  primaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: Colors.primary, fontSize: FontSizes.lg, fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 2,
    borderColor: Colors.white,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '600' },
  footer: { color: 'rgba(255,255,255,0.6)', fontSize: FontSizes.xs, textAlign: 'center' },
});
