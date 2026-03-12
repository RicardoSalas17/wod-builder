# HANDOFF.md
<!--
Purpose: Project snapshot for a new agent. Summarizes stack, key files, and next steps.
Use this to onboard quickly without rereading the full history.
-->

## Snapshot (2026-03-12)
- Branch: `feat/persistence`
- Stack: Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui
- i18n: `next-intl` with locale routes under `src/app/[locale]` and `localePrefix: "as-needed"`

## Persistence
- Prisma 7 + SQLite
- `.env` => `DATABASE_URL="file:./dev.db"`
- Client: `src/lib/prisma.ts` uses `PrismaBetterSqlite3({ url: DATABASE_URL })`
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`

## i18n + Middleware
- Layout: `src/app/[locale]/layout.tsx` uses `NextIntlClientProvider`, `setRequestLocale`
- Middleware excludes `/api`: `src/middleware.ts`
- Navigation helpers: `src/i18n/navigation.ts`

## Builder & Timer
- Builder UI: `src/app/[locale]/(app)/workouts/new/builder-client.tsx`
- State: `src/hooks/use-workout-builder.ts`, `src/lib/workout-builder.ts`
- Timer: `src/app/[locale]/(app)/workouts/[id]/timer-client.tsx`

## Data access + API
- Data layer: `src/data/workouts.ts` with `createWorkout`, `getWorkoutById`, `listWorkouts`
- Create API: `src/app/api/workouts/route.ts` (POST)
- List: `src/app/[locale]/(app)/workouts/page.tsx` (reads DB)
- Detail: `src/app/[locale]/(app)/workouts/[id]/page.tsx` (renders blocks + timer)

## Design
- Accent green: `#4CAD38` (tokens in `src/app/[locale]/globals.css`)

## Current status
- Saving a WOD via the builder works and redirects to detail.
- List + detail are wired to Prisma DB and i18n.

## Next steps (recommended)
1. Edit WOD flow:
   - Add `updateWorkout` in `src/data/workouts.ts`.
   - Add `PATCH /api/workouts/[id]` route.
   - Extend builder hook to accept `initialState` + `storageKey`.
   - Reuse builder for edit (`/workouts/[id]/edit`).
2. Then consider delete/duplicate actions.
