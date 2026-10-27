# Sports Quiz

A two-team mobile sports trivia game built with Expo (React Native), TypeScript and Expo Router.
Two teams enter their names, pick a difficulty (Easy, Medium or Hard), and take turns answering
10 fresh multiple-choice Sports questions from [OpenTDB](https://opentdb.com) — 5 each. A correct
answer scores a point for the team whose turn it is; the result screen shows the winner or a draw.

## Run

```bash
npm install
npx expo start          # add --tunnel if your phone can't connect
```

Scan the QR code with the Expo Go app (Android) or the Camera app (iOS).

## Structure

- `src/app/index.tsx` – intro screen: the two team names (VS)
- `src/app/difficulty.tsx` – difficulty screen (Easy / Medium / Hard)
- `src/app/game.tsx` – game screen (loading, error, playing, result)
- `src/api/opentdb.ts` – OpenTDB client: session token (no repeats), rate-limit retry, decoding
- `src/hooks/useQuiz.ts` – game state (load questions, turns, per-team scores, play again)
- `src/components/` – AppHeader, ScreenBackground, TeamNameInput, TeamScoreboard, DifficultyButton,
  InfoPill, QuestionCard, AnswerButton, ProgressBar, NextButton, PrimaryButton, ResultCard
- `src/data/teams.ts` – team names, defaults and turn order
- `src/data/questions.ts` – `Question` / `Difficulty` types and offline fallback questions
- `src/constants/theme.ts` – colors and radii
