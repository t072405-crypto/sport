import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { DifficultyButton } from '@/components/DifficultyButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { colors } from '@/constants/theme';
import { DIFFICULTIES, type Difficulty } from '@/data/questions';
import { QUESTIONS_PER_GAME } from '@/hooks/useQuiz';

export default function DifficultyScreen() {
  function startGame(difficulty: Difficulty) {
    router.push({ pathname: '/game', params: { difficulty } });
  }

  return (
    <ScreenBackground>
      <AppHeader />

      <View style={styles.intro}>
        <Text style={styles.label}>New game</Text>
        <Text style={styles.heading}>Choose your difficulty</Text>
        <Text style={styles.subtitle}>
          {QUESTIONS_PER_GAME} fresh sports questions every game.
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
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  intro: { flex: 1, justifyContent: 'center', gap: 10, paddingHorizontal: 20 },
  label: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  buttons: { gap: 12, paddingHorizontal: 20, paddingBottom: 32 },
});
