import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerButton, type AnswerState } from '@/components/AnswerButton';
import { NextButton } from '@/components/NextButton';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultCard } from '@/components/ResultCard';
import { ScoreBadge } from '@/components/ScoreBadge';
import { colors } from '@/constants/theme';
import { useQuiz } from '@/hooks/useQuiz';

export default function GameScreen() {
  const { question, index, total, score, selected, answered, finished, select, next, reset } =
    useQuiz();

  function stateFor(i: number): AnswerState {
    if (selected === null) return 'default';
    if (i === question.correctIndex) return 'correct';
    if (i === selected) return 'wrong';
    return 'disabled';
  }

  return (
    <LinearGradient colors={[colors.backgroundTop, colors.backgroundBottom]} style={styles.fill}>
      <SafeAreaView style={styles.fill}>
        <View style={styles.header}>
          <Ionicons name="football" size={26} color={colors.text} />
          <Text style={styles.title}>
            Football <Text style={styles.accent}>Quiz</Text>
          </Text>
        </View>

        {finished ? (
          <View style={styles.resultWrap}>
            <ResultCard score={score} total={total} onPlayAgain={reset} />
          </View>
        ) : (
          <>
            <View style={styles.status}>
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  Question {index + 1} of {total}
                </Text>
                <ScoreBadge score={score} />
              </View>
              <ProgressBar progress={(index + (answered ? 1 : 0)) / total} />
            </View>

            <View style={styles.questionWrap}>
              <QuestionCard number={index + 1} text={question.text} />
            </View>

            <View style={styles.answers}>
              {question.answers.map((label, i) => (
                <AnswerButton key={label} label={label} state={stateFor(i)} onPress={() => select(i)} />
              ))}
            </View>

            {answered && <NextButton onPress={next} />}
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  title: { color: colors.text, fontSize: 26, fontWeight: '800' },
  accent: { color: colors.accent },
  status: { gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statusLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  questionWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  // Bottom padding leaves room for the floating Next button.
  answers: { gap: 12, paddingHorizontal: 20, paddingBottom: 100 },
  resultWrap: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
});
