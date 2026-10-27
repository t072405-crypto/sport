import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  score: number;
};

export function ScoreBadge({ score }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="trophy" size={14} color={colors.accent} />
      <Text style={styles.text}>Score: {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  text: { color: colors.text, fontSize: 14, fontWeight: '700' },
});
