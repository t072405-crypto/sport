import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius } from '@/constants/theme';

type Props = {
  score: number;
  total: number;
  onPlayAgain: () => void;
  onChangeDifficulty?: () => void;
};

function messageFor(score: number, total: number) {
  const ratio = score / total;
  if (ratio === 1) return "Perfect score! You're a true trivia expert.";
  if (ratio >= 0.8) return 'Great job! You really know your stuff.';
  if (ratio >= 0.6) return 'Not bad! A little more practice and you will nail it.';
  if (ratio >= 0.2) return 'Keep going! Every expert starts somewhere.';
  return 'Tough round. Give it another shot!';
}

export function ResultCard({ score, total, onPlayAgain, onChangeDifficulty }: Props) {
  return (
    <View style={styles.card}>
      <Ionicons name="trophy" size={48} color={colors.accent} />
      <Text style={styles.heading}>Final score</Text>
      <Text style={styles.score}>
        {score} / {total}
      </Text>
      <Text style={styles.message}>{messageFor(score, total)}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onPlayAgain}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>Play again</Text>
      </Pressable>
      {onChangeDifficulty && (
        <Pressable
          accessibilityRole="button"
          onPress={onChangeDifficulty}
          style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Change difficulty</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 12,
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  heading: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  score: { color: colors.text, fontSize: 56, fontWeight: '800' },
  message: { color: colors.text, fontSize: 18, textAlign: 'center', lineHeight: 26 },
  button: {
    alignSelf: 'stretch',
    minHeight: 56,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    backgroundColor: colors.accent,
  },
  secondary: {
    marginTop: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '700' },
});
