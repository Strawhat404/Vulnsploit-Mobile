import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { FULL_RECON_TOOLS, LEGAL_DISCLAIMER } from '@/constants/scanTypes';

/** Phase 4 — Full recon */
export default function ReconScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FULL RECON</Text>
      <Text style={styles.disclaimer}>{LEGAL_DISCLAIMER}</Text>
      <Text style={styles.tools}>{FULL_RECON_TOOLS.join(' → ')}</Text>
      <Text style={styles.placeholder}>Phase 4 — target form + pipeline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  disclaimer: { color: colors.warning, fontSize: 10, marginTop: spacing.md },
  tools: { color: colors.secondary, fontSize: 10, marginTop: spacing.md },
  placeholder: { color: colors.textMuted, marginTop: spacing.lg },
});
