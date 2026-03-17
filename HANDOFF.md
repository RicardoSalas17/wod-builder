# HANDOFF.md

<!--
Purpose: Project snapshot for a new agent. Summarizes stack, key files, and next steps.
Use this to onboard quickly without rereading the full history.
-->

## Snapshot (2026-03-17)

- Branch: `main`
- Stack: Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui
- i18n: `next-intl` with locale routes under `src/app/[locale]` and `localePrefix: "as-needed"`

## Persistence

- Prisma 7 + SQLite
- `.env` => `DATABASE_URL="file:./dev.db"`
- Runtime deploy target: Turso via `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`
- `dev.db` es local de desarrollo y no debe versionarse; el esquema fuente vive en `prisma/schema.prisma` y `prisma/migrations/`
- Client: `src/lib/prisma.ts` uses `PrismaLibSql` with Turso env vars or local `DATABASE_URL`
- Schema: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Demo seed: `prisma/seed.ts`

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
- Routines and logbook are in the product and now rely on migration-owned tables instead of runtime DDL.
- Deploy path is being prepared around Vercel + Turso.

## Next steps (recommended)

1. Run Prisma generate/migration commands on Node 20+ and apply the new SQL migration to the target DB.
2. Seed demo data locally and then in Turso.
3. Add a release pass for lint/build and smoke-test the main product flows.
4. Deploy on Vercel with Turso env vars.
