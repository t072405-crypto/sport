import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { colors } from '@/constants/theme';

type Props = {
  /** Small label above the question, e.g. "Question 4". */
  label: string;
  text: string;
};

export function QuestionCard({ label, text }: Props) {
  const { width, height } = useWindowDimensions();
  // Smaller text on short or narrow phones so long questions still fit.
  const compact = height < 700 || width < 360;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.text, compact && styles.textCompact]}>{text}</Text>
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
  textCompact: { fontSize: 22, lineHeight: 29 },
});
