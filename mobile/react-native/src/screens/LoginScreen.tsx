import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';
import { useAuth } from '../hooks/useStore';
import { useAppTheme } from '../hooks/useTheme';
import { validateEmail, validatePassword } from '../utils/helpers';
import { TouchTarget } from '../utils/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn, isLoading, error, clearAuthError } = useAuth();
  const { colors, fontSizes, spacing, borderRadius } = useAppTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleSignIn = async () => {
    clearAuthError();
    if (!validate()) return;
    await signIn(email, password);
  };

  const styles = useMemo(() => StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flexGrow: 1, padding: spacing.lg, gap: spacing.lg },
    header: { alignItems: 'center', paddingVertical: spacing.lg },
    title: { fontSize: fontSizes.xxxl, fontWeight: '800', color: colors.text },
    subtitle: { fontSize: fontSizes.md, color: colors.textMuted, marginTop: spacing.xs },
    errorBanner: {
      backgroundColor: '#FDEDED',
      borderLeftWidth: 4,
      borderLeftColor: colors.error,
      borderRadius: borderRadius.sm,
      padding: spacing.md,
    },
    errorBannerText: { color: colors.error, fontSize: fontSizes.md, fontWeight: '600' },
    hintBox: {
      backgroundColor: '#EAF4FB',
      borderRadius: borderRadius.sm,
      padding: spacing.md,
      alignItems: 'center',
    },
    hintText: { color: colors.primaryDark, fontSize: fontSizes.sm },
    form: { gap: spacing.md },
    fieldGroup: { gap: spacing.xs },
    label: { fontSize: fontSizes.md, fontWeight: '600', color: colors.text },
    input: {
      backgroundColor: colors.white,
      borderWidth: 1.5,
      borderColor: colors.grey300,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      fontSize: fontSizes.md,
      color: colors.black,
      minHeight: TouchTarget.minSize,
    },
    inputError: { borderColor: colors.error },
    fieldError: { color: colors.error, fontSize: fontSizes.sm },
    signInBtn: {
      backgroundColor: colors.primary,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    btnDisabled: { opacity: 0.6 },
    signInBtnText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '700' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.md },
    footerText: { color: colors.textMuted, fontSize: fontSizes.md },
    footerLink: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '700' },
  }), [colors, fontSizes, spacing, borderRadius]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Sign In
            </Text>
            <Text style={styles.subtitle}>Welcome back to CareConnect</Text>
          </View>

          {/* Server error */}
          {error ? (
            <View
              style={styles.errorBanner}
              accessibilityLiveRegion="polite"
              accessibilityLabel={`Error: ${error}`}
            >
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          {/* Demo hint */}
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>
              Demo: demo@careconnect.com / demo123
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, emailError ? styles.inputError : null]}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.grey400}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                accessibilityLabel="Email address"
                accessibilityHint="Enter your CareConnect email"
              />
              {emailError ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {emailError}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, passwordError ? styles.inputError : null]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.grey400}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                accessibilityLabel="Password"
                accessibilityHint="Enter your password, minimum 6 characters"
              />
              {passwordError ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {passwordError}
                </Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[styles.signInBtn, isLoading && styles.btnDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
              accessibilityLabel="Sign in"
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.signInBtnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Register link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              accessibilityLabel="Create a new account"
              accessibilityRole="link"
            >
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

