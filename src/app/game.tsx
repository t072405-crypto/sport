import { router, useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnswerButton, type AnswerState } from '@/components/AnswerButton';
import { AppHeader } from '@/components/AppHeader';
import { InfoPill } from '@/components/InfoPill';
import { NextButton } from '@/components/NextButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ResultCard } from '@/components/ResultCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { TeamScoreboard } from '@/components/TeamScoreboard';
import { colors, difficultyColors, radius, teamColors } from '@/constants/theme';
import { isDifficulty } from '@/data/questions';
import { teamsFromParams } from '@/data/teams';
import { useQuiz } from '@/hooks/useQuiz';

export default function GameScreen() {
  const params = useLocalSearchParams<{ difficulty?: string; team1?: string; team2?: string }>();
  const difficulty = isDifficulty(params.difficulty) ? params.difficulty : 'easy';
  const teams = teamsFromParams(params);
  const quiz = useQuiz(difficulty);
  const { status, question, index, total, scores, currentTeam, selected, answered } = quiz;

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
        <ScrollView contentContainerStyle={styles.center}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Couldn’t load questions</Text>
            <Text style={styles.muted}>{quiz.error}</Text>
            <PrimaryButton label="Try again" onPress={quiz.playAgain} />
            <PrimaryButton
              label="Play offline questions"
              variant="secondary"
              onPress={quiz.playOffline}
            />
          </View>
        </ScrollView>
      )}

      {status === 'finished' && (
        <ScrollView contentContainerStyle={styles.center}>
          <ResultCard
            teams={teams}
            scores={scores}
            onPlayAgain={quiz.playAgain}
            onChangeDifficulty={() => router.back()}
            onNewTeams={() => router.dismissTo('/')}
          />
        </ScrollView>
      )}

      {status === 'playing' && question && (
        <>
          {/* Scrolls only when a long question doesn't fit (small phones). */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.status}>
              <TeamScoreboard teams={teams} scores={scores} activeTeam={currentTeam} />
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>
                  Question {index + 1} of {total}
                </Text>
                <View style={styles.pills}>
                  {question.category && <InfoPill label={question.category} />}
                  <InfoPill label={difficulty} color={difficultyColors[difficulty]} />
                </View>
              </View>
              <ProgressBar progress={(index + (answered ? 1 : 0)) / total} />
            </View>

            <View style={styles.questionWrap}>
              <View style={[styles.turn, { backgroundColor: teamColors[currentTeam] }]}>
                <Text style={styles.turnText} numberOfLines={1}>
                  {teams[currentTeam]}’s turn
                </Text>
              </View>
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
          </ScrollView>

          {answered && <NextButton onPress={quiz.next} />}
        </>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContent: { flexGrow: 1 },
  muted: { color: colors.textMuted, fontSize: 16, textAlign: 'center', lineHeight: 24 },
  status: { gap: 12, paddingHorizontal: 20, paddingTop: 16 },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  statusLabel: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },
  pills: { flexDirection: 'row', flexShrink: 1, gap: 6 },
  questionWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  turn: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  turnText: { color: colors.text, fontSize: 14, fontWeight: '800' },
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
});
