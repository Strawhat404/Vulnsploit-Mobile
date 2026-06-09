import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import type { ApiErrorType } from '@/api/errors';

interface ErrorAlertProps {
  message: string;
  type?: ApiErrorType;
}

export function ErrorAlert({ message, type = 'unknown' }: ErrorAlertProps) {
  const isNetwork = type === 'network';

  return (
    <View style={[styles.box, isNetwork ? styles.network : styles.error]}>
      <Ionicons
        name={isNetwork ? 'cloud-offline-outline' : 'alert-circle-outline'}
        size={16}
        color={isNetwork ? colors.warning : colors.danger}
        style={styles.icon}
      />
      <View style={styles.content}>
        {isNetwork && <Text style={styles.networkTitle}>Backend not reachable</Text>}
        <Text style={[styles.text, isNetwork && styles.networkText]}>{message}</Text>
        {isNetwork && (
          <Text style={styles.hint}>Run: docker compose up -d in the Vulnsploit backend repo.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
  },
  error: {
    borderColor: `${colors.danger}4D`,
    backgroundColor: `${colors.danger}0D`,
  },
  network: {
    borderColor: `${colors.warning}4D`,
    backgroundColor: `${colors.warning}0D`,
  },
  icon: { marginTop: 2, marginRight: spacing.sm },
  content: { flex: 1 },
  networkTitle: {
    color: colors.warning,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
  },
  text: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
  },
  networkText: { color: colors.warning },
  hint: {
    color: `${colors.warning}99`,
    fontSize: 11,
    marginTop: 6,
    lineHeight: 16,
  },
});
