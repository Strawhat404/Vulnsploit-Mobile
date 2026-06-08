import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 3 — Scan history */
export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCAN HISTORY</Text>
      <Text style={styles.placeholder}>Phase 3 — paginated list + filters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  placeholder: { color: colors.textMuted, marginTop: spacing.md },
});
