import type { Difficulty } from '@/data/questions';

export const colors = {
  backgroundTop: '#0A0F1F',
  backgroundBottom: '#111A33',
  accent: '#2F6BFF',
  card: '#1A2340',
  cardBorder: '#2A3558',
  text: '#FFFFFF',
  textMuted: '#9AA6C7',
  correct: '#1FA463',
  correctBg: '#12382B',
  wrong: '#E5484D',
  wrongBg: '#3D1B22',
  track: '#1F2A4D',
} as const;

export const difficultyColors: Record<Difficulty, string> = {
  easy: '#1FA463',
  medium: '#F5A524',
  hard: '#E5484D',
};

export const radius = {
  card: 14,
  pill: 999,
} as const;
