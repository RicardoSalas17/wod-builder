---
name: wod-builder-core
description: Core workflow and conventions for WOD Builder & Timer (Next.js App Router + next-intl + Tailwind v4 + shadcn). Use for UI, routes, i18n, builder, and timer work.
metadata:
  short-description: WOD Builder core workflow
---

# WOD Builder Core

## Quick start
- Read `AGENT.md` and `HANDOFF.md` first.
- Work in small, reviewable steps; confirm after each step.

## Project structure
- App routes: `src/app/[locale]` (App Router).
- UI components: `src/components`.
- Domain types: `src/domain`.
- Hooks/state: `src/hooks` and `src/lib`.
- i18n messages: `src/messages`.

## i18n rules
- Server pages: call `setRequestLocale(locale)` and use `getTranslations`.
- Client components: receive `copy` props from server; avoid `useTranslations` in client unless necessary.
- Use `Link` and `useRouter` from `@/i18n/navigation` for locale-aware navigation.

## UI & accessibility
- Use Tailwind tokens and shadcn components.
- Accent color: `#4CAD38` (see `src/app/[locale]/globals.css`).
- Keep labels, `aria-live`, focus-visible styles, and respect reduced motion.

## Collaboration
- Pair-programming: guide steps, explain intent, avoid big changes without confirmation.
- Commit only when a stage is complete. Suggested format: `feat(scope): ...`.
