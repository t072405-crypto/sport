import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { ResultCard } from '@/components/ResultCard';
import { ScreenBackground } from '@/components/ScreenBackground';
import { categoryFromParam } from '@/data/categories';
import { isDifficulty } from '@/data/questions';
import { scoreFromParam, teamsFromParams, type Scores } from '@/data/teams';

type Params = {
  difficulty?: string;
  category?: string;
  team1?: string;
  team2?: string;
  score1?: string;
  score2?: string;
  /** "1" when the game was decided by a tiebreaker. */
  tiebreaker?: string;
};

export default function ResultScreen() {
  const params = useLocalSearchParams<Params>();
  const difficulty = isDifficulty(params.difficulty) ? params.difficulty : 'easy';
  const category = categoryFromParam(params.category);
  const [team1, team2] = teamsFromParams(params);
  const scores: Scores = [scoreFromParam(params.score1), scoreFromParam(params.score2)];

  return (
    <ScreenBackground>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.center}>
        <ResultCard
          teams={[team1, team2]}
          scores={scores}
          details={`${category.label} · ${difficulty}`}
          wonInTiebreaker={params.tiebreaker === '1'}
          // A fresh game screen loads new questions for the same teams and category.
          onPlayAgain={() =>
            router.replace({
              pathname: '/game',
              params: { difficulty, category: category.id, team1, team2 },
            })
          }
          onChangeCategory={() =>
            router.dismissTo({ pathname: '/category', params: { team1, team2 } })
          }
          onNewTeams={() =>
            router.dismissTo({ pathname: '/teams', params: { category: category.id } })
          }
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  center: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 20 },
});
