import { NextResponse } from 'next/server';

import { createWorkout } from '@/data/workouts';
import { parseWorkoutPayload } from './payload';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const payload = parseWorkoutPayload(body);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const created = await createWorkout(payload);

  return NextResponse.json({ id: created.id });
}
