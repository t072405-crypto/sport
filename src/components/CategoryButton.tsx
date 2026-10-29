import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';
import type { Category } from '@/data/categories';

type Props = {
  category: Category;
  onPress: () => void;
};

export function CategoryButton({ category, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${category.label} category`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.icon}>
        <Ionicons name={category.icon} size={24} color={colors.text} />
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {category.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    // Two per row; the parent wraps them.
    flexBasis: '46%',
    flexGrow: 1,
    minHeight: 96,
    gap: 10,
    padding: 14,
    justifyContent: 'center',
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  label: { color: colors.text, fontSize: 16, fontWeight: '700' },
});
