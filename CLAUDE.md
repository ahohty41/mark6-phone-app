# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Language

Always reply in **Traditional Chinese (繁體中文)**. This applies to all explanations, comments in conversation, and documentation. Code, variable names, and technical identifiers remain in English.

## Commands

```bash
# Start the Expo dev server (opens QR code for Expo Go)
npx expo start

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

To preview on a physical device, install **Expo Go** on Android/iOS and scan the QR code.

## Architecture

This is a **React Native (Expo)** app for the Hong Kong Mark Six lottery (香港六合彩).

**Entry point**: `App.tsx` — single-screen app containing all layout, state, and navigation stubs.

**Source structure** (`src/`):
- `components/Ball.tsx` — pure UI component. Renders a Chinese lantern-styled number ball. Color is derived from the official HKJC color mapping (red/blue/green by number range). Uses `React.memo`.
- `utils/lotteryUtils.ts` — pure functions: `getBallColor(num)` maps 1–49 to HKJC official colors; `generateMarkSixNumbers()` generates 6 unique sorted numbers from 1–49.
- `types/lottery.ts` — shared TypeScript interfaces: `MarkSixResult`, `ApiResponse`.

**Data flow**: `App.tsx` holds `currentNumbers: number[]` state → `handleGenerate` (useCallback) calls `generateMarkSixNumbers()` → `ballList` (useMemo) renders `<Ball>` components.

## Planned features (not yet built)

Per `MarkSix_App_Roadmap.md`:
- **Backend**: Vercel Serverless Function to scrape live results from `bet.hkjc.com`, with Edge Caching (30-min Cache-Control).
- **Monetization**: Google AdMob (banner + interstitial ads).
- **State management**: Zustand or Redux Toolkit for history/analysis screens.
- **Screens**: History, Analysis, Settings (nav stubs exist in `App.tsx` bottom nav).

## Coding Standards

The `/mark6-standards` skill enforces these rules — invoke it when writing or reviewing code:

- **Single Responsibility**: UI components (e.g. `Ball.tsx`) are separate from logic/data.
- **Memoization**: Use `useMemo` for derived lists/calculations, `useCallback` for stable handlers.
- **TypeScript first**: All data structures must have a defined `interface` in `src/types/`.
- **Naming**: Descriptive names — `generateMarkSixNumbers` not `getNums`.
- **Absolute imports**: Use `@/components/...` style paths (configure in `tsconfig.json` when adding more modules).
- **Comments**: Only on complex business logic (the "why"), not the "what".

## Design

The app uses a Chinese traditional aesthetic: deep crimson (`#450a0a`) background, gold (`#fcd34d`, `#d4af37`) accents, lantern-shaped number balls. Ball colors match official HKJC: red `#FF3B30`, blue `#007AFF`, green `#34C759`.
