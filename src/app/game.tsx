import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnswerButton, type AnswerState } from '@/components/AnswerButton';
import { AppHeader } from '@/components/AppHeader';
import { InfoPill } from '@/components/InfoPill';
import { NextButton } from '@/components/NextButton';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultCard } from '@/components/ResultCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { ScreenBackground } from '@/components/ScreenBackground';
import { colors, difficultyColors, radius } from '@/constants/theme';
import { isDifficulty } from '@/data/questions';
import { useQuiz } from '@/hooks/useQuiz';

export default function GameScreen() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = isDifficulty(params.difficulty) ? params.difficulty : 'easy';
  const quiz = useQuiz(difficulty);
  const { status, question, index, total, score, selected, answered } = quiz;

  function stateFor(i: number): AnswerState {
    if (!question || selected === null) return 'default';
    if (i === question.correctIndex) return 'correct';
    if (i === selected) return 'wrong';
    return 'disabled';
  }

  return (
    <ScreenBackground>
      <AppHeader onBack={() => router.back()} />

      {status === 'loading' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.muted}>Loading new questions…</Text>
        </View>
      )}

      {status === 'error' && (
        <View style={styles.center}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Couldn’t load questions</Text>
            <Text style={styles.muted}>{quiz.error}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={quiz.playAgain}
              style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Try again</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={quiz.playOffline}
              style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Play offline questions</Text>
            </Pressable>
          </View>
        </View>
      )}

      {status === 'finished' && (
        <View style={styles.center}>
          <ResultCard
            score={score}
            total={total}
            onPlayAgain={quiz.playAgain}
            onChangeDifficulty={() => router.back()}
          />
        </View>
      )}

      {status === 'playing' && question && (
        <>
          <View style={styles.status}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>
                Question {index + 1} of {total}
              </Text>
              <ScoreBadge score={score} />
            </View>
            <ProgressBar progress={(index + (answered ? 1 : 0)) / total} />
            <View style={styles.pills}>
              {question.category && <InfoPill label={question.category} />}
              <InfoPill label={difficulty} color={difficultyColors[difficulty]} />
            </View>
          </View>

          <View style={styles.questionWrap}>
            <QuestionCard number={index + 1} text={question.text} />
          </View>

          <View style={styles.answers}>
            {question.answers.map((label, i) => (
              <AnswerButton
                key={`${question.id}-${i}`}
                label={label}
                state={stateFor(i)}
                onPress={() => quiz.select(i)}
              />
            ))}
          </View>

          {answered && <NextButton onPress={quiz.next} />}
        </>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: 16, paddingHorizontal: 20 },
  muted: { color: colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  status: { gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  pills: { flexDirection: 'row', gap: 8 },
  questionWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  // Bottom padding leaves room for the floating Next button.
  answers: { gap: 12, paddingHorizontal: 20, paddingBottom: 100 },
  errorCard: {
    gap: 12,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  errorTitle: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  button: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.card,
    backgroundColor: colors.accent,
  },
  secondary: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.cardBorder },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { color: colors.text, fontSize: 17, fontWeight: '700' },
});
