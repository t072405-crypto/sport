import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  /** `secondary` is an outlined button for less important actions. */
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, variant = 'primary', disabled = false }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.card,
    backgroundColor: colors.accent,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  text: { color: colors.text, fontSize: 17, fontWeight: '700' },
});
