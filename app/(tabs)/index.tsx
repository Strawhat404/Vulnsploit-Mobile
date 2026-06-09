import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@/components/Header';
import { StatCard } from '@/components/StatCard';
import { ScanListItem } from '@/components/ScanListItem';
import { EmptyState } from '@/components/EmptyState';
import { ErrorAlert } from '@/components/ErrorAlert';
import { useScans, useScanStats } from '@/hooks/useScans';
import { parseApiError } from '@/api/errors';
import { colors, spacing } from '@/theme';

const QUICK_LAUNCH = [
  { type: 'quick', label: 'Nmap Quick', color: colors.primary },
  { type: 'full', label: 'Nmap Full', color: colors.primary },
  { type: 'nikto', label: 'Nikto Scan', color: colors.secondary },
  { type: 'subfinder', label: 'Subfinder', color: colors.secondary },
  { type: 'nuclei', label: 'Nuclei', color: colors.warning },
  { type: 'sqlmap', label: 'SQLMap', color: colors.danger },
] as const;

export default function DashboardScreen() {
  const { data: scans, isLoading, isRefetching, error, refetch } = useScans();
  const stats = useScanStats(scans);

  const apiError = error ? parseApiError(error, 'Failed to load scans.') : null;

  return (
    <View style={styles.container}>
      <Header prompt="dashboard" title="COMMAND CENTER" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isLoading}
            onRefresh={() => refetch()}
            tintColor={colors.primary}
          />
        }
      >
        <Pressable style={styles.newScanBtn} onPress={() => router.push('/(tabs)/scan')}>
          <Ionicons name="flash" size={16} color="#fff" />
          <Text style={styles.newScanText}>NEW SCAN</Text>
        </Pressable>

        <View style={styles.statsGrid}>
          <StatCard label="TOTAL SCANS" value={stats.total} color={colors.text} icon="pulse-outline" />
          <StatCard
            label="COMPLETED"
            value={stats.completed}
            color={colors.status.completed}
            icon="checkmark-circle-outline"
          />
          <StatCard
            label="RUNNING"
            value={stats.running}
            color={colors.status.running}
            icon="sync-outline"
          />
          <StatCard
            label="ERRORS"
            value={stats.failed}
            color={colors.status.failed}
            icon="close-circle-outline"
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flash-outline" size={16} color={colors.secondary} />
            <Text style={styles.sectionTitle}>QUICK LAUNCH</Text>
          </View>
          <View style={styles.quickGrid}>
            {QUICK_LAUNCH.map((item) => (
              <Pressable
                key={item.type}
                style={({ pressed }) => [styles.quickItem, pressed && styles.quickItemPressed]}
                onPress={() =>
                  router.push({ pathname: '/(tabs)/scan', params: { type: item.type } })
                }
              >
                <Text style={[styles.quickLabel, { color: item.color }]}>{item.label}</Text>
                <Ionicons name="arrow-forward" size={12} color={colors.textDim} />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-outline" size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>RECENT SCANS</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/history')} hitSlop={8}>
              <Text style={styles.viewAll}>View all →</Text>
            </Pressable>
          </View>

          <View style={styles.listCard}>
            {apiError ? (
              <View style={styles.listBody}>
                <ErrorAlert message={apiError.message} type={apiError.type} />
              </View>
            ) : isLoading ? (
              <View style={styles.listBody}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>Loading scans...</Text>
              </View>
            ) : stats.recent.length === 0 ? (
              <EmptyState
                message="No scans yet. Launch your first scan to populate the command center."
                actionLabel="Launch scan →"
                onAction={() => router.push('/(tabs)/scan')}
              />
            ) : (
              stats.recent.map((scan) => <ScanListItem key={scan.id} scan={scan} />)
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  newScanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  newScanText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  section: { gap: spacing.sm },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2,
  },
  viewAll: {
    color: `${colors.primary}99`,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  quickGrid: { gap: spacing.sm },
  quickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  quickItemPressed: {
    borderColor: `${colors.primary}4D`,
    backgroundColor: `${colors.primary}0D`,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  listCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  listBody: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 12,
  },
});
