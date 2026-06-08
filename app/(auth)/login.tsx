import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 1 — Login screen */
export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>
        <Text style={styles.vuln}>VULN</Text>
        <Text style={styles.sploit}>SPLOIT</Text>
      </Text>
      <Text style={styles.subtitle}>Mobile — Login (Phase 1)</Text>
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
  brand: { fontSize: 28, fontWeight: '900', letterSpacing: 4 },
  vuln: { color: '#ffffff' },
  sploit: { color: colors.primary },
  subtitle: { color: colors.textMuted, marginTop: spacing.md, fontSize: 12 },
});
