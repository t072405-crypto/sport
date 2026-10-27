import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, teamColors } from '@/constants/theme';
import type { Scores, TeamIndex, Teams } from '@/data/teams';

type Props = {
  teams: Teams;
  scores: Scores;
  /** Highlights the team whose turn it is. */
  activeTeam?: TeamIndex;
};

export function TeamScoreboard({ teams, scores, activeTeam }: Props) {
  return (
    <View style={styles.row}>
      {([0, 1] as const).map((team) => {
        const active = team === activeTeam;
        return (
          <View
            key={team}
            accessibilityLabel={`${teams[team]}: ${scores[team]}`}
            style={[
              styles.team,
              team === 1 && styles.teamRight,
              active && { borderColor: teamColors[team], backgroundColor: colors.card },
            ]}>
            <Text style={[styles.name, { color: teamColors[team] }]} numberOfLines={1}>
              {teams[team]}
            </Text>
            <Text style={styles.score}>{scores[team]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
  team: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  teamRight: { flexDirection: 'row-reverse' },
  name: { flexShrink: 1, fontSize: 14, fontWeight: '700' },
  score: { color: colors.text, fontSize: 20, fontWeight: '800' },
});
