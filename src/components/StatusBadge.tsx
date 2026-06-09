import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme';
import type { ScanResult, ScanStatus } from '@/types/api';

export function getScanStatus(scan: Pick<ScanResult, 'status' | 'result'> | string | null | undefined): ScanStatus {
  if (!scan) return 'pending';
  if (typeof scan === 'string') {
    if (!scan || scan.startsWith('Scan')) return 'running';
    if (scan.startsWith('Error') || scan.startsWith('Scan execution error')) return 'failed';
    return 'completed';
  }

  if (scan.status) return scan.status;

  const result = scan.result;
  if (!result || result.startsWith('Scan')) return 'running';
  if (result.startsWith('Error') || result.startsWith('Scan execution error')) return 'failed';
  return 'completed';
}

const STATUS_CONFIG: Record<
  ScanStatus,
  { label: string; color: string; icon: keyof typeof Ionicons.glyphMap; spin?: boolean }
> = {
  pending: { label: 'PENDING', color: colors.status.pending, icon: 'time-outline' },
  running: { label: 'RUNNING', color: colors.status.running, icon: 'sync-outline', spin: true },
  completed: { label: 'DONE', color: colors.status.completed, icon: 'checkmark-circle-outline' },
  failed: { label: 'FAILED', color: colors.status.failed, icon: 'close-circle-outline' },
};

interface StatusBadgeProps {
  scan: Pick<ScanResult, 'status' | 'result'>;
  compact?: boolean;
}

export function StatusBadge({ scan, compact }: StatusBadgeProps) {
  const status = getScanStatus(scan);
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, compact && styles.compact, { borderColor: `${config.color}66` }]}>
      {config.spin ? (
        <ActivityIndicator size={10} color={config.color} />
      ) : (
        <Ionicons name={config.icon} size={12} color={config.color} />
      )}
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    backgroundColor: colors.surfaceDeep,
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
