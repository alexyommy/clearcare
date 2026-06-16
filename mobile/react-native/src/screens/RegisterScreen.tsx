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

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<Nav>();
  const { signUp, isLoading, error, clearAuthError } = useAuth();

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
                  placeholderTextColor={Colors.grey400}
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
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.registerBtnText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="link">
              <Text style={styles.footerLink}>Sign In</Text>
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
  registerBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.md,
    minHeight: TouchTarget.minSize,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  btnDisabled: { opacity: 0.6 },
  registerBtnText: { color: Colors.white, fontSize: FontSizes.lg, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.md },
  footerText: { color: Colors.grey600, fontSize: FontSizes.md },
  footerLink: { color: Colors.primary, fontSize: FontSizes.md, fontWeight: '700' },
});
