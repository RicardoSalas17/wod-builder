# Weight Picker MVP

This module adds a recruiter-ready load selection flow for barbell movements.

## What is included

- Pure domain logic in `src/domain/units.ts` and `src/domain/lifting.ts`
- Local state with Zustand in `src/stores/use-weight-picker-store.ts`
- Accessible UI components in `src/components/weight-picker/`
- Demo integration inside the workout builder so the feature is visible in local development

## Current state shape

- `selectedBarId`
- `platesPerSide`
- `unitPreference`
- `showBothUnits`
- `lastUsedWeight`
- `personalRecord`
- `lastUpdated`

## Next steps checklist

- [ ] Persist `LoadSelection` per movement in DB once the workout schema is expanded
- [ ] Add athlete-specific overrides for personalized loads
- [ ] Track `lastUsedWeight` from completed workouts
- [ ] Track `personalRecord` by movement and unit normalization
- [ ] Add inventory customization per gym or athlete profile
- [ ] Add richer suggestion strategies beyond greedy plate selection
- [ ] Add component tests once the app test runner supports React component rendering
