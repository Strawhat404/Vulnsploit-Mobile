import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';
import { LEGAL_DISCLAIMER } from '@/constants/scanTypes';

/** Phase 3 — New scan */
export default function NewScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NEW SCAN</Text>
      <Text style={styles.disclaimer}>{LEGAL_DISCLAIMER}</Text>
      <Text style={styles.placeholder}>Phase 3 — target + scan type picker</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  disclaimer: { color: colors.warning, fontSize: 10, marginTop: spacing.md, lineHeight: 16 },
  placeholder: { color: colors.textMuted, marginTop: spacing.lg },
});
