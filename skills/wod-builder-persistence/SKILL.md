---
name: wod-builder-persistence
description: Prisma/SQLite persistence workflow for WOD Builder (Prisma 7 adapter, data layer, API routes).
metadata:
  short-description: WOD Builder persistence workflow
---

# WOD Builder Persistence

## Stack notes

- Prisma 7 + SQLite/libSQL.
- Local CLI uses `.env` with `DATABASE_URL="file:./dev.db"`.
- Deployed runtime uses `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
- Prisma Client uses `PrismaLibSql` in `src/lib/prisma.ts`.
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
- Treat `prisma/schema.prisma` + `prisma/migrations/` as schema ownership; avoid runtime `CREATE TABLE IF NOT EXISTS` fallbacks.
