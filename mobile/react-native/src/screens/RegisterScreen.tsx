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

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp, isLoading, error, clearAuthError } = useAuth();
  const { colors, fontSizes, spacing, borderRadius } = useAppTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (name.trim().length < 2) {
      setNameError('Name must be at least 2 characters.');
      valid = false;
    } else setNameError('');
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      valid = false;
    } else setEmailError('');
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const handleRegister = async () => {
    clearAuthError();
    if (!validate()) return;
    await signUp(name, email, password);
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
    registerBtn: {
      backgroundColor: colors.secondary,
      borderRadius: borderRadius.md,
      minHeight: TouchTarget.minSize,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    btnDisabled: { opacity: 0.6 },
    registerBtnText: { color: colors.white, fontSize: fontSizes.lg, fontWeight: '700' },
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
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Create Account
            </Text>
            <Text style={styles.subtitle}>Join CareConnect today</Text>
          </View>

          {error ? (
            <View style={styles.errorBanner} accessibilityLiveRegion="polite">
              <Text style={styles.errorBannerText}>{error}</Text>
            </View>
          ) : null}

          <View style={styles.form}>
            {[
              { label: 'Full Name', value: name, setter: setName, err: nameError, placeholder: 'Jane Smith', hint: 'Enter your full name', keyboard: 'default' as const, secure: false },
              { label: 'Email Address', value: email, setter: setEmail, err: emailError, placeholder: 'you@example.com', hint: 'Enter your email address', keyboard: 'email-address' as const, secure: false },
              { label: 'Password', value: password, setter: setPassword, err: passwordError, placeholder: '••••••••', hint: 'Minimum 6 characters', keyboard: 'default' as const, secure: true },
            ].map(({ label, value, setter, err, placeholder, hint, keyboard, secure }) => (
              <View key={label} style={styles.fieldGroup}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={[styles.input, err ? styles.inputError : null]}
                  value={value}
                  onChangeText={setter}
                  placeholder={placeholder}
                  placeholderTextColor={colors.grey400}
                  keyboardType={keyboard}
                  autoCapitalize={keyboard === 'email-address' || secure ? 'none' : 'words'}
                  secureTextEntry={secure}
                  accessibilityLabel={label}
                  accessibilityHint={hint}
                />
                {err ? <Text style={styles.fieldError} accessibilityLiveRegion="polite">{err}</Text> : null}
              </View>
            ))}

            <TouchableOpacity
              style={[styles.registerBtn, isLoading && styles.btnDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
              accessibilityLabel="Create account"
              accessibilityRole="button"
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.registerBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessibilityRole="link"
              accessibilityLabel="Sign in"
            >
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

