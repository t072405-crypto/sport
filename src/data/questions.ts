export type Question = {
  id: number;
  text: string;
  /** Always 4 options. */
  answers: string[];
  /** Index into `answers` of the correct option. */
  correctIndex: number;
};

// Local data for now; swap this export for an API call later.
export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'How many players does each team have on the field?',
    answers: ['7', '9', '11', '10'],
    correctIndex: 2,
  },
  {
    id: 2,
    text: 'Which country won the 2022 FIFA World Cup?',
    answers: ['France', 'Brazil', 'Argentina', 'Croatia'],
    correctIndex: 2,
  },
  {
    id: 3,
    text: 'How long is a standard football match, without extra time?',
    answers: ['60 min', '80 min', '90 min', '120 min'],
    correctIndex: 2,
  },
  {
    id: 4,
    text: 'Which country hosted the 2022 FIFA World Cup?',
    answers: ['Qatar', 'Saudi Arabia', 'UAE', 'Russia'],
    correctIndex: 0,
  },
  {
    id: 5,
    text: 'Which player has won the most Ballon d’Or awards?',
    answers: ['Cristiano Ronaldo', 'Lionel Messi', 'Johan Cruyff', 'Michel Platini'],
    correctIndex: 1,
  },
];
