import type { RoutineCreateInput } from '@/data/routines';

function toNullableString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function toNullableInt(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.trunc(value));
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isNaN(parsed) ? null : Math.max(0, parsed);
  }

  return null;
}

export function parseRoutinePayload(body: unknown): RoutineCreateInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as {
    title?: unknown;
    description?: unknown;
    focus?: unknown;
    blocks?: unknown;
  };

  if (!Array.isArray(candidate.blocks)) {
    return null;
  }

  const blocks = candidate.blocks
    .filter((block) => block && typeof block === 'object')
    .map((block) => {
      const nextBlock = block as {
        title?: unknown;
        exercises?: unknown;
      };

      const exercises = (
        Array.isArray(nextBlock.exercises) ? nextBlock.exercises : []
      )
        .filter((exercise) => exercise && typeof exercise === 'object')
        .map((exercise) => {
          const nextExercise = exercise as {
            name?: unknown;
            targetSets?: unknown;
            targetReps?: unknown;
            restSeconds?: unknown;
            notes?: unknown;
            loadTrackingEnabled?: unknown;
          };

          return {
            name:
              typeof nextExercise.name === 'string'
                ? nextExercise.name.trim()
                : '',
            targetSets: toNullableInt(nextExercise.targetSets),
            targetReps: toNullableString(nextExercise.targetReps),
            restSeconds: toNullableInt(nextExercise.restSeconds),
            notes: toNullableString(nextExercise.notes),
            loadTrackingEnabled: Boolean(nextExercise.loadTrackingEnabled),
          };
        })
        .filter((exercise) => exercise.name.length > 0);

      return {
        title:
          typeof nextBlock.title === 'string' ? nextBlock.title.trim() : '',
        exercises,
      };
    })
    .filter((block) => block.exercises.length > 0);

  if (blocks.length === 0) {
    return null;
  }

  return {
    title: typeof candidate.title === 'string' ? candidate.title.trim() : '',
    description: toNullableString(candidate.description),
    focus: toNullableString(candidate.focus),
    blocks,
  };
}
