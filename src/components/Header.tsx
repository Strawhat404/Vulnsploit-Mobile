import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/theme';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  prompt: string;
  title: string;
}

export function Header({ prompt, title }: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { username, logout } = useAuth();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.topRow}>
        <Text style={styles.prompt}>root@vulnsploit:~$ {prompt}</Text>
        <Pressable onPress={logout} style={styles.logoutBtn} hitSlop={8}>
          <Ionicons name="log-out-outline" size={18} color={colors.textMuted} />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>{title}</Text>
      {username ? <Text style={styles.user}>operator: {username}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bg,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  prompt: {
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
    marginRight: spacing.sm,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoutText: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
    fontWeight: '600',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
  },
  user: {
    color: colors.primary,
    fontSize: 11,
    marginTop: spacing.xs,
    letterSpacing: 1,
  },
});
