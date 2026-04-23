import { createId } from '@/domain/ids';
import { prisma } from '@/lib/prisma';

export type LogSessionCreateInput = {
  title: string;
  performedAt: Date;
  notes?: string | null;
  durationMinutes?: number | null;
  routineId?: string | null;
  exercises: {
    name: string;
    bodyPart?: string | null;
    notes?: string | null;
    loadTrackingEnabled?: boolean;
    increaseWeight?: boolean;
    routineExerciseId?: string | null;
    sets: {
      setNumber: number;
      reps?: string | null;
      load?: string | null;
      completed?: boolean;
      rpe?: number | null;
      notes?: string | null;
    }[];
  }[];
};

export type LogSessionFilters = {
  query?: string;
  routineId?: string;
  source?: 'all' | 'routine' | 'free';
};

type LogSessionRow = {
  id: string;
  title: string;
  performedAt: string;
  notes: string | null;
  durationMinutes: number | null;
  createdAt: string;
  updatedAt: string;
  routineId: string | null;
};

type LogExerciseRow = {
  id: string;
  name: string;
  bodyPart: string | null;
  notes: string | null;
  loadTrackingEnabled: number;
  increaseWeight: number;
  position: number;
  logSessionId: string;
  routineExerciseId: string | null;
};

type LogSetRow = {
  id: string;
  setNumber: number;
  reps: string | null;
  load: string | null;
  completed: number;
  rpe: number | null;
  notes: string | null;
  logExerciseId: string;
};

type RoutineLookupRow = {
  id: string;
  title: string;
};

type SqlExecutor = Pick<typeof prisma, '$queryRawUnsafe' | '$executeRawUnsafe'>;

function mapLogSessionRecord(
  session: LogSessionRow,
  exercises: LogExerciseRow[],
  sets: LogSetRow[],
  routineLookup: RoutineLookupRow[],
) {
  const routine = session.routineId
    ? (routineLookup.find((item) => item.id === session.routineId) ?? null)
    : null;

  return {
    id: session.id,
    title: session.title,
    performedAt: new Date(session.performedAt),
    notes: session.notes,
    durationMinutes: session.durationMinutes,
    createdAt: new Date(session.createdAt),
    updatedAt: new Date(session.updatedAt),
    routineId: session.routineId,
    routine,
    exercises: exercises
      .filter((exercise) => exercise.logSessionId === session.id)
      .sort((a, b) => a.position - b.position)
      .map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        bodyPart: exercise.bodyPart,
        notes: exercise.notes,
        loadTrackingEnabled: Boolean(exercise.loadTrackingEnabled),
        increaseWeight: Boolean(exercise.increaseWeight),
        routineExerciseId: exercise.routineExerciseId,
        sets: sets
          .filter((set) => set.logExerciseId === exercise.id)
          .sort((a, b) => a.setNumber - b.setNumber)
          .map((set) => ({
            id: set.id,
            setNumber: set.setNumber,
            reps: set.reps,
            load: set.load,
            completed: Boolean(set.completed),
            rpe: set.rpe,
            notes: set.notes,
          })),
      })),
  };
}

async function fetchLogSessionGraph(sessionIds?: string[]) {
  const sessions = (await prisma.$queryRawUnsafe(
    sessionIds?.length
      ? `SELECT * FROM LogSession WHERE id IN (${sessionIds.map(() => '?').join(', ')})`
      : 'SELECT * FROM LogSession',
    ...(sessionIds ?? []),
  )) as LogSessionRow[];

  const exercises = (await prisma.$queryRawUnsafe(
    sessionIds?.length
      ? `SELECT * FROM LogExercise WHERE logSessionId IN (${sessionIds
          .map(() => '?')
          .join(', ')}) ORDER BY position ASC`
      : 'SELECT * FROM LogExercise ORDER BY position ASC',
    ...(sessionIds ?? []),
  )) as LogExerciseRow[];

  const exerciseIds = exercises.map((exercise) => exercise.id);
  const sets = (await prisma.$queryRawUnsafe(
    exerciseIds.length
      ? `SELECT * FROM LogSet WHERE logExerciseId IN (${exerciseIds
          .map(() => '?')
          .join(', ')}) ORDER BY setNumber ASC`
      : 'SELECT * FROM LogSet WHERE 1 = 0',
    ...exerciseIds,
  )) as LogSetRow[];

  const routineIds = sessions
    .map((session) => session.routineId)
    .filter((value): value is string => Boolean(value));

  const routines = routineIds.length
    ? ((await prisma.$queryRawUnsafe(
        `SELECT id, title FROM Routine WHERE id IN (${routineIds.map(() => '?').join(', ')})`,
        ...routineIds,
      )) as RoutineLookupRow[])
    : [];

  return { sessions, exercises, sets, routines };
}

async function replaceSessionChildren(
  tx: SqlExecutor,
  sessionId: string,
  exercises: LogSessionCreateInput['exercises'],
) {
  const existingExercises = (await tx.$queryRawUnsafe(
    'SELECT id FROM LogExercise WHERE logSessionId = ?',
    sessionId,
  )) as Array<{ id: string }>;

  if (existingExercises.length > 0) {
    const exerciseIds = existingExercises.map((exercise) => exercise.id);
    await tx.$executeRawUnsafe(
      `DELETE FROM LogSet WHERE logExerciseId IN (${exerciseIds.map(() => '?').join(', ')})`,
      ...exerciseIds,
    );
    await tx.$executeRawUnsafe(
      'DELETE FROM LogExercise WHERE logSessionId = ?',
      sessionId,
    );
  }

  for (const [exerciseIndex, exercise] of exercises.entries()) {
    const exerciseId = createId('log_exercise');
    await tx.$executeRawUnsafe(
      `INSERT INTO LogExercise (
        id, name, bodyPart, notes, loadTrackingEnabled, increaseWeight, position, logSessionId, routineExerciseId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      exerciseId,
      exercise.name,
      exercise.bodyPart ?? null,
      exercise.notes ?? null,
      exercise.loadTrackingEnabled ? 1 : 0,
      exercise.increaseWeight ? 1 : 0,
      exerciseIndex,
      sessionId,
      exercise.routineExerciseId ?? null,
    );

    for (const [setIndex, set] of exercise.sets.entries()) {
      await tx.$executeRawUnsafe(
        `INSERT INTO LogSet (
          id, setNumber, reps, load, completed, rpe, notes, logExerciseId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        createId('log_set'),
        set.setNumber ?? setIndex + 1,
        set.reps ?? null,
        set.load ?? null,
        set.completed === false ? 0 : 1,
        set.rpe ?? null,
        set.notes ?? null,
        exerciseId,
      );
    }
  }
}

export async function createLogSession(input: LogSessionCreateInput) {
  const id = createId('log_session');
  const now = new Date().toISOString();

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `INSERT INTO LogSession (
        id, title, performedAt, notes, durationMinutes, createdAt, updatedAt, routineId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      id,
      input.title,
      input.performedAt.toISOString(),
      input.notes ?? null,
      input.durationMinutes ?? null,
      now,
      now,
      input.routineId ?? null,
    );

    await replaceSessionChildren(tx, id, input.exercises);
  });

  return getLogSessionById(id) as Promise<
    NonNullable<Awaited<ReturnType<typeof getLogSessionById>>>
  >;
}

export async function createLogSessionFromRoutine(routineId: string) {
  const routine = (await prisma.$queryRawUnsafe(
    'SELECT * FROM Routine WHERE id = ?',
    routineId,
  )) as Array<{ id: string; title: string }>;

  if (routine.length === 0) {
    return null;
  }

  const blocks = (await prisma.$queryRawUnsafe(
    'SELECT id FROM RoutineBlock WHERE routineId = ? ORDER BY position ASC',
    routineId,
  )) as Array<{ id: string }>;

  const blockIds = blocks.map((block) => block.id);
  const exercises = (await prisma.$queryRawUnsafe(
    blockIds.length
      ? `SELECT * FROM RoutineExercise WHERE routineBlockId IN (${blockIds
          .map(() => '?')
          .join(', ')}) ORDER BY position ASC`
      : 'SELECT * FROM RoutineExercise WHERE 1 = 0',
    ...blockIds,
  )) as Array<{
    id: string;
    name: string;
    bodyPart: string | null;
    targetSets: number | null;
    targetReps: string | null;
    notes: string | null;
    loadTrackingEnabled: number;
  }>;

  return createLogSession({
    title: routine[0].title,
    performedAt: new Date(),
    routineId,
    exercises: exercises.map((exercise) => ({
      name: exercise.name,
      bodyPart: exercise.bodyPart,
      notes: exercise.notes,
      loadTrackingEnabled: Boolean(exercise.loadTrackingEnabled),
      increaseWeight: false,
      routineExerciseId: exercise.id,
      sets: Array.from({ length: exercise.targetSets ?? 1 }, (_, index) => ({
        setNumber: index + 1,
        reps: exercise.targetReps,
        load: null,
        completed: true,
        rpe: null,
        notes: null,
      })),
    })),
  });
}

export async function updateLogSession(
  id: string,
  input: LogSessionCreateInput,
) {
  const existing = await getLogSessionById(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      `UPDATE LogSession
       SET title = ?, performedAt = ?, notes = ?, durationMinutes = ?, updatedAt = ?, routineId = ?
       WHERE id = ?`,
      input.title,
      input.performedAt.toISOString(),
      input.notes ?? null,
      input.durationMinutes ?? null,
      now,
      input.routineId ?? null,
      id,
    );

    await replaceSessionChildren(tx, id, input.exercises);
  });

  return getLogSessionById(id);
}

export async function getLogSessionById(id: string) {
  const { sessions, exercises, sets, routines } = await fetchLogSessionGraph([
    id,
  ]);
  const session = sessions[0];
  if (!session) return null;
  return mapLogSessionRecord(session, exercises, sets, routines);
}

export async function listLogSessions(filters: LogSessionFilters = {}) {
  const { sessions, exercises, routines } = await fetchLogSessionGraph();

  const query = filters.query?.trim().toLowerCase() ?? '';
  const source = filters.source ?? 'all';

  return sessions
    .map((session) => ({
      id: session.id,
      title: session.title,
      performedAt: new Date(session.performedAt),
      durationMinutes: session.durationMinutes,
      updatedAt: new Date(session.updatedAt),
      routine: session.routineId
        ? (routines.find((routine) => routine.id === session.routineId) ?? null)
        : null,
      _count: {
        exercises: exercises.filter(
          (exercise) => exercise.logSessionId === session.id,
        ).length,
      },
    }))
    .filter((session) => {
      if (filters.routineId && session.routine?.id !== filters.routineId) {
        return false;
      }

      if (source === 'routine' && !session.routine) {
        return false;
      }

      if (source === 'free' && session.routine) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [session.title, session.routine?.title]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    })
    .sort((a, b) => b.performedAt.getTime() - a.performedAt.getTime());
}

export type ExerciseHistoryEntry = {
  performedAt: Date;
  sessionTitle: string;
  sets: { setNumber: number; reps: string | null; load: string | null; rpe: number | null }[];
};

export async function getExerciseHistory(
  name: string,
  limit = 5,
): Promise<ExerciseHistoryEntry[]> {
  const exercises = (await prisma.$queryRawUnsafe(
    `SELECT le.id, le.name, ls.performedAt, ls.title as sessionTitle
     FROM LogExercise le
     JOIN LogSession ls ON ls.id = le.logSessionId
     WHERE LOWER(le.name) = LOWER(?)
     ORDER BY ls.performedAt DESC
     LIMIT ?`,
    name,
    limit,
  )) as Array<{ id: string; name: string; performedAt: string; sessionTitle: string }>;

  if (exercises.length === 0) return [];

  const exerciseIds = exercises.map((e) => e.id);
  const sets = (await prisma.$queryRawUnsafe(
    `SELECT id, setNumber, reps, load, rpe, logExerciseId
     FROM LogSet
     WHERE logExerciseId IN (${exerciseIds.map(() => '?').join(', ')})
     ORDER BY setNumber ASC`,
    ...exerciseIds,
  )) as Array<{ id: string; setNumber: number; reps: string | null; load: string | null; rpe: number | null; logExerciseId: string }>;

  return exercises.map((exercise) => ({
    performedAt: new Date(exercise.performedAt),
    sessionTitle: exercise.sessionTitle,
    sets: sets
      .filter((set) => set.logExerciseId === exercise.id)
      .map((set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        load: set.load,
        rpe: set.rpe,
      })),
  }));
}
