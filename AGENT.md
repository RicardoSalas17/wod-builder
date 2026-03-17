# AGENT.md

<!--
Purpose: Guidelines for collaborating on this repo (pair-programming, commits, i18n, persistence).
Use this when handing off to a new coding agent or re‑aligning on how we work.
-->

**Collaboration**

- Pair-programming: guía paso a paso y explica el porqué; evita cambios grandes sin confirmación.
- Trabaja en pasos pequeños, verificables. Pide confirmación antes de seguir.

**Branches & Commits**

- Usa ramas de feature cuando tenga sentido.
- Haz commits solo cuando una etapa esté completa (no cada cambio).
- Mensajes sugeridos: `feat(scope): ...`, `fix(scope): ...`.

**Project Basics**

- Stack: Next.js App Router + TypeScript + Tailwind v4 + shadcn/ui.
- i18n con next-intl. Rutas bajo `src/app/[locale]`.
- En server pages: `setRequestLocale(locale)` y `getTranslations`.
- En client components: pasar `copy` desde server, evita `useTranslations`.
- Usa `Link`/`useRouter` desde `@/i18n/navigation`.

**Design & Accessibility**

- Prioriza accesibilidad: labels reales, focus visible, `aria-live`, respetar `prefers-reduced-motion`.
- Paleta aprobada: verde #4CAD38 como acento; tokens en `src/app/[locale]/globals.css`.
- UI con shadcn + Tailwind; evita duplicar lógica y mantén single source of truth.

**Persistence**

- Prisma 7 + SQLite.
- Prisma Client usa adapter `PrismaBetterSqlite3` en `src/lib/prisma.ts`.
- `.env` contiene `DATABASE_URL="file:./dev.db"`.
- `dev.db` es local para desarrollo; no se debe commitear y se reconstruye desde `prisma/migrations/`.
- `src/middleware.ts` debe excluir `/api` en el matcher.

**Data Flow**

- Lectura DB: `src/data/workouts.ts` (create/list/get).
- API create: `src/app/api/workouts/route.ts`.
- Listado/Detalle: `src/app/[locale]/(app)/workouts/page.tsx` y `src/app/[locale]/(app)/workouts/[id]/page.tsx`.

**Validation**

- Verificar en `/es` y `/en`.
- Probar flujo: crear WOD -> listar -> detalle -> timer.
