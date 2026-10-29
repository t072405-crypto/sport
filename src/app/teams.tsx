import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { AppHeader } from '@/components/AppHeader';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenBackground } from '@/components/ScreenBackground';
import { TeamNameInput } from '@/components/TeamNameInput';
import { colors, radius } from '@/constants/theme';
import { categoryFromParam } from '@/data/categories';
import { teamName } from '@/data/teams';

export default function TeamsScreen() {
  // Chosen on the welcome page, so registration goes straight to difficulty.
  const params = useLocalSearchParams<{ category?: string }>();
  const category = categoryFromParam(params.category);
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const team2Ref = useRef<ComponentRef<typeof TextInput>>(null);

  function next() {
    router.push({
      pathname: '/difficulty',
      params: { team1: teamName(team1, 0), team2: teamName(team2, 1), category: category.id },
    });
  }

  return (
    <ScreenBackground>
      <AppHeader onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.fill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.intro}>
            <Text style={styles.label}>Team battle</Text>
            <Text style={styles.heading}>Who’s playing today?</Text>
            <Text style={styles.subtitle}>
              Two teams take turns answering. Each correct answer scores a point for the team whose
              turn it is.
            </Text>
          </View>

          <View style={styles.teams}>
            <TeamNameInput
              team={0}
              value={team1}
              onChangeText={setTeam1}
              onSubmitEditing={() => team2Ref.current?.focus()}
            />
            <View style={styles.vs}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            <TeamNameInput
              ref={team2Ref}
              team={1}
              value={team2}
              onChangeText={setTeam2}
              onSubmitEditing={next}
            />
            <View style={styles.button}>
              <PrimaryButton label="Continue" onPress={next} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  intro: { flexGrow: 1, justifyContent: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 24 },
  label: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heading: { color: colors.text, fontSize: 30, fontWeight: '800', lineHeight: 38 },
  subtitle: { color: colors.textMuted, fontSize: 16, lineHeight: 24 },
  teams: { gap: 12, paddingHorizontal: 20, paddingBottom: 32 },
  vs: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.backgroundBottom,
  },
  vsText: { color: colors.text, fontSize: 16, fontWeight: '800' },
  button: { marginTop: 8 },
});
