import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, difficultyColors, radius } from '@/constants/theme';
import type { Difficulty } from '@/data/questions';

type IconName = ComponentProps<typeof Ionicons>['name'];

const DETAILS: Record<Difficulty, { label: string; description: string; icon: IconName }> = {
  easy: { label: 'Easy', description: 'Warm up with simple questions', icon: 'leaf' },
  medium: { label: 'Medium', description: 'A real test for fans', icon: 'flame' },
  hard: { label: 'Hard', description: 'Only for true experts', icon: 'skull' },
};

type Props = {
  difficulty: Difficulty;
  onPress: () => void;
};

export function DifficultyButton({ difficulty, onPress }: Props) {
  const { label, description, icon } = DETAILS[difficulty];
  const color = difficultyColors[difficulty];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label} difficulty`}
      onPress={onPress}
      style={({ pressed }) => [styles.base, { borderColor: color }, pressed && styles.pressed]}>
      <View style={[styles.icon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={22} color={colors.text} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: radius.card,
    borderWidth: 1,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: { flex: 1, gap: 2 },
  label: { color: colors.text, fontSize: 18, fontWeight: '700' },
  description: { color: colors.textMuted, fontSize: 14 },
});
