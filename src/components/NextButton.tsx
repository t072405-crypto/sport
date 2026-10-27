import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius } from '@/constants/theme';

type Props = {
  onPress: () => void;
};

export function NextButton({ onPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Next"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { right: 20, bottom: Math.max(insets.bottom, 12) + 12 },
        pressed && styles.pressed,
      ]}>
      <Ionicons name="arrow-forward" size={28} color={colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    elevation: 6,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.94 }] },
});
