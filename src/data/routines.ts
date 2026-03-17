import { createId } from '@/domain/ids';
import { prisma } from '@/lib/prisma';

export type RoutineCreateInput = {
  title: string;
  description?: string | null;
  focus?: string | null;
  blocks: {
    title: string;
    exercises: {
      name: string;
      targetSets?: number | null;
      targetReps?: string | null;
      restSeconds?: number | null;
      notes?: string | null;
      loadTrackingEnabled?: boolean;
    }[];
  }[];
};

type RoutineRow = {
  id: string;
  title: string;
  description: string | null;
  focus: string | null;
  createdAt: string;
  updatedAt: string;
};

type RoutineBlockRow = {
  id: string;
  title: string;
  position: number;
  routineId: string;
};

type RoutineExerciseRow = {
  id: string;
  name: string;
  targetSets: number | null;
  targetReps: string | null;
  restSeconds: number | null;
  notes: string | null;
  loadTrackingEnabled: number;
  position: number;
  routineBlockId: string;
};

type RoutineSessionCountRow = {
  routineId: string;
  count: number;
};

type SqlExecutor = Pick<typeof prisma, '$queryRawUnsafe' | '$executeRawUnsafe'>;

async function ensureRoutineTables() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Routine (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      focus TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS RoutineBlock (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      position INTEGER NOT NULL,
      routineId TEXT NOT NULL,
      FOREIGN KEY (routineId) REFERENCES Routine(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS RoutineExercise (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      targetSets INTEGER,
      targetReps TEXT,
      restSeconds INTEGER,
      notes TEXT,
      loadTrackingEnabled INTEGER NOT NULL DEFAULT 0,
      position INTEGER NOT NULL,
      routineBlockId TEXT NOT NULL,
      FOREIGN KEY (routineBlockId) REFERENCES RoutineBlock(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS RoutineBlock_routineId_position_idx ON RoutineBlock(routineId, position)',
  );
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS RoutineExercise_blockId_position_idx ON RoutineExercise(routineBlockId, position)',
  );
}

function mapRoutineRecord(
  routine: RoutineRow,
  blocks: RoutineBlockRow[],
  exercises: RoutineExerciseRow[],
) {
  return {
    id: routine.id,
    title: routine.title,
    description: routine.description,
    focus: routine.focus,
    createdAt: new Date(routine.createdAt),
    updatedAt: new Date(routine.updatedAt),
    blocks: blocks
      .filter((block) => block.routineId === routine.id)
      .sort((a, b) => a.position - b.position)
      .map((block) => ({
        id: block.id,
        title: block.title,
        position: block.position,
        exercises: exercises
          .filter((exercise) => exercise.routineBlockId === block.id)
          .sort((a, b) => a.position - b.position)
          .map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            targetSets: exercise.targetSets,
            targetReps: exercise.targetReps,
            restSeconds: exercise.restSeconds,
            notes: exercise.notes,
            loadTrackingEnabled: Boolean(exercise.loadTrackingEnabled),
            position: exercise.position,
          })),
      })),
  };
}

async function fetchRoutineGraph(routineIds?: string[]) {
  await ensureRoutineTables();

  const routines = (await prisma.$queryRawUnsafe(
    routineIds?.length
      ? `SELECT * FROM Routine WHERE id IN (${routineIds.map(() => '?').join(', ')})`
      : 'SELECT * FROM Routine',
    ...(routineIds ?? []),
  )) as RoutineRow[];

  const blocks = (await prisma.$queryRawUnsafe(
    routineIds?.length
      ? `SELECT * FROM RoutineBlock WHERE routineId IN (${routineIds
          .map(() => '?')
          .join(', ')}) ORDER BY position ASC`
      : 'SELECT * FROM RoutineBlock ORDER BY position ASC',
    ...(routineIds ?? []),
  )) as RoutineBlockRow[];

  const blockIds = blocks.map((block) => block.id);
  const exercises = (await prisma.$queryRawUnsafe(
    blockIds.length
      ? `SELECT * FROM RoutineExercise WHERE routineBlockId IN (${blockIds
          .map(() => '?')
          .join(', ')}) ORDER BY position ASC`
      : 'SELECT * FROM RoutineExercise WHERE 1 = 0',
    ...blockIds,
  )) as RoutineExerciseRow[];

  return { routines, blocks, exercises };
}

async function replaceRoutineChildren(
  tx: SqlExecutor,
  routineId: string,
  blocks: RoutineCreateInput['blocks'],
) {
  const existingBlocks = (await tx.$queryRawUnsafe(
    'SELECT id FROM RoutineBlock WHERE routineId = ?',
    routineId,
  )) as Array<{ id: string }>;

  if (existingBlocks.length > 0) {
    const existingBlockIds = existingBlocks.map((block) => block.id);
    await tx.$executeRawUnsafe(
      `DELETE FROM RoutineExercise WHERE routineBlockId IN (${existingBlockIds
        .map(() => '?')
        .join(', ')})`,
      ...existingBlockIds,
    );
    await tx.$executeRawUnsafe(
      'DELETE FROM RoutineBlock WHERE routineId = ?',
      routineId,
    );
  }

  for (const [blockIndex, block] of blocks.entries()) {
    const blockId = createId('routine_block');
    await tx.$executeRawUnsafe(
      'INSERT INTO RoutineBlock (id, title, position, routineId) VALUES (?, ?, ?, ?)',
      blockId,
      block.title,
      blockIndex,
      routineId,
    );

    for (const [exerciseIndex, exercise] of block.exercises.entries()) {
      await tx.$executeRawUnsafe(
        `INSERT INTO RoutineExercise (
          id, name, targetSets, targetReps, restSeconds, notes, loadTrackingEnabled, position, routineBlockId
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        createId('routine_exercise'),
        exercise.name,
        exercise.targetSets ?? null,
        exercise.targetReps ?? null,
        exercise.restSeconds ?? null,
        exercise.notes ?? null,
        exercise.loadTrackingEnabled ? 1 : 0,
        exerciseIndex,
        blockId,
      );
    }
  }
}

export async function createRoutine(input: RoutineCreateInput) {
  await ensureRoutineTables();

  const id = createId('routine');
  const now = new Date().toISOString();

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      'INSERT INTO Routine (id, title, description, focus, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
      id,
      input.title,
      input.description ?? null,
      input.focus ?? null,
      now,
      now,
    );

    await replaceRoutineChildren(tx, id, input.blocks);
  });

  return getRoutineById(id) as Promise<
    NonNullable<Awaited<ReturnType<typeof getRoutineById>>>
  >;
}

export async function updateRoutine(id: string, input: RoutineCreateInput) {
  await ensureRoutineTables();

  const existing = await getRoutineById(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();

  await prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(
      'UPDATE Routine SET title = ?, description = ?, focus = ?, updatedAt = ? WHERE id = ?',
      input.title,
      input.description ?? null,
      input.focus ?? null,
      now,
      id,
    );

    await replaceRoutineChildren(tx, id, input.blocks);
  });

  return getRoutineById(id);
}

export async function duplicateRoutine(id: string) {
  const existing = await getRoutineById(id);
  if (!existing) {
    return null;
  }

  const duplicateTitle = existing.title?.trim()
    ? `${existing.title} (Copy)`
    : 'Routine copy';

  return createRoutine({
    title: duplicateTitle,
    description: existing.description,
    focus: existing.focus,
    blocks: existing.blocks.map((block) => ({
      title: block.title,
      exercises: block.exercises.map((exercise) => ({
        name: exercise.name,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        restSeconds: exercise.restSeconds,
        notes: exercise.notes,
        loadTrackingEnabled: exercise.loadTrackingEnabled,
      })),
    })),
  });
}

export async function getRoutineById(id: string) {
  const { routines, blocks, exercises } = await fetchRoutineGraph([id]);
  const routine = routines[0];
  if (!routine) return null;
  return mapRoutineRecord(routine, blocks, exercises);
}

export async function listRoutines() {
  const { routines, blocks, exercises } = await fetchRoutineGraph();
  const sessionCounts = (await prisma
    .$queryRawUnsafe(
      `
    SELECT routineId, COUNT(*) as count
    FROM LogSession
    WHERE routineId IS NOT NULL
    GROUP BY routineId
  `,
    )
    .catch(() => [])) as RoutineSessionCountRow[];

  return routines
    .map((routine) => {
      const mapped = mapRoutineRecord(routine, blocks, exercises);
      const count =
        sessionCounts.find((row) => row.routineId === routine.id)?.count ?? 0;

      return {
        ...mapped,
        _count: {
          blocks: mapped.blocks.length,
          sessions: count,
        },
      };
    })
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}
