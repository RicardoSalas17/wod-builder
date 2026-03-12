import { NextResponse } from 'next/server';
import { BlockType } from '@prisma/client';

import { createWorkout } from '@/data/workouts';

export const runtime = 'nodejs';

const blockTypeMap: Record<string, BlockType> = {
  warmup: 'WARMUP',
  strength: 'STRENGTH',
  metcon: 'METCON',
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !Array.isArray(body.blocks)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const title = typeof body.title === 'string' ? body.title.trim() : '';

  const blocks = body.blocks
    .map((block: any) => {
      const type = blockTypeMap[String(block?.type)];
      if (!type) return null;

      const movements = Array.isArray(block.movements) ? block.movements : [];
      return {
        type,
        title: typeof block.title === 'string' ? block.title.trim() : '',
        movements: movements.map((movement: any) => ({
          name:
            typeof movement?.name === 'string' ? movement.name.trim() : '',
          load:
            typeof movement?.load === 'string' && movement.load.trim()
              ? movement.load.trim()
              : null,
          reps:
            typeof movement?.reps === 'string' && movement.reps.trim()
              ? movement.reps.trim()
              : null,
          notes:
            typeof movement?.notes === 'string' && movement.notes.trim()
              ? movement.notes.trim()
              : null,
        })),
      };
    })
    .filter(Boolean);

  const created = await createWorkout({
    title,
    blocks,
  });

  return NextResponse.json({ id: created.id });
}
