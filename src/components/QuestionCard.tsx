import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  number: number;
  text: string;
};

export function QuestionCard({ number, text }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Question {number}</Text>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  label: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  text: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
});
