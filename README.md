# Sports Quiz

A mobile sports trivia game built with Expo (React Native), TypeScript and Expo Router.
Every game loads 10 fresh multiple-choice Sports questions from [OpenTDB](https://opentdb.com),
at the difficulty you pick (Easy, Medium or Hard).

## Run

```bash
npm install
npx expo start          # add --tunnel if your phone can't connect
```

Scan the QR code with the Expo Go app (Android) or the Camera app (iOS).

## Structure

- `src/app/index.tsx` – difficulty screen (Easy / Medium / Hard)
- `src/app/game.tsx` – game screen (loading, error, playing, result)
- `src/api/opentdb.ts` – OpenTDB client: session token (no repeats), rate-limit retry, decoding
- `src/hooks/useQuiz.ts` – game state (load questions, score, selection, play again)
- `src/components/` – AppHeader, ScreenBackground, DifficultyButton, InfoPill, QuestionCard,
  AnswerButton, ScoreBadge, ProgressBar, NextButton, ResultCard
- `src/data/questions.ts` – `Question` / `Difficulty` types and offline fallback questions
- `src/constants/theme.ts` – colors and radii
