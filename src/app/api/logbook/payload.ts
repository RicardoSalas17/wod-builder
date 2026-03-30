import type { LogSessionCreateInput } from '@/data/logbook';

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

export function parseLogbookPayload(
  body: unknown,
): LogSessionCreateInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as {
    title?: unknown;
    performedAt?: unknown;
    notes?: unknown;
    durationMinutes?: unknown;
    routineId?: unknown;
    exercises?: unknown;
  };

  if (!Array.isArray(candidate.exercises)) {
    return null;
  }

  const performedAtValue =
    typeof candidate.performedAt === 'string' && candidate.performedAt
      ? new Date(candidate.performedAt)
      : new Date();

  if (Number.isNaN(performedAtValue.getTime())) {
    return null;
  }

  const exercises = candidate.exercises
    .filter((exercise) => exercise && typeof exercise === 'object')
    .map((exercise) => {
      const nextExercise = exercise as {
        name?: unknown;
        notes?: unknown;
        loadTrackingEnabled?: unknown;
        routineExerciseId?: unknown;
        sets?: unknown;
      };

      const sets = (Array.isArray(nextExercise.sets) ? nextExercise.sets : [])
        .filter((set) => set && typeof set === 'object')
        .map((set, index) => {
          const nextSet = set as {
            setNumber?: unknown;
            reps?: unknown;
            load?: unknown;
            completed?: unknown;
            notes?: unknown;
          };

          return {
            setNumber: toNullableInt(nextSet.setNumber) ?? index + 1,
            reps: toNullableString(nextSet.reps),
            load: toNullableString(nextSet.load),
            completed:
              typeof nextSet.completed === 'boolean' ? nextSet.completed : true,
            notes: toNullableString(nextSet.notes),
          };
        });

      return {
        name:
          typeof nextExercise.name === 'string' ? nextExercise.name.trim() : '',
        notes: toNullableString(nextExercise.notes),
        loadTrackingEnabled: Boolean(nextExercise.loadTrackingEnabled),
        routineExerciseId: toNullableString(nextExercise.routineExerciseId),
        sets,
      };
    })
    .filter((exercise) => exercise.name.length > 0 && exercise.sets.length > 0);

  if (exercises.length === 0) {
    return null;
  }

  return {
    title: typeof candidate.title === 'string' ? candidate.title.trim() : '',
    performedAt: performedAtValue,
    notes: toNullableString(candidate.notes),
    durationMinutes: toNullableInt(candidate.durationMinutes),
    routineId: toNullableString(candidate.routineId),
    exercises,
  };
}
