import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TeamScoreboard } from '@/components/TeamScoreboard';
import { colors, teamColors } from '@/constants/theme';
import type { Scores, Teams } from '@/data/teams';

type Props = {
  teams: Teams;
  scores: Scores;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  onNewTeams: () => void;
};

export function ResultCard({ teams, scores, onPlayAgain, onChangeDifficulty, onNewTeams }: Props) {
  const [first, second] = scores;
  const winner = first === second ? null : first > second ? 0 : 1;

  return (
    <View style={styles.card}>
      <Ionicons
        name={winner === null ? 'ribbon' : 'trophy'}
        size={48}
        color={winner === null ? colors.accent : teamColors[winner]}
      />
      <Text style={styles.heading}>Final score</Text>
      <Text style={styles.score}>
        {first} : {second}
      </Text>
      <Text style={styles.message}>
        {winner === null ? (
          "It's a draw!"
        ) : (
          <>
            <Text style={{ color: teamColors[winner] }}>{teams[winner]}</Text> wins!
          </>
        )}
      </Text>
      <View style={styles.scoreboard}>
        <TeamScoreboard teams={teams} scores={scores} activeTeam={winner ?? undefined} />
      </View>
      <View style={styles.buttons}>
        <PrimaryButton label="Play again" onPress={onPlayAgain} />
        <PrimaryButton label="Change difficulty" variant="secondary" onPress={onChangeDifficulty} />
        <PrimaryButton label="New teams" variant="secondary" onPress={onNewTeams} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  heading: { color: colors.textMuted, fontSize: 16, fontWeight: '600' },
  score: { color: colors.text, fontSize: 56, fontWeight: '800' },
  message: { color: colors.text, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  scoreboard: { alignSelf: 'stretch' },
  buttons: { alignSelf: 'stretch', gap: 10, marginTop: 8 },
});
