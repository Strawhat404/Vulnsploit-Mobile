import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '@/theme';

/** Phase 2 — Dashboard */
export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>root@vulnsploit:~$ dashboard</Text>
      <Text style={styles.title}>COMMAND CENTER</Text>
      <Text style={styles.placeholder}>Phase 2 — stats & recent scans</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing.lg, paddingTop: 60 },
  prompt: { color: colors.textMuted, fontSize: 11, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 22, fontWeight: '800', letterSpacing: 2 },
  placeholder: { color: colors.textMuted, marginTop: spacing.md },
});
