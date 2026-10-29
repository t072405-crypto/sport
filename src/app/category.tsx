import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { CategoryButton } from '@/components/CategoryButton';
import { IdeaChip } from '@/components/IdeaChip';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { colors, radius, teamColors } from '@/constants/theme';
import { MAX_TOPIC_LENGTH, normalizeTopic, PRESET_CATEGORIES } from '@/data/categories';
import { teamsFromParams } from '@/data/teams';
import { useCategoryIdeas } from '@/hooks/useCategoryIdeas';
import { goBack } from '@/utils/goBack';

type Params = {
  team1?: string;
  team2?: string;
  /** "welcome" when opened from the welcome page's Category button. */
  from?: string;
};

export default function CategoryScreen() {
  const params = useLocalSearchParams<Params>();
  const fromWelcome = params.from === 'welcome';
  const [team1, team2] = teamsFromParams(params);
  const ideas = useCategoryIdeas();
  const [customTopic, setCustomTopic] = useState('');
  const topic = normalizeTopic(customTopic);
  // Only warn once something is typed.
  const invalid = customTopic.trim() !== '' && !topic;

  function choose(category: string) {
    if (fromWelcome) {
      // Back to the welcome page, which shows the choice and passes it on.
      router.dismissTo({ pathname: '/', params: { category } });
    } else {
      router.push({ pathname: '/difficulty', params: { team1, team2, category } });
    }
  }

  return (
    <ScreenBackground>
      <AppHeader onBack={() => goBack('/')} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            {!fromWelcome && (
              <Text style={styles.matchup}>
                <Text style={{ color: teamColors[0] }}>{team1}</Text>
                <Text style={styles.vs}> vs </Text>
                <Text style={{ color: teamColors[1] }}>{team2}</Text>
              </Text>
            )}
            <Text style={styles.heading}>Pick a category</Text>
            <Text style={styles.subtitle}>
              The AI writes every question about the category you choose.
            </Text>
          </View>

          <View style={styles.grid}>
            {PRESET_CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                onPress={() => choose(category.id)}
              />
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, styles.aiLabel]}>✨ Suggested by AI</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="New AI ideas"
                disabled={ideas.loading}
                hitSlop={12}
                onPress={ideas.refresh}
                style={({ pressed }) => [styles.refresh, pressed && styles.pressed]}>
                {ideas.loading ? (
                  <ActivityIndicator size="small" color={colors.tiebreaker} />
                ) : (
                  <Ionicons name="refresh" size={18} color={colors.tiebreaker} />
                )}
              </Pressable>
            </View>
            {ideas.error && !ideas.loading ? (
              <Text style={styles.muted}>Couldn’t load ideas: {ideas.error} Tap ↻ to retry.</Text>
            ) : ideas.ideas.length === 0 ? (
              <Text style={styles.muted}>The AI is thinking of fresh categories…</Text>
            ) : (
              <View style={[styles.grid, styles.noPadding, ideas.loading && styles.fading]}>
                {ideas.ideas.map((idea) => (
                  <IdeaChip key={idea} label={idea} onPress={() => choose(idea)} />
                ))}
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Or type your own topic</Text>
            <TextInput
              accessibilityLabel="Custom topic"
              value={customTopic}
              onChangeText={setCustomTopic}
              onSubmitEditing={() => topic && choose(topic)}
              placeholder="e.g. Real Madrid, NBA in the 90s, Cricket"
              placeholderTextColor={colors.textMuted}
              maxLength={MAX_TOPIC_LENGTH}
              autoCapitalize="words"
              returnKeyType="go"
              style={[styles.input, invalid && styles.inputInvalid]}
            />
            {invalid && <Text style={styles.error}>Use letters, numbers and spaces only.</Text>}
            <PrimaryButton
              label="Use this topic"
              disabled={!topic}
              onPress={() => topic && choose(topic)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 32 },
  intro: { gap: 10, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20 },
  matchup: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  vs: { color: colors.textMuted },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  noPadding: { paddingHorizontal: 0 },
  fading: { opacity: 0.4 },
  section: { gap: 10, paddingHorizontal: 20, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionLabel: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  aiLabel: { color: colors.tiebreaker },
  refresh: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  pressed: { opacity: 0.6 },
  muted: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  input: {
    minHeight: 56,
    paddingHorizontal: 16,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  inputInvalid: { borderColor: colors.wrong },
  error: { color: colors.wrong, fontSize: 14 },
});
