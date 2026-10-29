# Sports Quiz

A two-team mobile sports trivia game built with Expo (React Native), TypeScript and Expo Router.
Two teams enter their names, pick a difficulty (Easy, Medium or Hard), and take turns answering
10 fresh multiple-choice Sports questions written by AI through [OpenRouter](https://openrouter.ai) — 5 each. A correct
answer scores a point for the team whose turn it is. If the teams are tied after 10 questions, a
sudden-death tiebreaker gives each team one more question per round until one round ends with
different scores. The final page shows the winning team and the points it earned.

## Run

1. Copy `.env.example` to `.env.local` and set `OPENROUTER_API_KEY` (get one at
   https://openrouter.ai/keys). `.env.local` is git-ignored; never use an `EXPO_PUBLIC_` prefix
   for the key, or it ships inside the app.
2. Start the dev server (restart it after changing `.env.local`):

```bash
npm install
npx expo start          # add --tunnel if your phone can't connect
```

The key is only used by the server route `src/app/api/questions+api.ts`. In development that runs
inside the Expo dev server on your computer. For a published app, deploy the API route
(e.g. EAS Hosting) and set the `origin` option of the `expo-router` plugin.

Scan the QR code with the Expo Go app (Android) or the Camera app (iOS).

## Structure

- `src/app/index.tsx` – intro screen: the two team names (VS)
- `src/app/difficulty.tsx` – difficulty screen (Easy / Medium / Hard)
- `src/app/game.tsx` – game screen (loading, error, playing)
- `src/app/result.tsx` – final page: winning team and its points, or a draw
- `src/app/api/questions+api.ts` – server API route: `POST /api/questions { amount, difficulty, avoid }`
- `src/server/generateQuestions.ts` – server-only OpenRouter call: prompt, JSON schema, validation, shuffling
- `src/api/questions.ts` – app client for the API route; remembers recent questions to avoid repeats
- `src/hooks/useQuiz.ts` – game state (load questions, turns, per-team scores, play again)
- `src/components/` – AppHeader, ScreenBackground, TeamNameInput, TeamScoreboard, DifficultyButton,
  InfoPill, QuestionCard, AnswerButton, ProgressBar, NextButton, PrimaryButton, ResultCard
- `src/data/teams.ts` – team names, defaults and turn order
- `src/data/questions.ts` – `Question` / `Difficulty` types and offline fallback questions
- `src/constants/theme.ts` – colors and radii
