import React, { useState } from 'react';
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
import { validateEmail, validatePassword } from '../utils/helpers';
import { Colors, FontSizes, Spacing, TouchTarget, BorderRadius } from '../utils/theme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<Nav>();
  const { signIn, isLoading, error, clearAuthError } = useAuth();

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
                placeholderTextColor={Colors.grey400}
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
                placeholderTextColor={Colors.grey400}
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
                <ActivityIndicator color={Colors.white} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, padding: Spacing.lg, gap: Spacing.lg },
  header: { alignItems: 'center', paddingVertical: Spacing.lg },
  title: { fontSize: FontSizes.xxxl, fontWeight: '800', color: Colors.grey900 },
  subtitle: { fontSize: FontSizes.md, color: Colors.grey600, marginTop: Spacing.xs },
  errorBanner: {
    backgroundColor: '#FDEDED',
    borderLeftWidth: 4,
    borderLeftColor: Colors.error,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  errorBannerText: { color: Colors.error, fontSize: FontSizes.md, fontWeight: '600' },
  hintBox: {
    backgroundColor: '#EAF4FB',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    alignItems: 'center',
  },
  hintText: { color: Colors.primaryDark, fontSize: FontSizes.sm },
  form: { gap: Spacing.md },
  fieldGroup: { gap: Spacing.xs },
  label: { fontSize: FontSizes.md, fontWeight: '600', color: Colors.grey800 },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.grey300,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.grey900,
    minHeight: TouchTarget.minSize,
  },
  inputError: { borderColor: Colors.error },
  fieldError: { color: Colors.error, fontSize: FontSizes.sm },
  signInBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  signInBtnText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  footerText: { color: Colors.grey600, fontSize: FontSizes.md },
  footerLink: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '700' },
});
