import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { TeamScoreboard } from '@/components/TeamScoreboard';
import { colors, radius, teamColors } from '@/constants/theme';
import { pointsLabel, winnerOf, type Scores, type Teams } from '@/data/teams';

type Props = {
  teams: Teams;
  scores: Scores;
  /** What was played, e.g. "Football · medium". */
  details?: string;
  wonInTiebreaker?: boolean;
  onPlayAgain: () => void;
  onChangeCategory: () => void;
  onNewTeams: () => void;
};

export function ResultCard({
  teams,
  scores,
  details,
  wonInTiebreaker = false,
  onPlayAgain,
  onChangeCategory,
  onNewTeams,
}: Props) {
  const winner = winnerOf(scores);
  const color = winner === null ? colors.accent : teamColors[winner];

  return (
    <View style={styles.card}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Ionicons name={winner === null ? 'ribbon' : 'trophy'} size={44} color={colors.text} />
      </View>

      {winner === null ? (
        <>
          <Text style={styles.label}>Final result</Text>
          <Text style={styles.headline}>It’s a draw!</Text>
          <Text style={styles.points}>Both teams earned {pointsLabel(scores[0])}</Text>
        </>
      ) : (
        <>
          <Text style={[styles.label, { color }]}>Winner</Text>
          <Text style={[styles.headline, { color }]} numberOfLines={2}>
            {teams[winner]}
          </Text>
          <Text style={styles.points}>
            won with <Text style={styles.pointsValue}>{pointsLabel(scores[winner])}</Text>
          </Text>
          {wonInTiebreaker && (
            <View style={styles.tiebreaker}>
              <Text style={styles.tiebreakerText}>Decided in the tiebreaker</Text>
            </View>
          )}
        </>
      )}

      <View style={styles.scoreboard}>
        <TeamScoreboard teams={teams} scores={scores} activeTeam={winner ?? undefined} />
      </View>
      {details && <Text style={styles.details}>{details}</Text>}

      <View style={styles.buttons}>
        <PrimaryButton label="Play again" onPress={onPlayAgain} />
        <PrimaryButton label="Change category" variant="secondary" onPress={onChangeCategory} />
        <PrimaryButton label="New teams" variant="secondary" onPress={onNewTeams} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    gap: 10,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  badge: {
    width: 88,
    height: 88,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 44,
  },
  label: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headline: { color: colors.text, fontSize: 36, fontWeight: '800', textAlign: 'center' },
  points: { color: colors.textMuted, fontSize: 18, textAlign: 'center' },
  pointsValue: { color: colors.text, fontWeight: '800' },
  tiebreaker: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.tiebreaker,
  },
  tiebreakerText: { color: colors.tiebreaker, fontSize: 13, fontWeight: '700' },
  scoreboard: { alignSelf: 'stretch', marginTop: 12 },
  details: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  buttons: { alignSelf: 'stretch', gap: 10, marginTop: 12 },
});
