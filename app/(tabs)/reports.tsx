import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 5 — Reports list */
export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>REPORTS</Text>
      <Text style={styles.placeholder}>Phase 5 — findings + PDF download</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  placeholder: { color: colors.textMuted, marginTop: spacing.md },
});
