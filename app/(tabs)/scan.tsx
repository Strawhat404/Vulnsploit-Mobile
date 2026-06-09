import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/Header';
import { colors, spacing } from '@/theme';
import { LEGAL_DISCLAIMER } from '@/constants/scanTypes';

/** Phase 3 — New scan (quick-launch `?type=` wired from dashboard) */
export default function NewScanScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();

  return (
    <View style={styles.container}>
      <Header prompt="scan" title="NEW SCAN" />
      <View style={styles.body}>
        <Text style={styles.disclaimer}>{LEGAL_DISCLAIMER}</Text>
        {type ? (
          <View style={styles.preselected}>
            <Text style={styles.preselectedLabel}>PRE-SELECTED TYPE</Text>
            <Text style={styles.preselectedValue}>{type}</Text>
          </View>
        ) : null}
        <Text style={styles.placeholder}>Phase 3 — target input + scan type picker</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1, padding: spacing.lg },
  disclaimer: {
    color: colors.warning,
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  preselected: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.primary}4D`,
    borderRadius: 8,
    backgroundColor: `${colors.primary}0D`,
  },
  preselectedLabel: {
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 4,
  },
  preselectedValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  placeholder: { color: colors.textMuted, marginTop: spacing.lg },
});
