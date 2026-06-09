import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBadge } from '@/components/StatusBadge';
import { colors, spacing } from '@/theme';
import type { ScanResult } from '@/types/api';

interface ScanListItemProps {
  scan: ScanResult;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ScanListItem({ scan }: ScanListItemProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => router.push(`/scans/${scan.id}`)}
    >
      <View style={styles.left}>
        <Text style={styles.id}>#{scan.id}</Text>
        <View style={styles.meta}>
          <Text style={styles.target} numberOfLines={1}>
            {scan.target}
          </Text>
          <Text style={styles.type}>{scan.scan_type}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <StatusBadge scan={scan} compact />
        <Text style={styles.date}>{formatDate(scan.created_at)}</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  rowPressed: {
    backgroundColor: `${colors.primary}0D`,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
    minWidth: 0,
  },
  id: {
    color: colors.textDim,
    fontSize: 11,
    width: 36,
  },
  meta: { flex: 1, minWidth: 0 },
  target: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  type: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  date: {
    color: colors.textDim,
    fontSize: 10,
  },
});
