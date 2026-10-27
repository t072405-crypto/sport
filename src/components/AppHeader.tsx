import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  /** Shows a back arrow when set. */
  onBack?: () => void;
};

export function AppHeader({ onBack }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={12}
          onPress={onBack}
          style={({ pressed }) => pressed && styles.pressed}>
          <Ionicons name="chevron-back" size={26} color={colors.text} />
        </Pressable>
      ) : (
        <Ionicons name="football" size={26} color={colors.text} />
      )}
      <Text style={styles.title}>
        Sports <Text style={styles.accent}>Quiz</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  accent: { color: colors.accent },
  pressed: { opacity: 0.6 },
});
