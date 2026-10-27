import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

export type AnswerState = 'default' | 'correct' | 'wrong' | 'disabled';

type Props = {
  label: string;
  state: AnswerState;
  onPress: () => void;
};

export function AnswerButton({ label, state, onPress }: Props) {
  const locked = state !== 'default';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={locked}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        state === 'correct' && styles.correct,
        state === 'wrong' && styles.wrong,
        state === 'disabled' && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.label}>{label}</Text>
      {state === 'correct' && (
        <View style={[styles.badge, { backgroundColor: colors.correct }]}>
          <Ionicons name="checkmark" size={18} color={colors.text} />
        </View>
      )}
      {state === 'wrong' && (
        <View style={[styles.badge, { backgroundColor: colors.wrong }]}>
          <Ionicons name="close" size={18} color={colors.text} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  correct: { backgroundColor: colors.correctBg, borderColor: colors.correct },
  wrong: { backgroundColor: colors.wrongBg, borderColor: colors.wrong },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  label: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '600' },
  badge: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
