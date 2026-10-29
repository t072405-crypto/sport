export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && (DIFFICULTIES as string[]).includes(value);
}

export type Question = {
  id: number;
  text: string;
  /** Always 4 options. */
  answers: string[];
  /** Index into `answers` of the correct option. */
  correctIndex: number;
  category?: string;
  difficulty?: Difficulty;
};

// Offline fallback, used when the AI question service can't be reached.
export const OFFLINE_QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How many players does each team have on the field?',
    answers: ['7', '9', '11', '10'],
    correctIndex: 2,
    category: 'Football',
  },
  {
    id: 2,
    text: 'Which country won the 2022 FIFA World Cup?',
    answers: ['France', 'Brazil', 'Argentina', 'Croatia'],
    correctIndex: 2,
    category: 'Football',
  },
  {
    id: 3,
    text: 'How long is a standard football match, without extra time?',
    answers: ['60 min', '80 min', '90 min', '120 min'],
    correctIndex: 2,
    category: 'Football',
  },
  {
    id: 4,
    text: 'Which country hosted the 2022 FIFA World Cup?',
    answers: ['Qatar', 'Saudi Arabia', 'UAE', 'Russia'],
    correctIndex: 0,
    category: 'Football',
  },
  {
    id: 5,
    text: 'Which player has won the most Ballon d’Or awards?',
    answers: ['Cristiano Ronaldo', 'Lionel Messi', 'Johan Cruyff', 'Michel Platini'],
    correctIndex: 1,
    category: 'Football',
  },
  {
    id: 6,
    text: 'Which country has won the most FIFA World Cups?',
    answers: ['Germany', 'Italy', 'Brazil', 'Argentina'],
    correctIndex: 2,
    category: 'Football',
  },
  {
    id: 7,
    text: 'How often is the FIFA World Cup held?',
    answers: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
    correctIndex: 2,
    category: 'Football',
  },
  {
    id: 8,
    text: 'Which club plays its home games at Camp Nou?',
    answers: ['Real Madrid', 'FC Barcelona', 'Atlético Madrid', 'Valencia'],
    correctIndex: 1,
    category: 'Football',
  },
  {
    id: 9,
    text: 'Which card does a referee show to send a player off?',
    answers: ['Yellow', 'Green', 'Blue', 'Red'],
    correctIndex: 3,
    category: 'Football',
  },
  {
    id: 10,
    text: 'Which country hosted the 2014 FIFA World Cup?',
    answers: ['Germany', 'South Africa', 'Brazil', 'Russia'],
    correctIndex: 2,
    category: 'Football',
  },
];
