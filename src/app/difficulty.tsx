import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { DifficultyButton } from '@/components/DifficultyButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { colors, teamColors } from '@/constants/theme';
import { categoryFromParam } from '@/data/categories';
import { DIFFICULTIES, type Difficulty } from '@/data/questions';
import { teamsFromParams } from '@/data/teams';
import { QUESTIONS_PER_GAME } from '@/hooks/useQuiz';
import { goBack } from '@/utils/goBack';

export default function DifficultyScreen() {
  const params = useLocalSearchParams<{ team1?: string; team2?: string; category?: string }>();
  const [team1, team2] = teamsFromParams(params);
  const category = categoryFromParam(params.category);

  function startGame(difficulty: Difficulty) {
    router.push({
      pathname: '/game',
      params: { difficulty, team1, team2, category: category.id },
    });
  }

  return (
    <ScreenBackground>
      <AppHeader
        onBack={() => goBack({ pathname: '/teams', params: { category: category.id } })}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.intro}>
          <Text style={styles.matchup}>
            <Text style={{ color: teamColors[0] }}>{team1}</Text>
            <Text style={styles.vs}> vs </Text>
            <Text style={{ color: teamColors[1] }}>{team2}</Text>
          </Text>
          <Text style={styles.heading}>Choose your difficulty</Text>
          <Text style={styles.subtitle}>
            {QUESTIONS_PER_GAME} fresh questions about{' '}
            <Text style={styles.category}>{category.label}</Text>, {QUESTIONS_PER_GAME / 2} for
            each team.
          </Text>
        </View>

        <View style={styles.buttons}>
          {DIFFICULTIES.map((difficulty) => (
            <DifficultyButton
              key={difficulty}
              difficulty={difficulty}
              onPress={() => startGame(difficulty)}
            />
          ))}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  intro: { flexGrow: 1, justifyContent: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 24 },
  matchup: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  category: { color: colors.text, fontWeight: '800' },
  vs: { color: colors.textMuted },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  buttons: { gap: 12, paddingHorizontal: 20, paddingBottom: 32 },
});
