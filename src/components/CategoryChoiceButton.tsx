import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';
import type { Category } from '@/data/categories';

type Props = {
  category: Category;
  onPress: () => void;
};

/** Shows the chosen category; tapping it opens the category picker. */
export function CategoryChoiceButton({ category, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Category: ${category.label}. Change category`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Ionicons name={category.icon} size={22} color={colors.text} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.caption}>Category</Text>
        <Text style={styles.label} numberOfLines={1}>
          {category.label}
        </Text>
      </View>
      <Text style={styles.change}>Change</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.accent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  icon: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  textWrap: { flex: 1, gap: 2 },
  caption: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  label: { color: colors.text, fontSize: 17, fontWeight: '800' },
  change: { color: colors.accent, fontSize: 15, fontWeight: '700' },
});
