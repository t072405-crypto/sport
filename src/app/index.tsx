import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { colors, radius, teamColors } from '@/constants/theme';
import { QUESTIONS_PER_GAME } from '@/hooks/useQuiz';

type IconName = ComponentProps<typeof Ionicons>['name'];

const STEPS: { icon: IconName; text: string }[] = [
  { icon: 'people', text: 'Register two teams' },
  { icon: 'grid', text: 'Pick a category, or type your own topic' },
  { icon: 'speedometer', text: 'Choose Easy, Medium or Hard' },
  {
    icon: 'swap-horizontal',
    text: `Take turns: ${QUESTIONS_PER_GAME} questions, ${QUESTIONS_PER_GAME / 2} per team`,
  },
  { icon: 'flash', text: 'A tie? Sudden death decides the winner' },
];

export default function WelcomeScreen() {
  return (
    <ScreenBackground>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Ionicons name="football" size={56} color={colors.text} />
          </View>
          <Text style={styles.title}>
            Sports <Text style={styles.accent}>Quiz</Text>
          </Text>
          <Text style={styles.tagline}>
            <Text style={{ color: teamColors[0] }}>Two teams.</Text>{' '}
            <Text style={{ color: teamColors[1] }}>One quiz.</Text> Fresh questions every game.
          </Text>
        </View>

        <View style={styles.steps}>
          <Text style={styles.label}>How to play</Text>
          {STEPS.map((step, i) => (
            <View key={step.text} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Ionicons name={step.icon} size={20} color={colors.accent} />
              <Text style={styles.stepText}>{step.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.powered}>
            <Ionicons name="sparkles" size={14} color={colors.tiebreaker} />
            <Text style={styles.poweredText}>Questions written by AI via OpenRouter</Text>
          </View>
          <PrimaryButton label="Start" onPress={() => router.push('/teams')} />
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 24, gap: 28 },
  hero: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  logo: {
    width: 112,
    height: 112,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: { color: colors.text, fontSize: 40, fontWeight: '800' },
  accent: { color: colors.accent },
  tagline: { color: colors.textMuted, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  steps: {
    gap: 12,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  label: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNumber: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  stepNumberText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  stepText: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600', lineHeight: 21 },
  footer: { gap: 14 },
  powered: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  poweredText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
});
