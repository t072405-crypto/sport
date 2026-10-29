import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
};

/** A tappable AI-suggested category. */
export function IdeaChip({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} category, suggested by AI`}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && styles.pressed]}>
      <Ionicons name="sparkles" size={14} color={colors.tiebreaker} />
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexBasis: '46%',
    flexGrow: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.tiebreaker,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  label: { flex: 1, color: colors.text, fontSize: 14, fontWeight: '700' },
});
