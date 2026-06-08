import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 4 — Recon session detail */
export default function ReconDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RECON #{id}</Text>
      <Text style={styles.placeholder}>Phase 4 — progress + per-tool status</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  title: { color: colors.text, fontSize: 22, fontWeight: '800' },
  placeholder: { color: colors.textMuted, marginTop: spacing.md },
});
