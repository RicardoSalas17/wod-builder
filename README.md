# WOD Builder

WOD Builder is a bilingual coaching app for planning CrossFit-style sessions, organizing reusable routines, and logging training with set-by-set detail. It is built as a portfolio-ready MVP with a public deploy, production database, and polished end-to-end flows.

Live demo: `https://wod-builder-pdhu9c7sr-ricardosalas1716-2912s-projects.vercel.app/`

## Why this project matters

This project demonstrates product thinking, not just UI work.

- Turns a coach workflow into a usable web product: plan, reuse, log, review.
- Connects frontend UX, API design, persistence, migrations, seeding, and deployment.
- Ships a real production setup with Next.js on Vercel and Turso as the remote database.
- Supports both Spanish and English across the main experience.

## What recruiters should look at

If you only have a few minutes, this is the fastest walkthrough:

1. Open the landing page and jump into the product.
2. Visit `/es/workouts` and open a saved WOD.
3. Visit `/es/routines` to see reusable training templates.
4. Visit `/es/logbook` to review tracked sessions and filters.
5. Switch to English and confirm the same flows still feel coherent.

## Core product flows

### 1. Workout builder

- Create WODs with warm-up, strength, and metcon blocks.
- Add movements, reps, loads, and coaching notes.
- Edit saved workouts and run the built-in timer.

Primary files:

- `src/app/[locale]/(app)/workouts/new/builder-client.tsx`
- `src/app/[locale]/(app)/workouts/[id]/page.tsx`
- `src/data/workouts.ts`

### 2. Routine library

- Create reusable routines for structured training.
- Organize exercises by block.
- Duplicate or adapt routines without losing the original flow.

Primary files:

- `src/app/[locale]/(app)/routines/new/routine-builder-client.tsx`
- `src/app/[locale]/(app)/routines/[id]/page.tsx`
- `src/data/routines.ts`

### 3. Logbook

- Track free sessions or sessions based on a routine.
- Capture sets, reps, load, completion state, and notes.
- Filter by routine, source, and query.

Primary files:

- `src/app/[locale]/(app)/logbook/new/log-session-builder-client.tsx`
- `src/app/[locale]/(app)/logbook/page.tsx`
- `src/data/logbook.ts`

## Technical highlights

- `Next.js 16` with App Router
- `TypeScript`
- `Tailwind CSS v4`
- `next-intl` for bilingual routing and messages
- `Prisma 7` with `@prisma/adapter-libsql`
- `Turso` for production persistence
- `Vercel` for deployment
- `Vitest` for unit tests

## Architecture snapshot

- UI routes live under `src/app/[locale]`
- API routes live under `src/app/api`
- Data access lives in `src/data`
- Prisma runtime setup lives in `src/lib/prisma.ts`
- Schema source of truth is `prisma/schema.prisma`
- SQL migrations live in `prisma/migrations/`
- Demo seed data lives in `prisma/seed.ts`

## Production setup

The app is deployed on Vercel and uses Turso as the remote SQLite-compatible database.

Runtime environment variables:

```env
DATABASE_URL="libsql://..."
TURSO_DATABASE_URL="libsql://..."
TURSO_AUTH_TOKEN="..."
```

Build note:

- The production build runs `prisma generate && next build` to guarantee the Prisma client matches the latest schema in clean CI environments.

## Local development

Requirements:

- Node 20+
- npm

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database workflow

Local development uses SQLite via:

```env
DATABASE_URL="file:./dev.db"
```

Useful commands:

```bash
npm run db:generate
npm run db:seed:demo
```

Migration path:

1. Update `prisma/schema.prisma`
2. Create or maintain SQL migrations in `prisma/migrations/`
3. Apply the same schema remotely in Turso
4. Seed demo content when needed

## Validation

```bash
npm run lint
npm run test:unit
npm run build
```

## Portfolio value

This project shows that I can:

- design and ship a user-facing product flow end to end
- build with modern React and Next.js patterns
- model data and evolve schema safely with Prisma migrations
- deploy a real app with cloud infrastructure and environment management
- improve polish after launch through QA, validation hardening, and UX refinement

## Important files

- `src/app/[locale]/(marketing)/page.tsx` - landing page and entry narrative
- `src/components/site/locale-switcher.tsx` - locale switcher that preserves reviewer context
- `src/lib/prisma.ts` - Prisma runtime adapter selection
- `src/app/api/workouts/payload.ts` - workout payload validation
- `src/app/api/routines/payload.ts` - routine payload validation
- `src/app/api/logbook/payload.ts` - logbook payload validation
- `prisma/seed.ts` - demo dataset used for walkthroughs

## Current status

- Public production deploy is live
- Main product flows are working on Vercel + Turso
- Release-pass polish has been applied to navigation, validation, and user feedback
- Next recommended improvement: migrate `src/middleware.ts` to the newer `proxy` convention to remove the remaining Next.js deprecation warning
