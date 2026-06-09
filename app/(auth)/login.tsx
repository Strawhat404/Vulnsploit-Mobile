import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ErrorAlert } from '@/components/ErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import type { ApiError } from '@/api/errors';
import { colors, spacing } from '@/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    const result = await login(username.trim(), password);
    if (result) {
      setError(result);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          <View style={styles.header}>
            <Ionicons name="shield-checkmark-outline" size={48} color={colors.primary} />
            <Text style={styles.brand}>
              <Text style={styles.vuln}>VULN</Text>
              <Text style={styles.sploit}>SPLOIT</Text>
            </Text>
            <Text style={styles.tagline}>SECURE ACCESS TERMINAL</Text>
          </View>

          <View style={styles.form}>
            {error && <ErrorAlert message={error.message} type={error.type} />}

            <View style={styles.field}>
              <Text style={styles.label}>USERNAME</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={colors.textDim}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  placeholder="admin"
                  placeholderTextColor={colors.textDim}
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={styles.inputWrap}>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={colors.textDim}
                  style={styles.inputIcon}
                />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholder="••••••••"
                  placeholderTextColor={colors.textDim}
                  style={styles.input}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={colors.textDim}
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading || !username.trim() || !password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="lock-closed" size={16} color="#fff" />
                  <Text style={styles.buttonText}>ACCESS SYSTEM</Text>
                </>
              )}
            </Pressable>

            <View style={styles.footer}>
              <Text style={styles.footerMuted}>New here? </Text>
              <Link href="/(auth)/register" style={styles.footerLink}>
                Create account →
              </Link>
            </View>
          </View>

          <View style={styles.disclaimer}>
            <Text style={styles.disclaimerText}>
              <Text style={styles.disclaimerPrompt}>$ </Text>
              For authorized penetration testing only
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: `${colors.primary}99`,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 16,
    height: 16,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: `${colors.primary}99`,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: `${colors.primary}99`,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: `${colors.primary}99`,
  },
  header: {
    alignItems: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brand: { fontSize: 24, fontWeight: '900', letterSpacing: 4, marginTop: spacing.md },
  vuln: { color: '#ffffff' },
  sploit: { color: colors.primary },
  tagline: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 3,
    marginTop: spacing.xs,
  },
  form: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  field: { gap: spacing.xs },
  label: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceDeep,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    padding: 0,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: spacing.xs,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  footerMuted: { color: colors.textMuted, fontSize: 12 },
  footerLink: { color: colors.primary, fontSize: 12 },
  disclaimer: {
    backgroundColor: colors.surfaceDeep,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.md,
  },
  disclaimerText: {
    color: colors.textDim,
    fontSize: 11,
    textAlign: 'center',
  },
  disclaimerPrompt: { color: `${colors.primary}80` },
});
