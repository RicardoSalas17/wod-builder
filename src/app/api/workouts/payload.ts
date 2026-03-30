import { BlockType } from '@prisma/client';

import type { WorkoutCreateInput } from '@/data/workouts';

const blockTypeMap: Record<string, BlockType> = {
  warmup: 'WARMUP',
  strength: 'STRENGTH',
  metcon: 'METCON',
};

export function parseWorkoutPayload(body: unknown): WorkoutCreateInput | null {
  if (!body || typeof body !== 'object') {
    return null;
  }

  const candidate = body as {
    title?: unknown;
    blocks?: unknown;
  };

  if (!Array.isArray(candidate.blocks)) {
    return null;
  }

  const blocks: WorkoutCreateInput['blocks'] = [];

  for (const block of candidate.blocks) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    const nextBlock = block as {
      type?: unknown;
      title?: unknown;
      movements?: unknown;
    };

    const type = blockTypeMap[String(nextBlock.type)];
    if (!type) {
      continue;
    }

    const movements = (
      Array.isArray(nextBlock.movements) ? nextBlock.movements : []
    )
      .map((movement) => {
        const nextMovement =
          movement && typeof movement === 'object'
            ? (movement as {
                name?: unknown;
                load?: unknown;
                reps?: unknown;
                notes?: unknown;
              })
            : null;

        return {
          name:
            typeof nextMovement?.name === 'string'
              ? nextMovement.name.trim()
              : '',
          load:
            typeof nextMovement?.load === 'string' && nextMovement.load.trim()
              ? nextMovement.load.trim()
              : null,
          reps:
            typeof nextMovement?.reps === 'string' && nextMovement.reps.trim()
              ? nextMovement.reps.trim()
              : null,
          notes:
            typeof nextMovement?.notes === 'string' && nextMovement.notes.trim()
              ? nextMovement.notes.trim()
              : null,
        };
      })
      .filter((movement) => movement.name.length > 0);

    if (movements.length === 0) {
      continue;
    }

    blocks.push({
      type,
      title: typeof nextBlock.title === 'string' ? nextBlock.title.trim() : '',
      movements,
    });
  }

  if (blocks.length === 0) {
    return null;
  }

  return {
    title: typeof candidate.title === 'string' ? candidate.title.trim() : '',
    blocks,
  };
}
