export type TeamIndex = 0 | 1;
export type Teams = [string, string];
export type Scores = [number, number];

export const DEFAULT_TEAM_NAMES: Teams = ['Team Blue', 'Team Red'];
export const MAX_TEAM_NAME_LENGTH = 16;

/** Trimmed team name, or the default name when it's empty. */
export function teamName(value: unknown, index: TeamIndex): string {
  const name = typeof value === 'string' ? value.trim().slice(0, MAX_TEAM_NAME_LENGTH) : '';
  return name || DEFAULT_TEAM_NAMES[index];
}

/** Reads the two team names from route params (`team1`, `team2`). */
export function teamsFromParams(params: { team1?: string; team2?: string }): Teams {
  return [teamName(params.team1, 0), teamName(params.team2, 1)];
}

/** Reads a score from a route param; anything invalid becomes 0. */
export function scoreFromParam(value: unknown): number {
  const score = Number(value);
  return Number.isInteger(score) && score >= 0 ? score : 0;
}

/** The winning team, or null for a draw. */
export function winnerOf([first, second]: Scores): TeamIndex | null {
  if (first === second) return null;
  return first > second ? 0 : 1;
}

export function pointsLabel(points: number) {
  return `${points} ${points === 1 ? 'point' : 'points'}`;
}

/** Teams take turns: even questions go to team 1, odd ones to team 2. */
export function teamForQuestion(index: number): TeamIndex {
  return index % 2 === 0 ? 0 : 1;
}
