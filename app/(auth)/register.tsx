import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 1 — Register screen */
export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>CREATE ACCOUNT</Text>
      <Text style={styles.subtitle}>Register (Phase 1)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700', letterSpacing: 2 },
  subtitle: { color: colors.textMuted, marginTop: spacing.md },
});
