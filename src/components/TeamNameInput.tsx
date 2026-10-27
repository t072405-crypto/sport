import type { ComponentRef, Ref } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, teamColors } from '@/constants/theme';
import { DEFAULT_TEAM_NAMES, MAX_TEAM_NAME_LENGTH, type TeamIndex } from '@/data/teams';

type Props = {
  team: TeamIndex;
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing?: () => void;
  ref?: Ref<ComponentRef<typeof TextInput>>;
};

export function TeamNameInput({ team, value, onChangeText, onSubmitEditing, ref }: Props) {
  const color = teamColors[team];

  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={styles.labelRow}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={[styles.label, { color }]}>Team {team + 1}</Text>
      </View>
      <TextInput
        ref={ref}
        accessibilityLabel={`Team ${team + 1} name`}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={DEFAULT_TEAM_NAMES[team]}
        placeholderTextColor={colors.textMuted}
        maxLength={MAX_TEAM_NAME_LENGTH}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType={team === 0 ? 'next' : 'done'}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius.card,
    borderWidth: 1,
    backgroundColor: colors.card,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 10, height: 10, borderRadius: radius.pill },
  label: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  input: { minHeight: 40, color: colors.text, fontSize: 20, fontWeight: '700', padding: 0 },
});
