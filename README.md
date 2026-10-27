# Football Quiz

A mobile football trivia game built with Expo (React Native), TypeScript and Expo Router.

## Run

```bash
npm install
npx expo start          # add --tunnel if your phone can't connect
```

Scan the QR code with the Expo Go app (Android) or the Camera app (iOS).

## Structure

- `src/app/` – Expo Router screens (`index.tsx` is the game screen)
- `src/components/` – QuestionCard, AnswerButton, ScoreBadge, ProgressBar, NextButton, ResultCard
- `src/hooks/useQuiz.ts` – game state (current question, score, selection, reset)
- `src/data/questions.ts` – local, typed question list
- `src/constants/theme.ts` – colors and radii
