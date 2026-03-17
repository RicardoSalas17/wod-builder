---
name: wod-builder-persistence
description: Prisma/SQLite persistence workflow for WOD Builder (Prisma 7 adapter, data layer, API routes).
metadata:
  short-description: WOD Builder persistence workflow
---

# WOD Builder Persistence

## Stack notes
- Prisma 7 + SQLite.
- `.env` provides `DATABASE_URL="file:./dev.db"`.
- Prisma Client uses `PrismaBetterSqlite3({ url })` in `src/lib/prisma.ts`.
- API routes must run on Node runtime (not Edge).

## Data layer
- `src/data/workouts.ts` is the source of truth for DB access.
- Use `listWorkouts`, `getWorkoutById`, `createWorkout`, and `updateWorkout`.
- Prefer delete+recreate blocks on update (MVP) to keep logic simple.

## API routes
- Create: `src/app/api/workouts/route.ts` (POST).
- Update: `src/app/api/workouts/[id]/route.ts` (PATCH).
- Keep payload parsing consistent with builder state.
- Map builder block types (`warmup|strength|metcon`) to Prisma `BlockType`.

## Middleware
- `src/middleware.ts` must exclude `/api` from locale routing.

## Validation & testing
- Test create -> list -> detail -> edit flow.
- Confirm locale works in `/es` and `/en`.
