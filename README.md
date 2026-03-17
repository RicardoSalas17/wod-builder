# WOD Builder

WOD Builder is a coach-friendly CrossFit training planner built with Next.js, TypeScript, Prisma, and `next-intl`.

## Current MVP surface

- Build workouts with warm-up, strength, and metcon blocks.
- Edit saved workouts and run the integrated timer.
- Create reusable strength routines.
- Log free sessions or sessions derived from a routine.
- Track sets, reps, and loads with the weight helper UI.
- Browse the app in Spanish and English.

## Local development

Requirements:

- Node 20+
- npm

Install dependencies and run the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database setup

The app supports two database modes:

- local development via `DATABASE_URL="file:./dev.db"`
- deployed runtime via Turso using `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`

Copy `.env.example` to `.env` and adjust values as needed.

Generate Prisma client:

```bash
npm run db:generate
```

Seed demo content locally:

```bash
npm run db:seed:demo
```

## Turso + Vercel deploy path

This repo is being prepared for a free MVP deploy using:

- Vercel for the Next.js app
- Turso for the remote SQLite-compatible database

Schema workflow:

1. Generate migration SQL locally against SQLite.
2. Apply the SQL to Turso.
3. Deploy the app with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set in Vercel.

## Validation

- Unit tests: `npm run test:unit`
- Lint: `npm run lint`
- Build: `npm run build`

## Important files

- `src/lib/prisma.ts` - runtime Prisma adapter selection
- `src/data/workouts.ts` - workout persistence
- `src/data/routines.ts` - routine persistence
- `src/data/logbook.ts` - logbook persistence
- `prisma/schema.prisma` - schema source of truth
- `prisma/migrations/` - SQL migration history
- `prisma/seed.ts` - demo seed data
