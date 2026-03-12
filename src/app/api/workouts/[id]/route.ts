import { NextResponse } from 'next/server';

import { updateWorkout } from '@/data/workouts';
import { parseWorkoutPayload } from '../payload';

export const runtime = 'nodejs';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const body = await request.json().catch(() => null);
  const payload = parseWorkoutPayload(body);

  if (!payload) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id } = await params;
  const updated = await updateWorkout(id, payload);

  if (!updated) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  return NextResponse.json({ id: updated.id });
}
