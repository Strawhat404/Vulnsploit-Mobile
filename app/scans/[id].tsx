import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 3 — Scan detail + terminal output */
export default function ScanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SCAN #{id}</Text>
      <Text style={styles.placeholder}>Phase 3 — live poll + TerminalOutput</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  placeholder: { color: colors.textMuted, marginTop: spacing.md },
});
